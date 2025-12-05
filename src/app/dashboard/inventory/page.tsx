import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getVehicles, deleteVehicle } from "@/lib/actions/vehicles";
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function InventoryPage() {
    const vehicles = await getVehicles();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
                <Link href="/dashboard/inventory/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.data.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell className="font-medium">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                    <div className="text-xs text-muted-foreground">
                                        {vehicle.variant} • {vehicle.mileage?.toLocaleString() ?? 0} km
                                    </div>
                                </TableCell>
                                <TableCell>${Number(vehicle.price).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={vehicle.status === "in_stock" ? "default" : "secondary"}>
                                        {vehicle.status.replace("_", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell className="capitalize">{vehicle.condition}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/dashboard/inventory/${vehicle.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server";
                                            await deleteVehicle(vehicle.id);
                                        }}>
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
