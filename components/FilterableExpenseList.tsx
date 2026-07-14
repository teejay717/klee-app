"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpenseList from "./ExpensesList"
import ExpensesCards from "./ExpenseCards"

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
  totalPages: number
}

export default function FilterableChoreList({
  allExpenses,
  expenseParticipation = [],
  activeTab = "week",
  currentPage = 1,
  totalPages = 1,
}: FilterableExpenseListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    params.set("page", "1") // Reset to first page when changing tabs
    router.push(`${pathname}?${params.toString()}`)
  }

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", activeTab)
    params.set("page", page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const tabTitle =
    activeTab === "all"
      ? "All Expenses"
      : activeTab === "month"
        ? "This Month's Expenses"
        : "This Week's Expenses"

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const filteredExpenses = allExpenses
    .filter((expense) => {
      if (activeTab === "all") return true

      const expenseDate = new Date(expense.date)
      if (activeTab === "week") return expenseDate >= oneWeekAgo
      if (activeTab === "month") return expenseDate >= oneMonthAgo

      return false
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <section className="mb-6">
        <ExpensesCards
          expenses={allExpenses}
          filteredExpenses={filteredExpenses}
          expenseParticipation={expenseParticipation}
          activeTab={activeTab}
        />
      </section>
      <div>
        <Tabs value={activeTab} onValueChange={updateTab}>
          <TabsList className="mb-2 grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <ExpenseList
              expenses={filteredExpenses}
              expenseParticipation={expenseParticipation}
              title={tabTitle}
              description="Shared expenses and their payment status"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
