import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getCustomers } from "@/lib/actions/customers";
import { Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = params.search || "";

    const { data: customers, metadata } = await getCustomers({ page, search });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                <Link href="/dashboard/customers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Customer
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer List</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <form>
                                <Input
                                    name="search"
                                    type="search"
                                    placeholder="Search customers..."
                                    className="pl-8"
                                    defaultValue={search}
                                />
                            </form>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>ID Number</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                </div>
                                                {customer.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{customer.email}</span>
                                                <span className="text-muted-foreground">{customer.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{customer.idNumber || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/customers/${customer.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    Edit
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
