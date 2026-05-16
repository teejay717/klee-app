"use client";
import { PhilippinePeso, CircleCheckBig } from "lucide-react";
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


export default function RecentActivityCard({ activities } : {activities: any[]}) {
    const { members } = useApartment();

    function getDateLabel(date: Date | string | null) {
    if (!date) return "No date";
    
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "No date"
    
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return `Yesterday`;
    if (days < 7) return `${days} days ago`;

    return d.toLocaleDateString();
}

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <Card className="max-w-2xl shadow-md">
            <CardHeader className="flex items-center gap-3 justify-between">
                <div className="flex flex-col">
                    <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                    <CardDescription>What&apos;s happening in your apartment</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
            {activities.map((a) => {
                return (
            <div key={a.id} className={`p-3 border-b rounded-t flex items-center justify-between gap-3 my-2 ${a.isCompleted ? "bg-slate-100/50" : ""} hover:bg-slate-100/50`}>
            <div className="flex items-center gap-3 min-w-0">
                {(() => {
                    const member = members.find(m => m.userId === a.userId);
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
                <div className="min-w-0">
                    <div className="flex gap-2 items-center justify-start">
                        <p className="truncate font-medium">
                            {a.type === "chore" ? `Completed: ${a.title}` : `Added Expense: ${a.title} - ${formatCurrency(a.amount)}`} 
                        </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                        {getDateLabel(a.time)}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <span className="text-slate-400">
                {a.type === "chore" ? <PhilippinePeso /> : <CircleCheckBig />}
                </span>
            </div>
            </div>
        );
        })}

        {activities.length === 0 ? (
        <p className="text-muted-foreground text-sm ">No recent activities yet!</p>
        ) : null}
            </CardContent>
        </Card>
        
    );
}

