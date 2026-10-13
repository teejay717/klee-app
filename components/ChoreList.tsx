"use client";
import { deleteChore, setChoreCompleted } from "@/server/actions";
import { Checkbox } from "./ui/checkbox";
import { useApartment } from "@/context/ApartmentContext";
import { Card } from "@/components/ui/card"
import AddChoreDialog from "./AddChoreDialog";
import { toast } from "sonner";
import { action, cn } from "@/lib/utils";
import { getRelativeLabel } from "@/lib/household";
import { EmptyState, MemberAvatar, PanelHeader } from "./HouseholdUI";

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
    emptyTitle?: string,
    emptyDescription?: string,
    className?: string,
    // rendered under the rows (e.g. pagination)
    children?: React.ReactNode,
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
    toast.promise(action(setChoreCompleted(formData)), {
        loading: "Updating chore status...",
        success: "Chore status updated!",
        error: (err) => err instanceof Error ? err.message : "Failed to update chore status",
    });
}

async function handleDelete(formData: FormData) {
    toast.promise(action(deleteChore(formData)), { // or deleteExpense
        loading: "Deleting Chore...",
        success: "Chore Deleted successfully!",
        error: (err) => err instanceof Error ? err.message : "Failed to Delete Chore",
    });
}

export default function ChoreList({
    chores,
    buttonOn = true,
    title = "Chores",
    description,
    emptyTitle = "No chores yet",
    emptyDescription = "Add a chore and assign it to a roommate.",
    className,
    children,
}: ChoreListProps) {
    const { members, currentUserId } = useApartment();
    const memberLabelById = new Map(members.map((m) => [m.userId, m.label]));

    return (
        <Card className={cn("gap-3.5 p-[22px]", className)}>
            <PanelHeader title={title} meta={description} />

            {chores.length === 0 ? (
                <EmptyState title={emptyTitle} description={emptyDescription} />
            ) : (
                <div className="flex flex-col">
                    {chores.map((chore) => {
                        const assignee = memberLabelById.get(chore.userId) ?? "Unknown Member";
                        const chipText = chore.userId === currentUserId ? "You" : assignee.split(' ')[0];

                        // TODO: there is no "completed by" field yet, so this uses the assignee
                        const dateLabel = chore.isCompleted
                            ? `Done by ${chipText} · ${getRelativeLabel(chore.completedAt)}`
                            : getDeadlineLabel(chore.deadline);

                        return (
                            <div
                                key={chore.id}
                                className="flex items-center gap-2 border-t border-row-divider px-1 py-3.5"
                            >
                                <form action={handleToggleChore} className="min-w-0 flex-1">
                                    <input type="hidden" name="choreId" value={String(chore.id)} />
                                    <input type="hidden" name="nextCompleted" value={String(!chore.isCompleted)} />
                                    <label className="flex cursor-pointer items-center gap-3.5">
                                        <Checkbox
                                            type="submit"
                                            checked={chore.isCompleted}
                                            aria-label={chore.isCompleted ? `Mark ${chore.title} as open` : `Mark ${chore.title} as done`}
                                        />
                                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span
                                                className={cn(
                                                    "truncate text-[15px] font-semibold",
                                                    chore.isCompleted && "text-faint line-through"
                                                )}
                                            >
                                                {chore.title}
                                            </span>
                                            <span className="truncate text-[13px] text-muted-foreground">
                                                {dateLabel}
                                            </span>
                                        </span>
                                        <span className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-ink-secondary">
                                            <MemberAvatar userId={chore.userId} size={24} />
                                            <span className="hidden sm:inline">{chipText}</span>
                                        </span>
                                    </label>
                                </form>

                                <form action={handleDelete}>
                                    <input type="hidden" name="choreId" value={String(chore.id)} />
                                    <button
                                        type="submit"
                                        className="cursor-pointer px-2 py-1 text-xs font-medium text-placeholder transition-colors duration-[120ms] hover:text-destructive"
                                    >
                                        Delete
                                    </button>
                                </form>
                            </div>
                        );
                    })}
                </div>
            )}

            {children}

            {buttonOn ? (
                <div className="mt-auto">
                    <AddChoreDialog variant="link" triggerLabel="+ Add chore" />
                </div>
            ) : null}
        </Card>
    );
}
