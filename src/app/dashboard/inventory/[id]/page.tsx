import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVehicle } from "@/lib/actions/vehicles";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Gauge, Fuel, Settings, Tag } from "lucide-react";
import { SellVehicleModal } from "@/components/sales/sell-vehicle-modal";
import { ImageGallery } from "@/components/inventory/image-gallery";
import { ExpensesList } from "@/components/expenses/expenses-list";

export default async function VehicleDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const vehicle = await getVehicle(id);

    if (!vehicle) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/inventory">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <Badge variant={vehicle.status === "sold" ? "secondary" : "default"}>
                        {vehicle.status.replace("_", " ")}
                    </Badge>
                </div>
                <div className="flex gap-2">
                    {vehicle.status !== "sold" && (
                        <SellVehicleModal
                            vehicleId={vehicle.id}
                            vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            price={vehicle.price}
                        />
                    )}
                    <Link href={`/dashboard/inventory/${vehicle.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <ImageGallery images={vehicle.images as string[]} title={`${vehicle.make} ${vehicle.model}`} />
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Price</span>
                                    <div className="font-medium text-xl">${Number(vehicle.price).toLocaleString()}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Cost Price</span>
                                    <div className="font-medium text-xl text-muted-foreground">
                                        ${vehicle.costPrice ? Number(vehicle.costPrice).toLocaleString() : "-"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Mileage</span>
                                    <div className="font-medium flex items-center gap-2">
                                        <Gauge className="h-4 w-4 text-muted-foreground" />
                                        {vehicle.mileage ? vehicle.mileage.toLocaleString() : "0"} km
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Transmission</span>
                                    <div className="font-medium flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        {vehicle.transmission || "-"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Fuel Type</span>
                                    <div className="font-medium flex items-center gap-2">
                                        <Fuel className="h-4 w-4 text-muted-foreground" />
                                        {vehicle.fuelType || "-"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Stock No.</span>
                                    <div className="font-medium flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        {vehicle.stockNumber || "-"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">VIN</span>
                                    <div className="font-medium">{vehicle.vin || "-"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {vehicle.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid gap-6">
                <ExpensesList vehicleId={vehicle.id} />
            </div>
        </div>
    );
}
