import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/reports/date-range-filter";
import { ExportButton } from "@/components/reports/export-button";
import { getSalesReport, getExpenseReport, getInventoryReport } from "@/lib/actions/reports";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
    const params = await searchParams;
    const startDate = params.startDate ? new Date(params.startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = params.endDate ? new Date(params.endDate) : new Date();

    // Fetch data
    const salesData = await getSalesReport(startDate, endDate);
    const expensesData = await getExpenseReport(startDate, endDate);
    const inventoryData = await getInventoryReport();

    // Format data for export (flatten objects)
    const salesExport = salesData.map(s => ({
        Date: new Date(s.saleDate).toLocaleDateString(),
        Customer: s.customer.name,
        Vehicle: `${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model}`,
        VIN: s.vehicle.vin,
        Price: s.salePrice,
        PaymentMethod: s.paymentMethod,
        Seller: s.seller.name,
    }));

    const expensesExport = expensesData.map(e => ({
        Date: new Date(e.date).toLocaleDateString(),
        Category: e.category,
        Amount: e.amount,
        Description: e.description,
        Vehicle: e.vehicle ? `${e.vehicle.year} ${e.vehicle.make} ${e.vehicle.model}` : "General",
    }));

    const inventoryExport = inventoryData.map(v => ({
        StockNo: v.stockNumber,
        VIN: v.vin,
        Vehicle: `${v.year} ${v.make} ${v.model}`,
        Price: v.price,
        Cost: v.costPrice,
        Mileage: v.mileage,
        Status: v.status,
        DaysInStock: Math.floor((new Date().getTime() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    }));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            </div>

            <DateRangeFilter />

            <Tabs defaultValue="sales" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>

                <TabsContent value="sales">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Sales Report</CardTitle>
                            <ExportButton data={salesExport} filename={`sales_report_${startDate.toISOString().split('T')[0]}`} />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesData.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{sale.customer.name}</TableCell>
                                            <TableCell>{sale.vehicle.year} {sale.vehicle.make} {sale.vehicle.model}</TableCell>
                                            <TableCell className="text-right">${Number(sale.salePrice).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {salesData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">No sales found for this period.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expenses">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Expenses Report</CardTitle>
                            <ExportButton data={expensesExport} filename={`expenses_report_${startDate.toISOString().split('T')[0]}`} />
                        </CardHeader>
                        <CardContent>
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
                                    {expensesData.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="capitalize">{expense.category}</TableCell>
                                            <TableCell>{expense.description}</TableCell>
                                            <TableCell className="text-right">${Number(expense.amount).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {expensesData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">No expenses found for this period.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="inventory">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Inventory Valuation</CardTitle>
                            <ExportButton data={inventoryExport} filename="inventory_report" />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Stock #</TableHead>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Days in Stock</TableHead>
                                        <TableHead className="text-right">Cost</TableHead>
                                        <TableHead className="text-right">List Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventoryData.map((vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>{vehicle.stockNumber || "-"}</TableCell>
                                            <TableCell>{vehicle.year} {vehicle.make} {vehicle.model}</TableCell>
                                            <TableCell>{Math.floor((new Date().getTime() - new Date(vehicle.createdAt).getTime()) / (1000 * 60 * 60 * 24))}</TableCell>
                                            <TableCell className="text-right">${Number(vehicle.costPrice || 0).toLocaleString()}</TableCell>
                                            <TableCell className="text-right">${Number(vehicle.price).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {inventoryData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">No inventory found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
