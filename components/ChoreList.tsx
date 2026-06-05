"use client";
import { deleteChore, setChoreCompleted } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useApartment } from "@/context/ApartmentContext";
import Image from "next/image";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import AddChoreDialog from "./AddChoreDialog";
import { toast } from "sonner";

type ChoreItem = {
    id: number,
    title: string,
    userId: string,
    deadline: Date | null,
    isCompleted: boolean,
    completedAt?: Date | string | null
}

type ChoreListProps = {
    chores: ChoreItem[],
    buttonOn?: boolean,
    title?: string,
    description?: string,
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
    return Math.abs(diffDays) + " day(s) ago";
}

async function handleToggleChore(formData: FormData) {
    toast.promise(setChoreCompleted(formData), {
        loading: "Updating chore status...",
        success: "Chore status updated!",
        error: (err) => err instanceof Error ? err.message : "Failed to update chore status",
    });
}

async function handleDelete(formData: FormData) {
    toast.promise(deleteChore(formData), { // or deleteExpense
        loading: "Deleting Chore...",
        success: "Chore Deleted successfully!",
        error: (err) => err instanceof Error ? err.message : "Failed to Delete Chore",
    });
}

export default function ChoreList({ chores, buttonOn = true, title = "Apartment Chores", description = "Recent tasks assigned across roommates" }: ChoreListProps) {
    const { members, currentUserId } = useApartment();
    const memberLabelById = new Map(members.map((m) => [m.userId, m.label]));

    return (
        <Card className="shadow-md">
            <CardHeader className="flex items-center gap-3 justify-between">
                <div className="flex flex-col">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {buttonOn ? (
                    <div className="mb-6 w-full">
                        <AddChoreDialog />
                    </div>) : null}
                <div>
            {chores.map((chore) => {
                const assignee = memberLabelById.get(chore.userId) ?? "Unknown Member";
                const chipText = chore.userId === currentUserId ? "You" : assignee.split(' ')[0];

                const dateLabel = chore.isCompleted && chore.completedAt ? 
                    `Completed on ${new Date(chore.completedAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric' 
                    })}` 
                    : getDeadlineLabel(chore.deadline);

                return (
            <div key={chore.id} className={`p-3 border rounded-md flex items-center justify-between gap-3 my-2 ${chore.isCompleted ? "bg-slate-100/50" : ""} hover:bg-slate-100/50`}>
            <div className="flex items-center gap-3 min-w-0">
                <form action={handleToggleChore}>
                <input type="hidden" name="choreId" value={String(chore.id)} />
                <input type="hidden" name="nextCompleted" value={String(!chore.isCompleted)} />
                    <Checkbox type="submit" className="hover:cursor-pointer" checked={chore.isCompleted}/>
                </form>

                <div className="min-w-0">
                    <div className="flex gap-2 items-center justify-start">
                        <p className={chore.isCompleted ? "truncate line-through text-muted-foreground font-medium" : "truncate font-medium"}>
                            {chore.title} 
                        </p>
                        <span className="inline-block rounded-md bg-slate-200/80 px-2 py-1 text-xs font-medium text-blue-900">
                            {chipText}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                        {dateLabel}
                        
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {(() => {
                    const member = members.find(m => m.userId === chore.userId);
                    if (!member) return null;
                    return (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                            {member.imageUrl ? (
                            <Image 
                                src={member.imageUrl} 
                                alt={member.label} 
                                width={32}
                                height={32}
                                className="w-full h-full object-cover rounded-full" 
                            />
                            ) : (
                                member.initials || member.label[0]
                            )}
                        </div>
                    );
                })()}

                <form action={handleDelete}>
                    <input type="hidden" name="choreId" value={String(chore.id)} />
                    <Button type="submit" variant="ghost" size="icon" className="group hover:cursor-pointer text-slate-400 hover:text-red-500 transition-colors">
                        <Trash className="w-4 h-4" />
                    </Button>
                </form>
            </div>
            </div>
        );
        })}

        {chores.length === 0 ? (
        <p className="text-muted-foreground text-sm ">No chores yet!</p>
        ) : null}
    </div>
            </CardContent>
            </Card>
        
    );
}

