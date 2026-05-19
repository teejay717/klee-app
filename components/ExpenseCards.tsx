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
import { useApartment } from "@/context/ApartmentContext";

type FilteredExpenseItem = {
    id: number
    amount: string | number,
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
    filteredExpenses: FilteredExpenseItem[],
    expenses: ExpenseItem[],
    expenseParticipation: ParticipationItem[],
    activeTab: string
}


export default function ExpensesCards({ filteredExpenses, expenseParticipation = [], activeTab }: ExpensesCardProps) {
    const { members, currentUserId } = useApartment()
    const tabTitle = activeTab === 'all' ?
        "All Time" : activeTab === 'week' ?
        "Last 7 Days" : "Last 30 Days";
    
    const totalPeriodAmount = filteredExpenses.reduce((acc, item) => acc + Number(item.amount), 0);

    const yourPeriodShare = filteredExpenses.reduce((acc, expense) => {

        const myParticipation = expenseParticipation.find(p => p.expenseId === expense.id && p.userId === currentUserId);
        
        const amountToAdd = (myParticipation && !myParticipation.isPaid) 
            ? (Number(expense.amount) / expenseParticipation.filter(p => p.expenseId === expense.id).length) 
            : 0;

        return acc + amountToAdd
    }, 0)

    const unpaidExpenses = filteredExpenses.reduce((acc, expense) => {
        const myParticipation = expenseParticipation.find(p => p.expenseId === expense.id && p.userId === currentUserId && !p.isPaid);
        const amountToAdd = myParticipation ? 1 : 0;

        return acc + amountToAdd;
    }, 0)
    // go through expenses -> for each expense check the participations of each member - > if they paid already, we do not add their share anymore to the total "you share" amount
    // the issue is i dont know how to go from expenses to each participations

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            maximumFractionDigits: 2,
        }).format(num);
    };
    
return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <Card className="shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Total Expenses
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                        {formatCurrency(totalPeriodAmount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {filteredExpenses.length} expenses
                    </span>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-l-blue-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Your Share
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-900">
                        {formatCurrency(yourPeriodShare)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {tabTitle}
                    </span>
                    {/* Optional: You can add the percentage indicator here if you have the trend data */}
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Total Unpaid Expenses
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-900">
                        {unpaidExpenses}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {`Unpaid Expense(s)`} 
                    </span>
                </div>
            </CardContent>
        </Card>
    </div>
);
}