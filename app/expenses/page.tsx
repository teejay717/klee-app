import { db } from "@/db";
import { expenses, expenseParticipation } from "@/db/schema";
import HeaderComponent from "@/components/HeaderComponent"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { eq, inArray } from "drizzle-orm";
import FilterableChoreList from "@/components/FilterableChoreList";
import ExpenseList from "@/components/ExpensesList";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import ExpensesCards from "@/components/ExpenseCards";


export default async function Page() {
    const { userId, orgId } = await auth();

    const client = await clerkClient();
  // fetch members
    const memberships = orgId ? await client.organizations.getOrganizationMembershipList({ 
    organizationId: orgId,
    limit: 100,}) : { data: [], totalCount: 0 };

    const members = memberships.data.map((membership) => {
    const user = membership.publicUserData;

    if (!user?.userId) return null;

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    const initials = [user.firstName?.charAt(0), user.lastName?.charAt(0)].filter(Boolean).join("").toUpperCase();

    return {
        userId: user.userId,
        label: fullName || user.identifier || "Unknown Member",
        initials: initials
    }
}).filter((m): m is { userId: string; label: string; initials: string } => m !== null);

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
            <HeaderComponent title="Expenses" description="Track and split shared costs" children={<AddExpenseDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}/>
            <main className="max-w-7xl mx-auto mt-10 p-6 space-y-10">
                <ExpensesCards expenses={apartmentExpenses} members={members} expenseParticipation={participations} currentUserId={userId}/>
                <FilterableChoreList allChores={apartmentExpenses} members={members}  currentUserId={userId} />
            <section>
                <ExpenseList expenses={apartmentExpenses} expenseParticipation={participations} members={members} currentUserId={userId}/>
            </section>
        </main>
        </div>
    )
}
















// children={<AddChoreDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}