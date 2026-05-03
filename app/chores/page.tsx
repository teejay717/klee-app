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

    const apartmentChores = orgId 
        ? await db.select().from(chores).where(eq(chores.apartmentId, orgId)) 
        : [];
    
    const activeChores = apartmentChores.filter(c => !c.isCompleted);

    return (
        <div>
            <HeaderComponent title="Chore History" description="Track completed tasks and assignments" children={<AddChoreDialog className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}/>
            <main className="max-w-7xl mx-auto mt-10 p-6 space-y-10">
                <FilterableChoreList allChores={apartmentChores}/>
            <section>
                <ChoreList chores={activeChores} buttonOn={false} title="Incomplete Chores" description="Incomplete tasks assigned to roommates"/>
            </section>
        </main>
        </div>
    )
}
















// children={<AddChoreDialog members={members} className="bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg font-semibold min-w-[200px]"/>}