"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AddExpenseDialog from "./AddExpenseDialog"
import { useApartment } from "@/context/ApartmentContext"

type ExpenseItem = {
  id: number
  amount: string | number
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

export default function SharedExpensesCard({
  expenses,
  expenseParticipation = [],
}: ExpensesCardProps) {
  const { currentUserId } = useApartment()
  const totalAmount = expenses.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  )

  const yourShare = expenses.reduce((acc, expense) => {
    const myParticipation = expenseParticipation.find(
      (p) => p.expenseId === expense.id && p.userId === currentUserId
    )

    const amountToAdd =
      myParticipation && !myParticipation.isPaid
        ? Number(expense.amount) /
          expenseParticipation.filter((p) => p.expenseId === expense.id).length
        : 0

    return acc + amountToAdd
  }, 0)

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <Card className="h-52 w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold">Shared Expenses</CardTitle>
          <CardDescription>Past 30 days overview</CardDescription>
        </div>
        <CardAction className="self-auto">
          <AddExpenseDialog />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="mt-4 grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Shared
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Rent, groceries, supplies
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Your Share
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-900">
                {formatCurrency(yourShare)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Unpaid from past 30 days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
