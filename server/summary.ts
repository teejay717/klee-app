import { db } from "@/db"
import { expenses, expenseParticipation, chores } from "@/db/schema"
import { eq, and, desc, inArray } from "drizzle-orm"
import { clerkClient } from "@clerk/nextjs/server"

type MemberNameMap = Record<string, string>

function buildDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  identifier?: string | null
) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim()
  return fullName || identifier || "Unknown Member"
}

export async function getApartmentSummaryData(apartmentId: string) {
  const client = await clerkClient()
  const memberships = await client.organizations.getOrganizationMembershipList({
    organizationId: apartmentId,
  })

  const memberNameMap: MemberNameMap = memberships.data.reduce((acc, m) => {
    const user = m.publicUserData
    if (user?.userId) {
      acc[user.userId] = buildDisplayName(
        user.firstName,
        user.lastName,
        user.identifier
      )
    }
    return acc
  }, {} as MemberNameMap)

  const getName = (userId: string | null | undefined) => {
    return userId
      ? (memberNameMap[userId] ?? "Unknown Member")
      : "Unknown Member"
  }

  const activeChores = await db
    .select()
    .from(chores)
    .where(
      and(eq(chores.apartmentId, apartmentId), eq(chores.isCompleted, false))
    )

  const recentlyCompletedChores = await db
    .select()
    .from(chores)
    .where(
      and(eq(chores.apartmentId, apartmentId), eq(chores.isCompleted, true))
    )
    .limit(5)
    .orderBy(desc(chores.completedAt)) // Get the most recent completed chores

  const rawChoresData = [...activeChores, ...recentlyCompletedChores]

  const rawExpensesData = await db
    .select()
    .from(expenses)
    .where(eq(expenses.apartmentId, apartmentId))

  const rawParticipationData =
    rawExpensesData.length > 0
      ? await db
          .select()
          .from(expenseParticipation)
          .where(
            inArray(
              expenseParticipation.expenseId,
              rawExpensesData.map((expense) => expense.id)
            )
          )
      : []

  const participationByExpense = Map.groupBy(
    rawParticipationData,
    (ep) => ep.expenseId
  )

  const choresData = rawChoresData.map((chore) => ({
    ...chore,
    assigneeName: getName(chore.userId),
    createdByName: getName(chore.createdByUserId),
  }))

  const expenseData = rawExpensesData.map((expense) => {
    const participants = participationByExpense.get(expense.id) ?? []
    const unpaidParticipants = participants.filter((p) => !p.isPaid)

    return {
      ...expense,
      paidByName: getName(expense.paidByUserId),
      participants: participants.map((p) => ({
        ...p,
        name: getName(p.userId),
      })),
      unpaidParticipants: unpaidParticipants.map((p) => ({
        userId: p.userId,
        name: getName(p.userId),
      })),
    }
  })

  return { members: memberNameMap, choresData, expenseData }
}
