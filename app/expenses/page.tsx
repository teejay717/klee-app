import { db } from "@/db"
import { expenses, expenseParticipation } from "@/db/schema"
import HeaderComponent from "@/components/HeaderComponent"
import { auth } from "@clerk/nextjs/server"
import { eq, inArray, and, isNull } from "drizzle-orm"
import FilterableExpenseList from "@/components/FilterableExpenseList"
import AddExpenseDialog from "@/components/AddExpenseDialog"

export default async function Page() {
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
    <div>
      <HeaderComponent
        title="Expenses"
        description="Track and split shared costs"
      >
        <AddExpenseDialog className="min-w-[200px] bg-blue-900 px-8 py-6 text-lg font-semibold hover:bg-blue-800" />
      </HeaderComponent>
      <main className="mx-auto mt-10 max-w-7xl space-y-10 p-6">
        <FilterableExpenseList
          allExpenses={apartmentExpenses}
          expenseParticipation={participations}
        />
      </main>
    </div>
  )
}

// children={<AddChoreDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}
