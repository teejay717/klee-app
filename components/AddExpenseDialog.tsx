"use client";

import { useState, useRef, useEffect } from "react";
import { createExpense } from "@/server/actions";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"
import { useApartment } from "@/context/ApartmentContext";
import { useFormStatus } from "react-dom";
import { toast } from "sonner"
import { action, cn } from "@/lib/utils";
import { formatPeso } from "@/lib/household";
import {
    buttonToneClassNames,
    ChoiceChip,
    MemberAvatar,
    modalInputClassName,
    modalLabelClassName,
} from "./HouseholdUI";

const CATEGORIES = ["Rent", "Utilities", "Groceries", "Supplies", "Internet", "Furniture", "Other"];

// yyyy-MM-dd in local time, same format the old <input type="date"> sent
function todayInputValue() {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// digits and a single dot only
function sanitizeAmount(value: string) {
    const [whole, ...rest] = value.replace(/[^0-9.]/g, "").split(".");
    return rest.length > 0 ? `${whole}.${rest.join("")}` : whole;
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
        {pending ? 'Adding...' : "Add expense"}
        </Button>
    );
}

type AddExpenseDialogProps = {
    className?: string,
    triggerLabel?: string,
    variant?: React.ComponentProps<typeof Button>["variant"],
}

export default function AddExpenseDialog({ className = "", triggerLabel = "+ Add expense", variant = "default" }: AddExpenseDialogProps) {
const { members, currentUserId } = useApartment()
// empty = default to the current user
const [paidByUserId, setPaidByUserId] = useState("");
const [open, setOpen] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [category, setCategory] = useState("Rent");
const [amount, setAmount] = useState("");
const [description, setDescription] = useState("");
const [date, setDate] = useState(todayInputValue);
// everyone is in the split by default, so track who was removed
const [excluded, setExcluded] = useState<Set<string>>(() => new Set());
const formRef = useRef<HTMLFormElement>(null);

useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => {
                setSubmitError(null);
            }, 5000); // 5000ms = 5 seconds

            return () => clearTimeout(timer); // Cleanup timer if component unmounts or error changes
        }
    }, [submitError]);

const effectivePaidBy = paidByUserId || currentUserId || members[0]?.userId || "";
const participants = members.filter((m) => !excluded.has(m.userId));
const amountValue = parseFloat(amount) || 0;
const each = participants.length > 0 ? amountValue / participants.length : 0;
const allSelected = excluded.size === 0;
const isValid = amountValue > 0 && description.trim().length > 0 && participants.length > 0;
const hint = participants.length > 0
    ? `${participants.length} ${participants.length === 1 ? "person" : "people"} · ${formatPeso(each)} each`
    : "Select at least one person";

function toggleParticipant(userId: string) {
    setExcluded((prev) => {
        const next = new Set(prev);
        if (next.has(userId)) next.delete(userId);
        else next.add(userId);
        return next;
    });
}

function toggleAll() {
    setExcluded(allSelected ? new Set(members.map((m) => m.userId)) : new Set());
}

function resetForm() {
    formRef.current?.reset();
    setPaidByUserId("");
    setCategory("Rent");
    setAmount("");
    setDescription("");
    setDate(todayInputValue());
    setExcluded(new Set());
}

