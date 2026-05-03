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
import AddExpenseDialog from "./AddExpenseDialog";

type MemberOption = {
    userId: string,
    label: string
}

type ExpenseItem = {
    id: number
    amount: string | number,
}

type ParticipationItem = {
    userId: string,
    expenseId: number,
    isPaid: boolean
}

type ExpensesCardProps = {
    members: MemberOption[],
    expenses: ExpenseItem[],
    expenseParticipation: ParticipationItem[],
    currentUserId: string | null
}


export default function SharedExpensesCard({ members, expenses, expenseParticipation = [], currentUserId }: ExpensesCardProps) {
    const totalAmount = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

    const yourShare = expenses.reduce((acc, expense) => {

        const myParticipation = expenseParticipation.find(p => p.expenseId === expense.id && p.userId === currentUserId);
        
        const amountToAdd = (myParticipation && !myParticipation.isPaid) 
            ? (Number(expense.amount) / members.length) 
            : 0;

        return acc + amountToAdd
    }, 0);

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 0,
        }).format(num);
    };
    
    return (
        <Card className="shadow-md w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                <CardTitle className="text-xl font-bold">Shared Expenses</CardTitle>
                <CardDescription>Past 30 days overview</CardDescription>
            </div>
                <CardAction className="self-auto">
                    <AddExpenseDialog members={members} />
                </CardAction>
            </CardHeader>
            
            <CardContent>
                <div className="grid grid-cols-2 gap-6">

                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Shared</p>
                    <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{formatCurrency(totalAmount)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rent, groceries, supplies</p>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Your Share</p>
                    <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-900">{formatCurrency(yourShare)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Unpaid from past 30 days</p>
                </div>
                </div>
            </CardContent>
        </Card>
    )
}