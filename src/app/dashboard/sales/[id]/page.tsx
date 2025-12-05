import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { sales } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function InvoicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const sale = await db.query.sales.findFirst({
        where: eq(sales.id, id),
        with: {
            vehicle: true,
            customer: true,
            dealer: true,
            seller: true,
        }
    });

    if (!sale) {
        notFound();
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between print:hidden">
                <h2 className="text-3xl font-bold tracking-tight">Invoice</h2>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Invoice
                </Button>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold">{sale.dealer.name}</CardTitle>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                            <div>{sale.dealer.address || "Address not available"}</div>
                            <div>{sale.dealer.contactEmail}</div>
                            <div>{sale.dealer.contactPhone}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Invoice Date</div>
                        <div className="font-medium">{new Date(sale.saleDate).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground mt-2">Invoice #</div>
                        <div className="font-medium">{sale.id.slice(0, 8).toUpperCase()}</div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Separator />

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Bill To:</div>
                            <div className="font-bold">{sale.customer.name}</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div>{sale.customer.address}</div>
                                <div>{sale.customer.email}</div>
                                <div>{sale.customer.phone}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-muted-foreground mb-2">Vehicle Details:</div>
                            <div className="font-bold">{sale.vehicle.year} {sale.vehicle.make} {sale.vehicle.model}</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div>VIN: {sale.vehicle.vin}</div>
                                <div>Stock #: {sale.vehicle.stockNumber}</div>
                                <div>Color: {sale.vehicle.color}</div>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>Vehicle Price</div>
                            <div className="text-right font-medium">${Number(sale.salePrice).toLocaleString()}</div>

                            <div className="text-muted-foreground">Payment Method</div>
                            <div className="text-right capitalize">{sale.paymentMethod.replace("_", " ")}</div>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                            <div>Total</div>
                            <div className="text-right">${Number(sale.salePrice).toLocaleString()}</div>
                        </div>
                    </div>

                    {sale.notes && (
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Notes:</div>
                            <div className="text-sm">{sale.notes}</div>
                        </div>
                    )}

                    <div className="pt-8 text-center text-sm text-muted-foreground">
                        <p>Thank you for your business!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
