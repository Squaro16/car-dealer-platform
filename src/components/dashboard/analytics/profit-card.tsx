import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface ProfitCardProps {
    revenue: number;
    expenses: number;
    cogs: number;
    netProfit: number;
}

export function ProfitCard({ revenue, expenses, cogs, netProfit }: ProfitCardProps) {
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const isPositive = netProfit >= 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    ${netProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {profitMargin.toFixed(1)}% Margin
                </p>
                <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Revenue</span>
                        <span>${revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">COGS</span>
                        <span>-${cogs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Expenses</span>
                        <span>-${expenses.toLocaleString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
