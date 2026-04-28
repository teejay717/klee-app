"use client";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type RoommatesCardProps = {
    members?: { userId: string; label: string}[];
    currentUserId: string | null
}

export default function RoommatesCard({ members, currentUserId }: RoommatesCardProps) {

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Your Roommates</CardTitle>
                <CardDescription>{members?.length} members</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {members && members.length > 0 ? (
                        members.map((member) => (
                            <div key={member.userId} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {member.label[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        <span>{member.label}</span>
                                        <span className="text-muted-foreground">  {member.userId === currentUserId ? "(You)" : ''}</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (<p className="text-sm text-gray-500">No members yet</p>)}
                </div>
            </CardContent>
        </Card>
    )
}