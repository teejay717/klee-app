"use client";

import { useMemo, useState } from "react";
import { createChore } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
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

return (
    <Dialog>
    <DialogTrigger asChild>
        <Button>Add chore</Button>
    </DialogTrigger>

    <DialogContent>
        <DialogHeader>
        <DialogTitle>Create chore</DialogTitle>
        <DialogDescription>
            Add the task and assign it to an apartment member.
        </DialogDescription>
        </DialogHeader>

        <form action={createChore} className="space-y-4">
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
                    {m.label}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <DialogFooter>
            <Button type="submit" disabled={!assigneeUserId}>
            Add chore
            </Button>
        </DialogFooter>
        </form>
    </DialogContent>
    </Dialog>
);
}