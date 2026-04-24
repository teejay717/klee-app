import { db } from "@/db";
import { chores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createChore } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Page() {
  const { userId, orgId } = await auth();

  const client = await clerkClient();
  const user = userId ? await client.users.getUser(userId) : null;
  const username = user ? user.username : "Unknown User";

  // Fetch only chores for THIS apartment
  const apartmentChores = orgId 
    ? await db.select().from(chores).where(eq(chores.apartmentId, orgId)) 
    : [];

  return (
    <main className="max-w-md mx-auto mt-10 p-6">
      <h2 className="text-xl font-bold mb-4">Apartment Chores</h2>
      
      {/* Simple Form to add a chore */}
      <form action={createChore} className="flex gap-2 mb-6">
        <Input name="title" placeholder="New chore..." required />
        <Button type="submit">Add</Button>
      </form>

      {/* The List */}
      <div className="space-y-2">
        {apartmentChores.map((chore: any) => (
          <div key={chore.id} className="p-3 border rounded-md flex justify-between">
            <span>{chore.title}</span>
            <span>{username}</span>
            {chore.isCompleted && <span className="text-green-500">✓</span>}
          </div>
        ))}
        {apartmentChores.length === 0 && (
          <p className="text-muted-foreground text-sm">No chores yet!</p>
        )}
      </div>
    </main>
  );
}