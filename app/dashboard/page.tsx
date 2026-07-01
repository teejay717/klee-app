import { db } from "@/db"
import { chores, expenseParticipation, expenses } from "@/db/schema"
import { eq, and, inArray, gte, sql, isNull } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import ChoreList from "@/components/ChoreList"
import RoommatesCard from "@/components/RoommatesCard"
import SharedExpensesCard from "@/components/SharedExpensesCard"
import HeaderComponent from "@/components/HeaderComponent"
import RecentActivityCard from "@/components/RecentActivityCard"
import DashboardHeader from "@/components/DashboardHeader"
import TestAI from "@/components/TestAI"

export default async function Page() {
  const { userId, orgId } = await auth()

  const client = await clerkClient()
  const memberships = orgId
    ? await client.organizations.getOrganizationMembershipList({
        organizationId: orgId,
      })
    : { data: [] }

  const memberMap = new Map(
    memberships?.data?.map((m) => [
      m.publicUserData?.userId,
      `${m.publicUserData?.firstName}`.trim().split(" ", 1).toString() ||
        m.publicUserData?.identifier,
    ])
  )

  const orgName = memberships?.data?.[0]?.organization.name || "Apartment"

  // Fetch only chores for THIS apartment
  const apartmentChores = orgId
    ? await db
        .select()
        .from(chores)
        .where(and(eq(chores.apartmentId, orgId), isNull(chores.deletedAt)))
    : []

  const thirtyDaysAgo = sql`now() - interval '30 days'`

  const apartmentExpenses = orgId
    ? await db
        .select({
          id: expenses.id,
          description: expenses.description,
          amount: expenses.amount,
          category: expenses.category,
          paidByUserId: expenses.paidByUserId,
          date: expenses.date,
          createdAt: expenses.createdAt,
          deletedAt: expenses.deletedAt,
          // This is the key: get the status ONLY for the current user
          isPaid: expenseParticipation.isPaid,
        })
        .from(expenses)
        .leftJoin(
          expenseParticipation,
          and(
            eq(expenses.id, expenseParticipation.expenseId),
            eq(expenseParticipation.userId, userId!)
          )
        )
        .where(
          and(
            eq(expenses.apartmentId, orgId),
            gte(expenses.date, thirtyDaysAgo),
            isNull(expenses.deletedAt)
          )
        )
    : []

  const activeChores = apartmentChores
    .filter((chore) => !chore.isCompleted)
    .sort((a, b) => {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })

  const myUnpaidExpenses = apartmentExpenses.filter(
    (expense) => !expense.isPaid
  ).length

  const myActiveChores = activeChores.filter(
    (chore) => chore.userId === userId
  ).length

  const recentPaymentsData = orgId
    ? await db
        .select({
          id: expenseParticipation.id,
          userId: expenseParticipation.userId,
          paidAt: expenseParticipation.paidAt,
          expenseDescription: expenses.description,
        })
        .from(expenseParticipation)
        .innerJoin(expenses, eq(expenses.id, expenseParticipation.expenseId))
        .where(
          and(
            eq(expenses.apartmentId, orgId),
            eq(expenseParticipation.isPaid, true),
            gte(expenseParticipation.paidAt, thirtyDaysAgo)
          )
        )
    : []

  const completedChores = apartmentChores
    .filter((chore) => chore.isCompleted)
    .sort((a, b) => {
      // if there is no completion date move to the bottom
      if (!a.completedAt) return 1
      if (!b.completedAt) return -1
      // shows latest/recently completed first
      return (
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
    })

  const dashboardChores = [...activeChores, ...completedChores].slice(0, 5)

  const recentChores = apartmentChores
    .filter((chore) => chore.isCompleted)
    .map((chore) => ({
      id: chore.id,
      type: "chore" as const,
      title: chore.title,
      userName: "Member",
      userId: chore.userId,
      time: `${chore.completedAt}`.endsWith("Z")
        ? chore.completedAt
        : `${chore.completedAt}Z`,
    }))
    .sort((a, b) => {
      if (!a.time) return 1
      if (!b.time) return -1
      return new Date(b.time).getTime() - new Date(a.time).getTime()
    })

  const recentExpenses = apartmentExpenses
    .map((e) => ({
      id: e.id,
      type: "expense" as const,
      title: e.description,
      userName: "Member",
      time: `${e.createdAt}`.endsWith("Z") ? e.createdAt : `${e.createdAt}Z`,
      userId: e.paidByUserId,
      category: e.category,
      amount: e.amount,
    }))
    .sort((a, b) => {
      if (!a.time) return 1
      if (!b.time) return -1
      return new Date(b.time).getTime() - new Date(a.time).getTime()
    })

  const recentPayments = recentPaymentsData
    .filter((p) => p.paidAt)
    .map((p) => ({
      id: `payment-${p.id}`,
      type: "payment" as const,
      title: p.expenseDescription,
      userName: "Member",
      time: `${p.paidAt}`.endsWith("Z") ? p.paidAt : `${p.paidAt}Z`,
      userId: p.userId,
      category: "Payment",
      amount: "0",
    }))

  const recentActivity = [...recentChores, ...recentExpenses, ...recentPayments]
    .map((item) => ({
      ...item,
      userName:
        item.type === "chore"
          ? memberMap.get(item.userId) || "Unknown"
          : memberMap.get(item.userId) || "Unknown",
    }))
    .sort((a, b) => {
      const dateA = new Date(a.time as string).getTime()
      const dateB = new Date(b.time as string).getTime()
      return dateB - dateA
    })
    .slice(0, 5)

  const participations =
    apartmentExpenses.length > 0
      ? await db
          .select()
          .from(expenseParticipation)
          .where(
            inArray(
              expenseParticipation.expenseId,
              apartmentExpenses.map((e) => e.id)
            )
          )
      : []

  return (
    <div>
      {/* <HeaderComponent
        title="Dashboard"
        description="Welcome back! Here's your apartment overview."
      /> */}
      <main className="mx-auto mt-10 max-w-7xl p-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <div className="md:col-span-5">
              <DashboardHeader
                unpaidExpenses={myUnpaidExpenses}
                pendingChores={myActiveChores}
                orgName={orgName}
              />
            </div>
            <div className="md:col-span-3">
              <SharedExpensesCard
                expenses={apartmentExpenses}
                expenseParticipation={participations}
              />
            </div>
            <div className="md:col-span-2">
              <RoommatesCard />
            </div>
          </div>
          <ChoreList chores={dashboardChores} buttonOn={true} />
          <RecentActivityCard activities={recentActivity} />
          {/* <TestAI apartmentId={orgId as string} /> */}
        </div>
      </main>
    </div>
  )
}
