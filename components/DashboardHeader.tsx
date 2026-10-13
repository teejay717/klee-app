"use client"
import { useApartment } from "@/context/ApartmentContext"
import { formatPeso, getExpenseTotals } from "@/lib/household"
import HeaderComponent from "./HeaderComponent"
import { StatStrip } from "./HouseholdUI"
import AddChoreDialog from "./AddChoreDialog"
import AddExpenseDialog from "./AddExpenseDialog"

type DashboardHeaderProps = {
  unpaidExpenses: number
  pendingChores: number
  orgName?: string
  // last 30 days, used for "Total shared" and "Your share"
  expenses?: { id: number; amount: string | number }[]
  expenseParticipation?: { userId: string; expenseId: number; isPaid: boolean }[]
}

export default function DashboardHeader({
  unpaidExpenses,
  pendingChores,
  expenses = [],
  expenseParticipation = [],
}: DashboardHeaderProps) {
  const { members, currentUserId } = useApartment()
  const username =
    members.find((m) => m.userId === currentUserId)?.label || "User"
  const { total, yourShare } = getExpenseTotals(
    expenses,
    expenseParticipation,
    currentUserId
  )
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="flex flex-col gap-7">
      <HeaderComponent
        eyebrow={today}
        title={
          <>
            Good to see you,{" "}
            <span className="text-primary">{username.split(" ")[0]}</span>
          </>
        }
      >
        <AddChoreDialog variant="outline" triggerLabel="+ Chore" />
        <AddExpenseDialog triggerLabel="+ Expense" />
      </HeaderComponent>

      <StatStrip
        stats={[
          { label: "Pending chores", value: pendingChores },
          { label: "Unpaid expenses", value: unpaidExpenses },
          { label: "Total shared · 30d", value: formatPeso(total) },
          { label: "Your share", value: formatPeso(yourShare), accent: true },
        ]}
      />
    </div>
  )
}
