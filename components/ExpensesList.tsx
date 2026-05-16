import { deleteExpense, toggleExpensePaid } from "@/server/actions";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge'
import { Trash } from "lucide-react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useApartment } from "@/context/ApartmentContext";
import Image from "next/image";

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
}

export default function ExpenseList({ expenses, expenseParticipation = [], title = "Expenses", description = "Shared expenses and their payment status" }: ExpenseListProps) {
    const { members, currentUserId } = useApartment()
    const memberLabelById = new Map(members.map((m) => [m.userId, m.label]));
    
    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <Card className="shadow-md">
            <CardHeader className="flex items-center gap-3 justify-between">
                <div className="flex flex-col">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div>
            {expenses.map((expense) => {
                const assignee = memberLabelById.get(expense.paidByUserId) ?? "Unknown Member";
                const chipText = expense.paidByUserId === currentUserId ? "You" : assignee.split(' ')[0];
                const category = expense.category

                // const dateLabel = chore.isCompleted && chore.completedAt ? 
                //     `Completed on ${new Date(chore.completedAt).toLocaleDateString('en-US', { 
                //         month: 'long', 
                //         day: 'numeric' 
                //     })}` 
                //     : getDeadlineLabel(chore.deadline);

                return (
            <div key={expense.id} className="p-3 border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-2 hover:bg-slate-100/50">
                
            <div className="flex items-center gap-3 min-w-0">


                <div className="min-w-0">
                    <div className="flex gap-2 items-center justify-start">
                        <div>
                        {(() => {
                            const member = members.find(m => m.userId === expense.paidByUserId);
                            if (!member) return null;
                            return (
                                
                                <div className="w-12 h-12 mx-2 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                    {member.imageUrl ? (
                                    <Image 
                                        src={member.imageUrl} 
                                        alt={member.label} 
                                        width={48} 
                                        height={48}
                                        className="w-full h-full object-cover rounded-full" 
                                    />
                                    ) : (
                                        member.initials || member.label[0]
                                    )}
                                </div>
                            );
                        })()} 
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <p className="truncate font-medium">
                                    {expense.description} 
                                </p>
                                <span className="inline-block rounded-md bg-slate-200/80 px-2 py-1 text-xs font-medium text-blue-900">
                                    {category}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600">
                                <span>Paid by {chipText} • </span>
                                {expense.date ? new Date(expense.date).toLocaleDateString() : "No Date"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                
                <div className="flex flex-col items-end">
                    <div className="flex gap-2 my-2">
                        {expenseParticipation
                            .filter((p) => p.expenseId === expense.id)
                            .map((p) => {
                                const name = memberLabelById.get(p.userId) ?? "Unknown";
                                const firstName = name.split(" ")[0];
                                const displayName = p.userId === currentUserId ? "You" : firstName;

                                return (
                                    <form key={p.id} action={toggleExpensePaid}>
                                        <input type="hidden" name="expenseId" value={p.expenseId}/>
                                        <input type="hidden" name="nextPaidStatus" value={String(!p.isPaid)}/>
                                        <button key={p.id}>
                                        <Badge
                                            className={`cursor-pointer p-3 ${
                                            p.isPaid
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}
                                        >
                                            {displayName}: {p.isPaid ? 'Paid' : 'Pending'}
                                        </Badge>
                                    </button>
                                    </form>
                                )                    
                            })}
                    </div>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(Number(expense.amount))}</p>
                    <p className="text-md text-muted-foreground">Your share: {members.length > 0 ? formatCurrency(Number(expense.amount) / members.length) : formatCurrency(0)}</p>
                </div>

                <form action={deleteExpense}>
                    <input type="hidden" name="expenseId" value={String(expense.id)} />
                    <Button type="submit" variant="ghost" size="icon" className="group hover:cursor-pointer text-slate-400 hover:text-red-500 transition-colors">
                        <Trash className="w-4 h-4" />
                    </Button>
                </form>
            </div>
            </div>
        );
        })}

        {expenses.length === 0 ? (
        <p className="text-muted-foreground text-sm ">No expenses yet!</p>
        ) : null}
    </div>
            </CardContent>
            </Card>
        
    );
}