async function handleCreateExpense(formData: FormData) {
    setSubmitError(null);
    toast.promise(action(createExpense(formData)), {
        loading: 'Adding expense...',
        success: () => {
            resetForm();
            setOpen(false);
            return 'Expense added successfully!';
        },
        error: (err) => {
            const errorMessage = err instanceof Error ? err.message : "Failed to add expense.";

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
        className="flex max-h-[calc(100dvh-32px)] max-w-[calc(100vw-32px)] flex-col gap-0 overflow-hidden rounded-2xl p-0 text-foreground shadow-[0_20px_50px_rgba(0,0,0,.18),0_2px_6px_rgba(0,0,0,.08)] ring-0 sm:max-w-[500px]"
    >
        <div className="flex items-start justify-between gap-4 px-[26px] pt-6">
            <div>
                <DialogTitle className="text-[22px] leading-[1.2] font-bold tracking-[-0.01em]">New shared expense</DialogTitle>
                <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
                    Log something you paid for and split it.
                </DialogDescription>
            </div>
            <DialogClose className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-[8px] bg-secondary text-base font-medium text-ink-secondary transition-colors duration-[120ms] hover:bg-muted">
                ×
                <span className="sr-only">Close</span>
            </DialogClose>
        </div>

        <form ref={formRef} action={handleCreateExpense} className="flex min-h-0 flex-col">
        <div className="flex flex-col gap-[18px] overflow-y-auto px-[26px] py-[22px]">
            <label className="flex items-center gap-1.5 rounded-[12px] border-[1.5px] border-input px-4 py-3.5 transition-colors duration-[120ms] focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/12">
                <span className="text-[32px] font-semibold text-muted-foreground" aria-hidden>₱</span>
                <span className="sr-only">Amount</span>
                <input
                    id="amount"
                    name="amount"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(sanitizeAmount(e.target.value))}
                    className="min-w-0 flex-1 border-none bg-transparent text-[32px] font-bold text-foreground tabular-nums outline-none placeholder:text-checkbox-border"
                    required
                />
            </label>

            <div className="flex flex-col gap-2">
                <label htmlFor="description" className={modalLabelClassName}>Description</label>
                <Input
                    id="description"
                    name="description"
                    placeholder="e.g. Weekly groceries"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={modalInputClassName}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <span className={modalLabelClassName}>Category</span>
                <input type="hidden" name="category" value={category} />
                <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                        <ChoiceChip
                            key={cat}
                            selected={category === cat}
                            onSelect={() => setCategory(cat)}
                        >
                            {cat}
                        </ChoiceChip>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="date" className={modalLabelClassName}>Date</label>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={cn(modalInputClassName, "px-3 py-2.5 text-sm md:text-sm")}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className={modalLabelClassName}>Paid by</span>
                    <input type="hidden" name="paidByUserId" value={effectivePaidBy} />
                    <Select value={effectivePaidBy} onValueChange={setPaidByUserId}>
                    <SelectTrigger
                        aria-label="Paid by"
                        className="h-auto w-full rounded-[10px] border-[1.5px] border-input bg-white px-3 py-2.5 text-sm font-medium shadow-none data-[size=default]:h-auto"
                    >
                        <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                        {members.map((m) => (
                        <SelectItem key={m.userId} value={m.userId}>
                            {m.label.split(' ')[0]}{m.userId === currentUserId ? " (you)" : ""}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span className={modalLabelClassName}>Split equally between</span>
                    <button
                        type="button"
                        onClick={toggleAll}
                        className="cursor-pointer text-[13px] font-semibold text-primary hover:text-primary-hover"
                    >
                        {allSelected ? "Clear" : "Select all"}
                    </button>
                </div>
                {participants.map((m) => (
                    <input key={m.userId} type="hidden" name="participants" value={m.userId} />
                ))}
                <div className="overflow-hidden rounded-[12px] border border-border">
                    {members.map((m) => {
                        const included = !excluded.has(m.userId);
                        return (
                            <label
                                key={m.userId}
                                className={cn(
                                    "flex cursor-pointer items-center gap-3 border-t border-row-divider px-3.5 py-[11px] first:border-t-0",
                                    included ? "bg-white text-foreground" : "bg-background text-placeholder"
                                )}
                            >
                                <Checkbox
                                    checked={included}
                                    onCheckedChange={() => toggleParticipant(m.userId)}
                                />
                                <MemberAvatar userId={m.userId} size={26} />
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {m.label.split(' ')[0]}{m.userId === currentUserId ? " (you)" : ""}
                                </span>
                                <span className="text-sm font-semibold tabular-nums">
                                    {included ? formatPeso(each) : "—"}
                                </span>
                            </label>
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
