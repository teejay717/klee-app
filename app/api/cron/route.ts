import { NextResponse } from "next/server"
import { Resend } from "resend"
import { clerkClient } from "@clerk/nextjs/server"
import { getChoresDueOn, getUnpaidExpensesDays } from "@/server/cron-queries"
import ChoreReminder from "@/react-email-starter/emails/ChoreReminder"
import ExpenseReminder from "@/react-email-starter/emails/ExpenseReminder"

const resend = new Resend(process.env.RESEND_API_KEY)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const clerk = await clerkClient()
    const today = new Date()

    const [rawChoresDueToday, rawUnpaidExpenses6Days] = await Promise.all([
      getChoresDueOn(today),
      getUnpaidExpensesDays(6),
    ])

    const groupedChores = rawChoresDueToday.reduce(
      (acc, chore) => {
        if (!chore.userId) return acc
        if (!acc[chore.userId]) {
          acc[chore.userId] = []
        }
        acc[chore.userId].push(chore)
        return acc
      },
      {} as Record<string, (typeof rawChoresDueToday)[number][]>

      // TODO Understand what this means
    )

    const groupedUnpaidExpenses = rawUnpaidExpenses6Days.reduce(
      (acc, expense) => {
        const debtorId = expense.participant
        if (!debtorId) return acc
        if (!acc[debtorId]) {
          acc[debtorId] = []
        }
        acc[debtorId].push({
          expenseId: expense.expenseId,
          payerId: expense.paidByUserId,
          aiSummary: expense.aiSummary || "a shared expense",
          amount: expense.amount,
        })
        return acc
      },
      {} as Record<
        string,
        Array<{
          expenseId: number
          payerId: string
          aiSummary: string
          amount: string
        }>
      >
    )

    const uniqueUserIds = [
      ...new Set([
        ...Object.keys(groupedChores),
        ...Object.keys(groupedUnpaidExpenses),
        ...Object.values(groupedUnpaidExpenses).flatMap((debts) =>
          debts.map((debt) => debt.payerId)
        ),
      ]),
    ].filter(Boolean)

    const userResults = await Promise.allSettled(
      uniqueUserIds.map(async (userId) => {
        const user = await clerk.users.getUser(userId)
        return [userId, user] as const
      })
    )

    userResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to fetch Clerk user ${uniqueUserIds[index]}:`,
          result.reason
        )
      }
    })

    const userById = new Map(
      userResults
        .filter(
          (result): result is PromiseFulfilledResult<readonly [string, any]> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value)
    )

    const choreResults = []

    for (const [userId, chores] of Object.entries(groupedChores)) {
      try {
        const user = userById.get(userId)
        const emailAddress = user?.emailAddresses[0]?.emailAddress
        const firstName = user?.firstName || "Roommate"

        if (!emailAddress) continue

        await resend.emails.send({
          from: "Klee <system@mail.terenzdantes.app>",
          to: emailAddress,
          subject: "Chore Reminder",
          react: ChoreReminder({
            userName: firstName,
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

    for (const [debtorId, rawDebts] of Object.entries(groupedUnpaidExpenses)) {
      try {
        const debtorUser = userById.get(debtorId)
        const debtorEmailAddress = debtorUser?.emailAddresses[0]?.emailAddress
        const debtorFirstName = debtorUser?.firstName || "Roommate"

        if (!debtorEmailAddress) continue

        const strucuturedDebts = rawDebts.map((debt) => {
          const participantsForExpense = [
            ...new Set([
              ...rawUnpaidExpenses6Days
                .filter((item) => item.expenseId === debt.expenseId)
                .map((item) => item.participant),
              debt.payerId,
            ]),
          ].filter(Boolean)

          const shareAmount =
            Number(debt.amount) / participantsForExpense.length

          return {
            payerName: userById.get(debt.payerId)?.firstName || "a roommate",
            aiSummary: debt.aiSummary,
            amount: shareAmount.toFixed(2),
          }
        })

        await resend.emails.send({
          from: "Klee <system@mail.terenzdantes.app>",
          to: debtorEmailAddress,
          subject: "Expense Reminder",
          react: ExpenseReminder({
            debtorName: debtorFirstName,
            debts: strucuturedDebts,
          }),
        })

        expenseResults.push({ status: "fulfilled" as const })
      } catch (error) {
        expenseResults.push({ status: "rejected" as const, reason: error })
      }

      await delay(600)
    }

    const sendFailures = [...choreResults, ...expenseResults].filter(
      (result) => result.status === "rejected"
    ).length

    return NextResponse.json(
      {
        ok: true,
        choresProcessed: Object.keys(groupedChores).length,
        expensesProcessed: Object.keys(groupedUnpaidExpenses).length,
        sendFailures,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Cron Failed" }, { status: 500 })
  }
}
