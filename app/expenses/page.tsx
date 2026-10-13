import { db } from "@/db"
import { expenses, expenseParticipation } from "@/db/schema"
import HeaderComponent from "@/components/HeaderComponent"
import { auth } from "@clerk/nextjs/server"
import { eq, inArray, and, isNull } from "drizzle-orm"
import FilterableExpenseList from "@/components/FilterableExpenseList"
import AddExpenseDialog from "@/components/AddExpenseDialog"

export default async function Page({
  searchParams,
}: {
  searchParams: { tab?: string; page?: string }
}) {
  const params = await searchParams
  const tab = (await params.tab) || "week"
  const page = params.page ? parseInt(params.page) : 1

  const { orgId } = await auth()

  const apartmentExpenses = orgId
    ? await db
        .select()
        .from(expenses)
        .where(and(eq(expenses.apartmentId, orgId), isNull(expenses.deletedAt)))
    : []

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
    <div className="flex flex-col gap-6">
      <HeaderComponent eyebrow="Expenses" title="Expense history">
        <AddExpenseDialog triggerLabel="+ Expense" />
      </HeaderComponent>
      <FilterableExpenseList
        allExpenses={apartmentExpenses}
        expenseParticipation={participations}
        activeTab={tab.toString() as "week" | "month" | "all"}
        currentPage={page}
      />
    </div>
  )
}
