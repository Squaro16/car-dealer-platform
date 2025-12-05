import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car } from "lucide-react";
import { db } from "@/lib/db";
import { vehicles, leads } from "@/lib/db/schema";
import { count, ne, and } from "drizzle-orm";
import { getFinancialMetrics, getRevenueOverTime, getInventoryTurnover } from "@/lib/actions/analytics";
import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart";
import { ProfitCard } from "@/components/dashboard/analytics/profit-card";
import { InventoryTurnover } from "@/components/dashboard/analytics/inventory-turnover";

export default async function DashboardPage() {
    // 1. Total Inventory (All vehicles not sold)
    const [inventoryCount] = await db
        .select({ value: count() })
        .from(vehicles)
        .where(ne(vehicles.status, "sold"));

    // 2. Active Leads (Not won or lost)
    const [leadsCount] = await db
        .select({ value: count() })
        .from(leads)
        .where(and(ne(leads.status, "won"), ne(leads.status, "lost")));

    // 3. Financial Metrics
    const financialMetrics = await getFinancialMetrics();
    const revenueData = await getRevenueOverTime();
    const turnoverDays = await getInventoryTurnover();

    const totalInventory = inventoryCount?.value ?? 0;
    const activeLeads = leadsCount?.value ?? 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInventory}</div>
                        <p className="text-xs text-muted-foreground">Vehicles in stock</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeLeads}</div>
                        <p className="text-xs text-muted-foreground">Open inquiries</p>
                    </CardContent>
                </Card>

                <ProfitCard
                    revenue={financialMetrics.totalRevenue}
                    expenses={financialMetrics.totalExpenses}
                    cogs={financialMetrics.totalCOGS}
                    netProfit={financialMetrics.netProfit}
                />

                <InventoryTurnover averageDaysToSell={turnoverDays} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart data={revenueData} />

                {/* Placeholder for Recent Sales or Top Selling Models */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Recent sales and leads will appear here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
