import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getSales } from "@/lib/actions/sales";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

// Sales history listing with pagination and links to invoices.

export default async function SalesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;

    const { data: sales, metadata } = await getSales(page);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Sales History</h2>
                <Link href="/dashboard/sales/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Record Sale
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No sales recorded yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>
                                            {new Date(sale.saleDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {sale.vehicle.year} {sale.vehicle.make?.name ?? ""} {sale.vehicle.model}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {sale.vehicle.vin}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{sale.customer.name}</div>
                                            <div className="text-xs text-muted-foreground">{sale.customer.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            ${Number(sale.salePrice).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {sale.paymentMethod.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/sales/${sale.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Invoice
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="mt-4">
                        <PaginationControls
                            currentPage={metadata.currentPage}
                            totalPages={metadata.totalPages}
                            hasNextPage={metadata.currentPage < metadata.totalPages}
                            hasPrevPage={metadata.currentPage > 1}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
