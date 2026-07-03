import { db } from "@/db"
import { chores, expenses, expenseParticipation } from "@/db/schema"
import { and, eq, isNull, inArray, desc, sql, lte, gte } from "drizzle-orm"

export async function getChoresDueOn(targetDate: Date) {
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  return await db
    .select()
    .from(chores)
    .where(
      and(
        gte(chores.deadline, startOfDay),
        lte(chores.deadline, endOfDay),
        eq(chores.isCompleted, false),
        isNull(chores.deletedAt)
      )
    )
}

export async function getUnpaidExpensesDays(daysOld: number) {
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() - daysOld)

  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  return await db
    .select({
      expenseId: expenses.id,
      description: expenses.description,
      aiSummary: expenses.aiSummary,
      amount: expenses.amount,
      paidByUserId: expenses.paidByUserId,
      participant: expenseParticipation.userId,
    })
    .from(expenses)
    .innerJoin(
      expenseParticipation,
      eq(expenseParticipation.expenseId, expenses.id)
    )
    .where(
      and(
        gte(expenses.date, startOfDay),
        lte(expenses.date, endOfDay),
        eq(expenseParticipation.isPaid, false),
        isNull(expenses.deletedAt)
      )
    )
}
