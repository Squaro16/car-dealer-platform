
import { ExpensesList } from "@/components/expenses/expenses-list";

export default function ExpensesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
            </div>
            <ExpensesList />
        </div>
    );
}
