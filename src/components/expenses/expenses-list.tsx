import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getExpenses } from "@/lib/actions/expenses";
import { AddExpenseModal } from "./add-expense-modal";
import { Badge } from "@/components/ui/badge";

interface ExpensesListProps {
    vehicleId?: string;
}

export async function ExpensesList({ vehicleId }: ExpensesListProps) {
    const expenses = await getExpenses(vehicleId);
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expenses</CardTitle>
                <AddExpenseModal vehicleId={vehicleId} />
            </CardHeader>
            <CardContent>
                <div className="mb-4 font-medium">
                    Total: ${totalExpenses.toLocaleString()}
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                    No expenses recorded.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {expense.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell className="text-right">
                                        ${Number(expense.amount).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
