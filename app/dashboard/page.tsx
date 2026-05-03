import { db } from "@/db";
import { chores, expenseParticipation, expenses } from "@/db/schema";
import { eq, and, inArray, gte } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import ChoreList from "@/components/ChoreList";
import RoommatesCard from "@/components/RoommatesCard";
import SharedExpensesCard from "@/components/SharedExpensesCard";
import HeaderComponent from "@/components/HeaderComponent";
import AddChoreDialog from "@/components/AddChoreDialog";

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

  // Fetch only chores for THIS apartment
const apartmentChores = orgId 
    ? await db.select().from(chores).where(eq(chores.apartmentId, orgId)) 
    : [];

const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const apartmentExpenses = orgId 
    ? await db.select({
        id: expenses.id,
        description: expenses.description,
        amount: expenses.amount,
        category: expenses.category,
        paidByUserId: expenses.paidByUserId,
        date: expenses.date,
        // This is the key: get the status ONLY for the current user
        isPaid: expenseParticipation.isPaid})
        .from(expenses)
        .leftJoin(
        expenseParticipation, 
        and(
            eq(expenses.id, expenseParticipation.expenseId),
            eq(expenseParticipation.userId, userId!)
        )
    )
    .where(and(eq(expenses.apartmentId, orgId), gte(expenses.date, thirtyDaysAgo))) 
    : [];

const activeChores = apartmentChores
    .filter(chore => !chore.isCompleted)
    .sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
});

const completedChores = apartmentChores.filter(chore => chore.isCompleted).sort((a, b) => {
        // if there is no completion date move to the bottom
        if (!a.completedAt) return 1;
        if (!b.completedAt) return -1;
        // shows latest/recently completed first
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
});

const dashboardChores = [...activeChores, ...completedChores].slice(0,5)

const participations = apartmentExpenses.length > 0 
        ? await db.select()
            .from(expenseParticipation)
            .where(inArray(expenseParticipation.expenseId, apartmentExpenses.map(e => e.id)))
        : [];

return (
    <div>
        <HeaderComponent title="Dashboard" description="Welcome back! Here's your apartment overview."/>
        <main className="max-w-7xl mx-auto mt-10 p-6 ">
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-3">
                        <SharedExpensesCard expenses={apartmentExpenses} members={members} expenseParticipation={participations} currentUserId={userId}/>
                    </div>
                    <div className="md:col-span-2">
                        <RoommatesCard members={members} currentUserId={userId}/>
                    </div>
                </div>
                <ChoreList chores={dashboardChores} members={members} currentUserId={userId} buttonOn={true}/>
                
            </div>
        </main>
    </div>
    );
}