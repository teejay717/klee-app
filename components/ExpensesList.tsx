"use client";
import { deleteExpense, toggleExpensePaid } from "@/server/actions";
import { Card } from "@/components/ui/card"
import { useApartment } from "@/context/ApartmentContext";
import { toast } from "sonner"
import { action, cn } from "@/lib/utils";
import { formatPeso, toDate } from "@/lib/household";
import { EmptyState, MemberAvatar, PanelHeader } from "./HouseholdUI";

type ExpenseItem = {
    id: number,
    description: string,
    amount: string | number
    apartmentId: string,
    category: string,
    paidByUserId: string,
    date: Date | string | null,
    createdAt: Date | string | null
}

type ExpenseParticipation = {
    id: number,
    expenseId: number,
    userId: string,
    isPaid?: boolean
}

type ExpenseListProps = {
    expenses: ExpenseItem[],
    expenseParticipation: ExpenseParticipation[],
    buttonOn?: boolean,
    title?: string,
    description?: string,
    emptyTitle?: string,
    emptyDescription?: string,
    // e.g. an "+ Add expense" button inside the empty state
    emptyAction?: React.ReactNode,
    // rendered under the rows (e.g. pagination)
    children?: React.ReactNode,
}

async function handleTogglePaid(formData: FormData) {
    toast.promise(action(toggleExpensePaid(formData)), {
        loading: "Updating status...",
        success: "Status updated!",
        error: (err) => err instanceof Error ? err.message : "Failed to update status",
    });
}

async function handleDelete(formData: FormData) {
    toast.promise(action(deleteExpense(formData)), { // or deleteExpense
        loading: "Deleting Expense...",
        success: "Expense Deleted successfully!",
        error: (err) => err instanceof Error ? err.message : "Failed to Delete Expense",
    });
}

export default function ExpenseList({
    expenses,
    expenseParticipation = [],
    title = "Expenses",
    description = "Shared expenses and their payment status",
    emptyTitle = "No expenses yet",
    emptyDescription = "Log rent, groceries or supplies to split them.",
    emptyAction,
    children,
}: ExpenseListProps) {
    const { members, currentUserId } = useApartment()
    const memberLabelById = new Map(members.map((m) => [m.userId, m.label]));

    return (
        <Card className="gap-3.5 p-[22px]">
            <PanelHeader title={title} meta={description} />

            {expenses.length === 0 ? (
                <EmptyState title={emptyTitle} description={emptyDescription}>
                    {emptyAction}
                </EmptyState>
            ) : (
                <div className="flex flex-col">
            {expenses.map((expense) => {
                const assignee = memberLabelById.get(expense.paidByUserId) ?? "Unknown Member";
                const chipText = expense.paidByUserId === currentUserId ? "You" : assignee.split(' ')[0];

                const participants = expenseParticipation.filter(p => p.expenseId === expense.id);
                const isUserParticipating = participants.some(p => p.userId === currentUserId);
                const shareAmount = isUserParticipating ? Number(expense.amount) / Number(participants.length) : 0;
                const dateLabel = toDate(expense.date)?.toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? "No date";

                return (
            <div key={expense.id} className="flex items-start gap-3 border-t border-row-divider px-1 py-3.5">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[15px] font-semibold">{expense.description}</span>
                    <span className="truncate text-[13px] text-muted-foreground">
                        {chipText} · {dateLabel} · {expense.category}
                    </span>

                    {participants.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {participants.map((p) => {
                                const name = memberLabelById.get(p.userId) ?? "Unknown";
                                const isMe = p.userId === currentUserId;
                                const displayName = isMe ? "You" : name.split(" ")[0];

                                return (
                                    <form key={p.id} action={handleTogglePaid}>
                                        <input type="hidden" name="expenseId" value={p.expenseId}/>
                                        <input type="hidden" name="nextPaidStatus" value={String(!p.isPaid)}/>
                                        <button
                                            disabled={!isMe}
                                            title={isMe ? (p.isPaid ? "Mark your share as unpaid" : "Mark your share as paid") : undefined}
                                            className={cn(
                                                "rounded-full px-2.5 py-1 text-xs font-semibold transition-opacity duration-[120ms]",
                                                p.isPaid
                                                    ? "bg-[oklch(0.95_0.04_150)] text-[oklch(0.42_0.11_150)]"
                                                    : "bg-secondary text-ink-secondary",
                                                isMe
                                                    ? "cursor-pointer ring-1 ring-primary/30 hover:opacity-80"
                                                    : "cursor-default"
                                            )}
                                        >
                                            {displayName} · {p.isPaid ? "Paid" : "Pending"}
                                        </button>
                                    </form>
                                )
                            })}
                        </div>
                    ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold tabular-nums">
                            {formatPeso(Number(expense.amount))}
                        </span>
                        <MemberAvatar userId={expense.paidByUserId} size={24} />
                    </div>
                    {isUserParticipating ? (
                        <span className="text-xs text-muted-foreground tabular-nums">
                            Your share {formatPeso(shareAmount)}
                        </span>
                    ) : null}
                    <form action={handleDelete}>
                        <input type="hidden" name="expenseId" value={String(expense.id)} />
                        <button
                            type="submit"
                            className="cursor-pointer py-1 text-xs font-medium text-placeholder transition-colors duration-[120ms] hover:text-destructive"
                        >
                            Delete
                        </button>
                    </form>
                </div>
            </div>
        );
        })}
                </div>
            )}

            {children}
        </Card>
    );
}
