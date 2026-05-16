import { db } from "@/db";
import { expenses, expenseParticipation } from "@/db/schema";
import HeaderComponent from "@/components/HeaderComponent"
import { auth } from "@clerk/nextjs/server"
import { eq, inArray } from "drizzle-orm";
import FilterableExpenseList from "@/components/FilterableExpenseList";
import AddExpenseDialog from "@/components/AddExpenseDialog";


export default async function Page() {
    const { orgId } = await auth();

    const apartmentExpenses = orgId 
        ? await db.select().from(expenses).where(eq(expenses.apartmentId, orgId)) 
        : [];

    const participations = apartmentExpenses.length > 0 
        ? await db.select()
            .from(expenseParticipation)
            .where(inArray(expenseParticipation.expenseId, apartmentExpenses.map(e => e.id)))
        : [];

    return (
        <div>
            <HeaderComponent title="Expenses" description="Track and split shared costs">
                <AddExpenseDialog className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>
            </HeaderComponent>
            <main className="max-w-7xl mx-auto mt-10 p-6 space-y-10">
                <FilterableExpenseList allExpenses={apartmentExpenses} expenseParticipation={participations} />
        </main>
        </div>
    )
}
















// children={<AddChoreDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}