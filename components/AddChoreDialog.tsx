"use client";

import { useState, useRef } from "react";
import { createChore } from "@/server/actions";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useApartment } from "@/context/ApartmentContext";
import { useOrganization } from "@clerk/nextjs";
import { useFormStatus } from "react-dom";
import { action, cn } from "@/lib/utils";
import {
    buttonToneClassNames,
    ChoiceChip,
    MemberAvatar,
    modalInputClassName,
    modalLabelClassName,
} from "./HouseholdUI";

type DeadlineMode = "none" | "today" | "tomorrow" | "pick";

const DEADLINE_OPTIONS: [DeadlineMode, string][] = [
    ["none", "No deadline"],
    ["today", "Today"],
    ["tomorrow", "Tomorrow"],
    ["pick", "Pick a date"],
];

// yyyy-MM-dd in local time, same format the old <input type="date"> sent
function toDateInputValue(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button
        type="submit"
        disabled={disabled || pending}
        size="cta"
        className="px-[18px] disabled:opacity-45"
        >
        {pending ? 'Adding...' : "Add chore"}
        </Button>
    );
}

type AddChoreDialogProps = {
    className?: string,
    triggerLabel?: string,
    variant?: React.ComponentProps<typeof Button>["variant"],
}


export default function AddChoreDialog({ className = "", triggerLabel = "+ Add chore", variant = "default" }: AddChoreDialogProps) {
const { members, currentUserId } = useApartment()
const { organization } = useOrganization()
const [assigneeUserId, setAssigneeUserId] = useState("");
const [title, setTitle] = useState("");
const [deadlineMode, setDeadlineMode] = useState<DeadlineMode>("none");
const [pickedDate, setPickedDate] = useState("");
const [open, setOpen] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const formRef = useRef<HTMLFormElement>(null);

const deadlineValue = (() => {
    const today = new Date();
    if (deadlineMode === "today") return toDateInputValue(today);
    if (deadlineMode === "tomorrow") {
        today.setDate(today.getDate() + 1);
        return toDateInputValue(today);
    }
    if (deadlineMode === "pick") return pickedDate;
    return ""; // no deadline -> null on the server
})();

const assignee = members.find((m) => m.userId === assigneeUserId);
const isValid = title.trim().length > 0 && !!assignee;
const hint = isValid && assignee
    ? `Assigned to ${assignee.label.split(" ")[0]}`
    : title.trim()
        ? "Pick someone to assign it to"
        : "Name the task to continue";

function resetForm() {
    formRef.current?.reset();
    setTitle("");
    setDeadlineMode("none");
    setPickedDate("");
    setAssigneeUserId("");
}

async function handleCreateChore(formData: FormData) {
    setSubmitError(null);
    toast.promise(action(createChore(formData)), {
        loading: 'Adding chore...',
        success: () => {
            resetForm();
            setOpen(false);
            return 'Chore added successfully!';
        },
        error: (err) => {
            const errorMessage = err instanceof Error ? err.message : "Failed to add chore.";

            setTimeout(() => {
                setSubmitError(errorMessage);
            }, 3000);

            return errorMessage;
        },
        classNames: {
            success: 'bg-green-500 text-white border-green-600',
            error: 'bg-red-500 text-white border-red-600',
        }
    });
}

return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button
            variant={variant}
            size={variant === "link" ? "default" : "cta"}
            className={cn(buttonToneClassNames[variant ?? "default"], className)}
        >
            {triggerLabel}
        </Button>
    </DialogTrigger>

    <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-32px)] max-w-[calc(100vw-32px)] flex-col gap-0 overflow-hidden rounded-2xl p-0 text-foreground shadow-[0_20px_50px_rgba(0,0,0,.18),0_2px_6px_rgba(0,0,0,.08)] ring-0 sm:max-w-[480px]"
    >
        <div className="flex items-start justify-between gap-4 px-[26px] pt-6">
            <div>
                <DialogTitle className="text-[22px] leading-[1.2] font-bold tracking-[-0.01em]">New chore</DialogTitle>
                <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
                    Add a task and assign it to someone in {organization?.name ?? "your apartment"}.
                </DialogDescription>
            </div>
            <DialogClose className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-[8px] bg-secondary text-base font-medium text-ink-secondary transition-colors duration-[120ms] hover:bg-muted">
                ×
                <span className="sr-only">Close</span>
            </DialogClose>
        </div>

        <form ref={formRef} action={handleCreateChore} className="flex min-h-0 flex-col">
        <div className="flex flex-col gap-5 overflow-y-auto px-[26px] py-[22px]">
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className={modalLabelClassName}>Task</label>
                <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Wash dishes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={modalInputClassName}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <span className={modalLabelClassName}>Deadline</span>
                <input type="hidden" name="deadline" value={deadlineValue} />
                <div className="flex flex-wrap gap-1.5">
                    {DEADLINE_OPTIONS.map(([key, label]) => (
                        <ChoiceChip
                            key={key}
                            selected={deadlineMode === key}
                            onSelect={() => setDeadlineMode(key)}
                        >
                            {label}
                        </ChoiceChip>
                    ))}
                </div>
                {deadlineMode === "pick" ? (
                    <Input
                        type="date"
                        aria-label="Deadline date"
                        value={pickedDate}
                        onChange={(e) => setPickedDate(e.target.value)}
                        className={cn(modalInputClassName, "py-2.5 text-sm md:text-sm")}
                    />
                ) : null}
            </div>

            <div className="flex flex-col gap-2">
                <span className={modalLabelClassName}>Assign to</span>
                <input type="hidden" name="assigneeUserId" value={assigneeUserId} />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {members.map((m) => {
                        const selected = m.userId === assigneeUserId;
                        return (
                            <button
                                key={m.userId}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setAssigneeUserId(m.userId)}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2.5 rounded-[10px] border-[1.5px] px-2.5 py-[9px] text-left transition-colors duration-[120ms] outline-none focus-visible:ring-[3px] focus-visible:ring-primary/12",
                                    selected
                                        ? "border-primary bg-primary-tint"
                                        : "border-border bg-white hover:border-input"
                                )}
                            >
                                <MemberAvatar userId={m.userId} size={28} />
                                <span className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-semibold text-foreground">
                                        {m.label.split(' ')[0]}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {/* TODO: show "{n} open chores" once chore counts are available here */}
                                        {m.userId === currentUserId ? "You" : "Roommate"}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
        </div>

        <div className="flex items-center gap-2.5 border-t border-divider bg-background px-[26px] py-4">
            <span className="flex-1 text-[13px] text-muted-foreground" aria-live="polite">{hint}</span>
            <DialogClose asChild>
                <Button type="button" variant="outline" size="cta" className={buttonToneClassNames.outline}>
                    Cancel
                </Button>
            </DialogClose>
            <SubmitButton disabled={!isValid} />
        </div>
        </form>
    </DialogContent>
    </Dialog>
);
}
