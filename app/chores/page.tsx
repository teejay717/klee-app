import { db } from "@/db";
import { chores } from "@/db/schema";
import HeaderComponent from "@/components/HeaderComponent"
import ChoreList from "@/components/ChoreList"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm";
import AddChoreDialog from "@/components/AddChoreDialog";
import FilterableChoreList from "@/components/FilterableChoreList";

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

    return {
        userId: user.userId,
        label: fullName || user.identifier || "Unknown Member",
    }
}).filter((m): m is { userId: string; label: string } => m !== null);

    const apartmentChores = orgId 
        ? await db.select().from(chores).where(eq(chores.apartmentId, orgId)) 
        : [];
    
    const activeChores = apartmentChores.filter(c => !c.isCompleted);

    return (
        <div>
            <HeaderComponent title="Chore History" description="Track completed tasks and assignments" children={<AddChoreDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}/>
            <main className="max-w-7xl mx-auto mt-10 p-6 space-y-10">
            <FilterableChoreList allChores={apartmentChores} members={members} currentUserId={userId}/>
            <section>
                <ChoreList chores={activeChores} members={members} currentUserId={userId} buttonOn={false} title="Incomplete Chores"/>
            </section>
        </main>
        </div>
    )
}
















// children={<AddChoreDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}