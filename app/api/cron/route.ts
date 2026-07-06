import { NextResponse } from "next/server"
import { Resend } from "resend"
import { clerkClient } from "@clerk/nextjs/server"
import { getChoresDueOn, getUnpaidExpensesDays } from "@/server/cron-queries"
import ChoreReminder from "@/react-email-starter/emails/ChoreReminder"
import ExpenseReminder from "@/react-email-starter/emails/ExpenseReminder"

const resend = new Resend(process.env.RESEND_API_KEY)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type ChoreRow = Awaited<ReturnType<typeof getChoresDueOn>>[number]
type ExpenseRow = Awaited<ReturnType<typeof getUnpaidExpensesDays>>[number]

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const clerk = await clerkClient()
    const today = new Date()

    const [rawChores, rawExpenses] = await Promise.all([
      getChoresDueOn(today),
      getUnpaidExpensesDays(6),
    ])

    const choresByApartment = rawChores.reduce(
      (acc, chore) => {
        const apartmentId = chore.apartmentId
        if (!acc[apartmentId]) acc[apartmentId] = []
        acc[apartmentId].push(chore)
        return acc
      },
      {} as Record<string, ChoreRow[]>
    )

    const expensesByApartment = rawExpenses.reduce(
      (acc, expense) => {
        const apartmentId = expense.apartmentId
        if (!acc[apartmentId]) acc[apartmentId] = []
        acc[apartmentId].push(expense)
        return acc
      },
      {} as Record<string, ExpenseRow[]>
    )

    const apartmentIds = [
      ...new Set([
        ...Object.keys(choresByApartment),
        ...Object.keys(expensesByApartment),
      ]),
    ]

    for (const apartmentId of apartmentIds) {
      const apartmentChores = choresByApartment[apartmentId] ?? []
      const apartmentExpenses = expensesByApartment[apartmentId] ?? []

      const membership = await clerk.organizations.getOrganization({
        organizationId: apartmentId,
      })
      const apartmentName = membership.name

      const choresByUser = apartmentChores.reduce(
        (acc, chore) => {
          if (!acc[chore.userId]) acc[chore.userId] = []
          acc[chore.userId].push(chore)
          return acc
        },
        {} as Record<string, ChoreRow[]>
      )

      const expensesByUser = apartmentExpenses.reduce(
        (acc, expense) => {
          if (!acc[expense.participant]) acc[expense.participant] = []
          acc[expense.participant].push(expense)
          return acc
        },
        {} as Record<string, ExpenseRow[]>
      )

      const userIds = [
        ...new Set([
          ...Object.keys(choresByUser),
          ...Object.keys(expensesByUser),
          ...apartmentExpenses.map((expense) => expense.paidByUserId),
        ]),
      ]

      const users = await Promise.allSettled(
        userIds.map(async (userId) => {
          const user = await clerk.users.getUser(userId)
          return [userId, user] as const
        })
      )

      const userById = new Map(
        users
          .filter(
            (
              result
            ): result is PromiseFulfilledResult<readonly [string, any]> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value)
      )

      const choreResults = []

      for (const [userId, chores] of Object.entries(choresByUser)) {
        try {
          const user = userById.get(userId)
          const emailAddress = user?.emailAddresses[0]?.emailAddress
          if (!emailAddress) continue

          await resend.emails.send({
            from: "Klee <system@mail.terenzdantes.app>",
            to: emailAddress,
            subject: `Chore Reminder - ${apartmentName}`,
            react: ChoreReminder({
              userName: user?.firstName || "Roommate",
              choreTitles: chores.map((chore) => chore.title),
            }),
          })
          choreResults.push({ status: "fulfilled" as const })
        } catch (error) {
          choreResults.push({ status: "rejected" as const, reason: error })
        }

        await delay(600)
      }

      const expenseResults = []

      for (const [userId, debts] of Object.entries(expensesByUser)) {
        try {
          const user = userById.get(userId)
          const emailAddress = user?.emailAddresses[0]?.emailAddress
          if (!emailAddress) continue

          const strucuturedDebts = debts.map((debt) => {
            const participantsForExpense = [
              ...new Set([
                ...apartmentExpenses
                  .filter((item) => item.expenseId === debt.expenseId)
                  .map((item) => item.participant),
                debt.paidByUserId,
              ]),
            ].filter(Boolean)

            const shareAmount =
              Number(debt.amount) / participantsForExpense.length

            return {
              payerName:
                userById.get(debt.paidByUserId)?.firstName || "a roommate",
              aiSummary: debt.aiSummary || "a shared expense",
              amount: shareAmount.toFixed(2),
            }
          })

          await resend.emails.send({
            from: "Klee <system@mail.terenzdantes.app>",
            to: emailAddress,
            subject: `Expense Reminder - ${apartmentName}`,
            react: ExpenseReminder({
              debtorName: user?.firstName || "Roommate",
              debts: strucuturedDebts,
            }),
          })
          expenseResults.push({ status: "fulfilled" as const })
        } catch (error) {
          expenseResults.push({ status: "rejected" as const, reason: error })
        }
        await delay(600)
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Cron Failed" }, { status: 500 })
  }
}
