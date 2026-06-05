"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { createExpense } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { useApartment } from "@/context/ApartmentContext";
import { useFormStatus } from "react-dom";
import { Card } from "./ui/card";
import { toast } from "sonner"
import { rateLimit } from "@/lib/ratelimiter";

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button 
        type="submit" 
        disabled={disabled || pending} 
        className="bg-blue-900 hover:bg-blue-800 flex-1" 
        size="lg"
        >
        {pending ? 'Adding...' : "Add Expense"}
        </Button>
    );
}

export default function AddExpenseDialog({ className = "bg-blue-900 hover:bg-blue-800 w-full" }) {
const { members } = useApartment()
const defaultMember = useMemo(() => members[0]?.userId ?? "", [members]);
const [paidByUserId, setPaidByUserId] = useState(defaultMember);
const [open, setOpen] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [category, setCategory] = useState("Rent");
const formRef = useRef<HTMLFormElement>(null);

const CATEGORIES = ["Rent", "Utilities", "Groceries", "Supplies", "Internet", "Furniture", "Other"];

useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => {
                setSubmitError(null);
            }, 5000); // 5000ms = 5 seconds

            return () => clearTimeout(timer); // Cleanup timer if component unmounts or error changes
        }
    }, [submitError]);

// async function handleCreateExpense(formData: FormData) {
//     setSubmitError(null);

//     try {
//         await createExpense(formData);
//         formRef.current?.reset();
//         setPaidByUserId(defaultMember);
//         setOpen(false);
//     } catch {
//         setSubmitError("Could not log expense. Please try again.");
//     }
// }

async function handleCreateExpense(formData: FormData) {
    setSubmitError(null);
    toast.promise(createExpense(formData), {
        loading: 'Adding expense...',
        success: () => {
            formRef.current?.reset();
            setPaidByUserId(defaultMember);
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
        <Button size="lg" className={className}>+ Add Expense</Button>
    </DialogTrigger>

    <DialogContent>
        <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Add Shared Expense</DialogTitle>
        <DialogDescription>
            Log a new expense for your apartment
        </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleCreateExpense} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="description">Expense description</Label>
            <Input id="description" name="description" placeholder="e.g., Weekly Groceries" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" name="amount" placeholder="0.00" type="number" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <input type="hidden" name="category" value={category} />
            <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
                <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
                {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                    {cat}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            {/* <Calendar 
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
                captionLayout="dropdown"
            />
            <input type="hidden" name="date" value={date?.toISOString() || ""}/> */}
            <Input id="date" name="date" type="date" />
        </div>

        <div className="space-y-2">
            <Label>Paid by</Label>
            <input type="hidden" name="paidByUserId" value={paidByUserId} />
            <Select value={paidByUserId} onValueChange={setPaidByUserId}>
            <SelectTrigger>
                <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
                {members.map((m) => (
                <SelectItem key={m.userId} value={m.userId}>
                    {m.label.split(' ')[0]}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <FieldSet>
                <FieldLegend variant="label">
                    Split Among
                </FieldLegend>
                <Card>
                <FieldGroup className="gap-3">
                    {members.map((m) => (
                        <Field key={m.userId} orientation="horizontal">
                            <Checkbox
                                id={`${m.userId}-checkbox`}
                                name="participants"
                                value={m.userId}
                                className=" data-[state=checked]:bg-blue-900 border-2 border-blue-900 rounded-sm"
                                defaultChecked
                            />
                            <FieldLabel
                                htmlFor={`${m.userId}-checkbox`}
                                className="font-normal"
                            >
                            {m.label.split(' ')[0]}
                            </FieldLabel>
                        </Field>                        
                    ))}
                </FieldGroup>
                </Card>
                </FieldSet>
        </div>
                {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
        <DialogFooter className="flex sm:justify-between gap-3 pt-4">
            <DialogClose asChild>
                <Button type="button" variant="outline" size="lg" className="flex-1">
                    Cancel
                </Button>
            </DialogClose>
                <SubmitButton disabled={!paidByUserId} />
        </DialogFooter>
        </form>
    </DialogContent>
    </Dialog>
);
}