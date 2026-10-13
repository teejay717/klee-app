"use client"
import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import ExpenseList from "./ExpensesList"
import ExpensesCards from "./ExpenseCards"
import { PaginationComponent } from "./PaginationComponent"
import AddExpenseDialog from "./AddExpenseDialog"
import { PeriodTabs } from "./HouseholdUI"
import { getPeriodRange, PERIOD_LABELS } from "@/lib/household"

type ExpenseParticipation = {
  id: number
  expenseId: number
  userId: string
  isPaid: boolean
}

type ExpenseItem = {
  id: number
  description: string
  amount: string | number
  apartmentId: string
  category: string
  paidByUserId: string
  date: Date | string
  createdAt: Date | string | null
}

interface FilterableExpenseListProps {
  allExpenses: ExpenseItem[]
  expenseParticipation: ExpenseParticipation[]
  activeTab: "week" | "month" | "all"
  currentPage: number
}

export default function FilterableChoreList({
  allExpenses,
  expenseParticipation = [],
  activeTab = "week",
  currentPage = 1,
}: FilterableExpenseListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageSize = 10

  const updateTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    params.set("page", "1") // Reset to first page when changing tabs
    router.push(`${pathname}?${params.toString()}`)
  }

  const periodLabel = PERIOD_LABELS[activeTab]

  const [now] = useState(() => Date.now())
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

  const filteredExpenses = allExpenses
    .filter((expense) => {
      if (activeTab === "all") return true

      const expenseDate = new Date(expense.date)
      if (activeTab === "week") return expenseDate >= oneWeekAgo
      if (activeTab === "month") return expenseDate >= oneMonthAgo

      return false
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // an expense is unpaid while anyone in its split still owes
  const isSettled = (expenseId: number) =>
    expenseParticipation
      .filter((p) => p.expenseId === expenseId)
      .every((p) => p.isPaid)

  // unpaid splits are shown regardless of period so nothing owed gets hidden
  const unpaidExpenses = allExpenses
    .filter((e) => !isSettled(e.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const settledExpenses = filteredExpenses.filter((e) => isSettled(e.id))

  const totalPages = Math.max(1, Math.ceil(settledExpenses.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedExpenses = settledExpenses.slice(startIndex, endIndex)

  return (
    <div className="flex flex-col gap-6">
      <PeriodTabs
        value={activeTab}
        onValueChange={updateTab}
        range={getPeriodRange(activeTab, new Date(now))}
      />

      <ExpensesCards
        expenses={allExpenses}
        filteredExpenses={filteredExpenses}
        expenseParticipation={expenseParticipation}
        activeTab={activeTab}
      />

      <div className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-2">
        <ExpenseList
          expenses={unpaidExpenses}
          expenseParticipation={expenseParticipation}
          title="Unpaid"
          description="Waiting on roommates"
          emptyTitle="Nobody owes anything"
          emptyDescription="Unsettled splits will show here with who still needs to pay."
        />
        <ExpenseList
          expenses={paginatedExpenses}
          expenseParticipation={expenseParticipation}
          title="Settled"
          description={periodLabel}
          emptyTitle={`No expenses ${periodLabel.toLowerCase()}`}
          emptyDescription="Log rent, groceries or supplies to split them."
          emptyAction={
            <AddExpenseDialog
              variant="outline"
              triggerLabel="+ Add expense"
              className="rounded-[8px] px-3.5 py-2 text-[13px]"
            />
          }
        >
          {totalPages > 1 && (
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              getPageHref={(page) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set("tab", activeTab)
                params.set("page", page.toString())
                return `${pathname}?${params.toString()}`
              }}
            />
          )}
        </ExpenseList>
      </div>
    </div>
  )
}
