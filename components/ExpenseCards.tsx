"use client";

import { useApartment } from "@/context/ApartmentContext";
import { formatPeso, getExpenseTotals, PERIOD_LABELS, type Period } from "@/lib/household";
import { StatStrip } from "./HouseholdUI";

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
    const { currentUserId } = useApartment()
    const periodLabel = PERIOD_LABELS[activeTab as Period] ?? PERIOD_LABELS.week;

    // your unpaid share of the expenses in this period
    const { total: totalPeriodAmount, yourShare: yourPeriodShare } = getExpenseTotals(
        filteredExpenses,
        expenseParticipation,
        currentUserId
    );

    const unpaidExpenses = filteredExpenses.reduce((acc, expense) => {
        const myParticipation = expenseParticipation.find(p => p.expenseId === expense.id && p.userId === currentUserId && !p.isPaid);
        const amountToAdd = myParticipation ? 1 : 0;

        return acc + amountToAdd;
    }, 0)

return (
    <StatStrip
        stats={[
            { label: `Total shared · ${periodLabel}`, value: formatPeso(totalPeriodAmount) },
            { label: "Your share", value: formatPeso(yourPeriodShare), accent: true },
            { label: "Unpaid", value: unpaidExpenses },
        ]}
    />
);
}
