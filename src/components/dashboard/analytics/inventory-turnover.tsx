import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface InventoryTurnoverProps {
    averageDaysToSell: number;
}

export function InventoryTurnover({ averageDaysToSell }: InventoryTurnoverProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Days to Sell</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {averageDaysToSell} Days
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Inventory Turnover Speed
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                    Lower is better. Indicates how fast vehicles are moving off the lot.
                </div>
            </CardContent>
        </Card>
    );
}
