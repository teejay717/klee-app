"use client"
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChoreList from "./ChoreList";
import { type chores } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Chore = InferSelectModel<typeof chores>

interface FilterableChoreListProps {
    allChores: Chore[];
}

export default function FilterableChoreList({ allChores } : FilterableChoreListProps) {
    const [activeTab, setActiveTab] = useState('week')
    
    const tabTitle = activeTab === 'all' 
        ? "All Chores" 
        : activeTab === 'month' 
            ? "This Month's Chores" 
            : "This Week's Chores";

    const now = useMemo(() => new Date(), []);
    const oneWeekAgo = useMemo(() => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), [now]);
    const oneMonthAgo = useMemo(() => new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), [now]);

    const filteredChores = allChores.filter(chore => {
        if (!chore.isCompleted || !chore.completedAt) return false;
        if (activeTab === 'all') return true; 

        const completedAt = new Date(chore.completedAt);
        if (activeTab === 'week') return completedAt >= oneWeekAgo;
        if (activeTab === 'month') return completedAt >= oneMonthAgo;

        return false;
    }).sort((a, b) => {
        const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        return timeB - timeA;
    })
    

    return (
        <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:w-auto mb-2">
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
                <ChoreList 
                    chores={filteredChores} 
                    buttonOn={false}
                    title={tabTitle}
                    description={`${filteredChores.length} Tasks completed`}
                />
            </TabsContent>
            </Tabs>
        </div>
    )
}

