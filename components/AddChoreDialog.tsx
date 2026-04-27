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

type MemberOption = {
    userId: string;
    label: string;
};

export default function AddChoreDialog({ members }: { members: MemberOption[] }) {
const defaultMember = useMemo(() => members[0]?.userId ?? "", [members]);
const [assigneeUserId, setAssigneeUserId] = useState(defaultMember);
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
        <Button size="lg" className="bg-blue-800 hover:bg-blue-600">+ Add chore</Button>
    </DialogTrigger>

    <DialogContent>
        <DialogHeader>
        <DialogTitle>Create chore</DialogTitle>
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

        <DialogFooter>
                <Button type="submit" disabled={!assigneeUserId} className="bg-blue-800 hover:bg-blue-600" size="lg">
                Add chore
                </Button>
        </DialogFooter>
        </form>

        {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
    </DialogContent>
    </Dialog>
);
}