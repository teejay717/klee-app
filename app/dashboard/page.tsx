import { db } from "@/db";
import { chores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import AddChoreDialog from "@/components/AddChoreDialog";
import ChoreList from "@/components/ChoreList";

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


  // Fetch only chores for THIS apartment
const apartmentChores = orgId 
    ? await db.select().from(chores).where(eq(chores.apartmentId, orgId)) 
    : [];

return (
    <main className="max-w-7xl mx-auto mt-10 p-6">
        <ChoreList chores={apartmentChores} members={members} currentUserId={userId} />
    </main>
    );
}