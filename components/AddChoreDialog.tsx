"use client";

import { useMemo, useState, useRef } from "react";
import { createChore } from "@/server/actions";
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
import { Calendar } from "@/components/ui/calendar"

type MemberOption = {
    userId: string;
    label: string;
};

export default function AddChoreDialog({ members, className = "bg-blue-900 hover:bg-blue-800 w-full" }: { members: MemberOption[], className?: string }) {
const defaultMember = useMemo(() => members[0]?.userId ?? "", [members]);
const [assigneeUserId, setAssigneeUserId] = useState(defaultMember);
const [deadline, setDeadline] = useState<Date | undefined>(undefined)
const [open, setOpen] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const formRef = useRef<HTMLFormElement>(null);

async function handleCreateChore(formData: FormData) {
    setSubmitError(null);
    try {
        await createChore(formData);
        formRef.current?.reset();
        setAssigneeUserId(defaultMember);
        setOpen(false);
    } catch {
        setSubmitError("Could not create chore. Please try again.");
    }
}

return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button size="lg" className={className}>+ Add chore</Button>
    </DialogTrigger>

    <DialogContent>
        <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Create chore</DialogTitle>
        <DialogDescription>
            Add the task and assign it to an apartment member.
        </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={handleCreateChore} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="title">Task title</Label>
            <Input id="title" name="title" placeholder="Wash dishes" required />
        </div>

        <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            {/* <Calendar 
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                className="rounded-lg border"
                captionLayout="dropdown"
            />
            <input type="hidden" name="deadline" value={deadline?.toISOString() || ""}/> */}
            <Input id="deadline" name="deadline" type="date" />
        </div>

        <div className="space-y-2">
            <Label>Assign to</Label>
            <input type="hidden" name="assigneeUserId" value={assigneeUserId} />
            <Select value={assigneeUserId} onValueChange={setAssigneeUserId}>
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

        <DialogFooter className="flex sm:justify-between gap-3 pt-4">
            <DialogClose asChild>
                <Button type="button" variant="outline" size="lg" className="flex-1">
                    Cancel
                </Button>
            </DialogClose>
                <Button 
                    type="submit" 
                    disabled={!assigneeUserId} 
                    className="bg-blue-900 hover:bg-blue-800 flex-1" 
                    size="lg"
                >
                    Add Chore
                </Button>
        </DialogFooter>
        </form>

        {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
    </DialogContent>
    </Dialog>
);
}