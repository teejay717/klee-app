import { db } from "@/db";
import { chores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createChore, deleteChore, setChoreCompleted } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

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
            <form action={setChoreCompleted}>
              <input type="hidden" name="choreId" value={String(chore.id)} />
              <input type="hidden" name="nextCompleted" value={String(!chore.isCompleted)} />
              <Button
                type="submit"
                size="icon-sm"
                variant={chore.isCompleted ? "default" : "outline"}
                className={chore.isCompleted ? "bg-green-600 text-white hover:bg-green-700" : ""}
                aria-label={chore.isCompleted ? "Mark incomplete" : "Mark complete"}
                title={chore.isCompleted ? "Mark incomplete" : "Mark complete"}
              >
                <Check />
              </Button>
            </form>
            <span>{chore.title}</span>
            {/* <span>{username}</span> */}
            <form action={deleteChore}>
              <input type="hidden" name="choreId" value={chore.id} />
              <Button type="submit" variant="destructive">Delete</Button>
            </form>
          </div>
        ))}
        {apartmentChores.length === 0 && (
          <p className="text-muted-foreground text-sm">No chores yet!</p>
        )}
      </div>
    </main>
  );
}