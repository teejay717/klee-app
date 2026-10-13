"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useApartment } from "@/context/ApartmentContext"
import { formatPeso, toDate } from "@/lib/household"
import { EmptyState, MemberAvatar, PanelHeader } from "./HouseholdUI"

type ExpenseItem = {
  id: number
  amount: string | number
  description: string
  paidByUserId: string
  date: Date | string
}

type ParticipationItem = {
  userId: string
  expenseId: number
  isPaid: boolean
}

type ExpensesCardProps = {
  expenses: ExpenseItem[]
  expenseParticipation: ParticipationItem[]
}

// Totals for these expenses now live in the dashboard stat strip (DashboardHeader).
export default function SharedExpensesCard({ expenses }: ExpensesCardProps) {
  const { members, currentUserId } = useApartment()
  const memberLabelById = new Map(members.map((m) => [m.userId, m.label]))

  const recent = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <Card className="gap-3.5 p-[22px]">
      <PanelHeader
        title="Expenses"
        meta={expenses.length > 0 ? "Last 30 days" : undefined}
      />

      {recent.length === 0 ? (
        <EmptyState
          title="Nothing shared in the last 30 days"
          description="Log rent, groceries or supplies to split them."
        />
      ) : (
        <div className="flex flex-col">
          {recent.map((expense) => {
            const payer =
              expense.paidByUserId === currentUserId
                ? "You"
                : (memberLabelById.get(expense.paidByUserId) ?? "Unknown").split(" ")[0]
            const date = toDate(expense.date)?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })

            return (
              <div
                key={expense.id}
                className="flex items-center gap-3 border-t border-row-divider px-1 py-3"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-semibold">
                    {expense.description}
                  </span>
                  <span className="truncate text-[13px] text-muted-foreground">
                    {payer} · {date ?? "No date"}
                  </span>
                </div>
                <span className="text-[15px] font-semibold tabular-nums">
                  {formatPeso(Number(expense.amount))}
                </span>
                <MemberAvatar userId={expense.paidByUserId} size={24} />
              </div>
            )
          })}
        </div>
      )}

      {expenses.length > recent.length ? (
        <Link
          href="/expenses"
          className="self-start py-1 text-sm font-semibold text-primary transition-colors duration-[120ms] hover:text-primary-hover"
        >
          View all {expenses.length} expenses
        </Link>
      ) : null}
    </Card>
  )
}
