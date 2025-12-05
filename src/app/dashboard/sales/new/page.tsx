
import { getVehicles } from "@/lib/actions/vehicles";
import { getCustomers } from "@/lib/actions/customers";
import { createSale } from "@/lib/actions/sales";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default async function NewSalePage() {
    const vehiclesData = await getVehicles(); // We need to filter for in_stock ideally, but action might return all. 
    // The getVehicles action in this codebase might support filters or we do client side/server side filter. 
    // Let's assume we filter here for now if the action doesn't support it, or check the action.
    // Based on previous file reads, getVehicles seems to return all. 

    // Filter in_stock vehicles
    const inStockVehicles = vehiclesData.data.filter(v => v.status === 'in_stock');

    const customersData = await getCustomers({ limit: 100 }); // Get first 100 customers for dropdown

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Record New Sale</h2>
                <p className="text-muted-foreground">Log a vehicle sale and update inventory status.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sale Details</CardTitle>
                    <CardDescription>Select customer and vehicle to record the transaction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createSale} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="customerId">Customer</Label>
                            <Select name="customerId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customersData.data.map(c => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name} ({c.email || c.phone})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vehicleId">Vehicle</Label>
                            <Select name="vehicleId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vehicle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {inStockVehicles.map(v => (
                                        <SelectItem key={v.id} value={v.id}>
                                            {v.year} {v.make} {v.model} - ${Number(v.price).toLocaleString()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salePrice">Sale Price</Label>
                                <Input id="salePrice" name="salePrice" type="number" step="0.01" required placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="saleDate">Sale Date</Label>
                                <Input id="saleDate" name="saleDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Select name="paymentMethod" required defaultValue="bank_transfer">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="loan">Loan</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="cheque">Cheque</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" name="notes" placeholder="Additional notes about the sale..." />
                        </div>

                        <Button type="submit" className="w-full">Complete Sale</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
