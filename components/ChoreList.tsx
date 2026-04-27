import { deleteChore, setChoreCompleted } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Check, Trash } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { diff } from "node:util";

type MemberOption = {
    userId: string,
    label: string
}

type ChoreItem = {
    id: number,
    title: string,
    userId: string,
    deadline: Date | null,
    isCompleted: boolean
}

type ChoreListProps = {
    chores: ChoreItem[],
    members: MemberOption[],
    currentUserId: string | null
}

function getDeadlineLabel(deadline: Date | string | null) {
    if (!deadline) return "No deadline";
    
    const d = deadline instanceof Date ? deadline : new Date(deadline);
    if (Number.isNaN(d.getTime())) return "No deadline"

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 1) return "In " + diffDays + " days";
    return Math.abs(diffDays) + " days ago";
}

export default function ChoreList({ chores, members, currentUserId }: ChoreListProps) {
    const memberLabelById = new Map(members.map((m) => [m.userId, m.label]));

    return (
        <div>
            {chores.map((chore) => {
                const assignee = memberLabelById.get(chore.userId) ?? "Unknown Member";
                const chipText = chore.userId === currentUserId ? "You" : assignee.split(' ')[0];

                return (
            <div key={chore.id} className={`p-3 border rounded-md flex items-center justify-between gap-3 my-2 ${chore.isCompleted ? "bg-slate-100" : ""}`}>
            <div className="flex items-center gap-3 min-w-0">
                <form action={setChoreCompleted}>
                <input type="hidden" name="choreId" value={String(chore.id)} />
                <input type="hidden" name="nextCompleted" value={String(!chore.isCompleted)} />
                    <Checkbox type="submit" checked={chore.isCompleted}/>
                </form>

                <div className="min-w-0">
                    <div className="flex gap-2">
                        <p className={chore.isCompleted ? "truncate line-through text-muted-foreground" : "truncate"}>
                            {chore.title} 
                        </p>
                        <span className="inline-block mt-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                            {chipText}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                        {getDeadlineLabel(chore.deadline)}
                    </p>
                </div>
            </div>

            <form action={deleteChore}>
                <input type="hidden" name="choreId" value={String(chore.id)} />
                <Button type="submit" variant="destructive">
                    <Trash />
                </Button>
            </form>
            </div>
        );
        })}

        {chores.length === 0 ? (
        <p className="text-muted-foreground text-sm">No chores yet!</p>
        ) : null}
    </div>
    );
}

