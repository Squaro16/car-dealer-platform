import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVehicle } from "@/lib/actions/vehicles";
import { notFound } from "next/navigation";
import { Calendar, Gauge, Fuel, Zap, CheckCircle2 } from "lucide-react";
import { LeadForm } from "@/components/inventory/lead-form";
import { ImageGallery } from "@/components/inventory/image-gallery";

export default async function VehicleDetailPage({
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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="container py-12 px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery */}
                        <ImageGallery
                            images={vehicle.images as string[] || []}
                            title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        />

                        {/* Title & Price */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </h1>
                                <p className="text-xl text-muted-foreground">{vehicle.variant}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-primary">
                                    ${Number(vehicle.price).toLocaleString()}
                                </div>
                                <Badge variant="outline" className="mt-1">
                                    {vehicle.condition}
                                </Badge>
                            </div>
                        </div>

                        {/* Key Specs */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">Year</span>
                                    <span className="text-sm text-muted-foreground">{vehicle.year}</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                    <Gauge className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">Mileage</span>
                                    <span className="text-sm text-muted-foreground">
                                        {Number(vehicle.mileage).toLocaleString()} km
                                    </span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">Transmission</span>
                                    <span className="text-sm text-muted-foreground capitalize">
                                        {vehicle.transmission}
                                    </span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                    <Fuel className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">Fuel Type</span>
                                    <span className="text-sm text-muted-foreground capitalize">
                                        {vehicle.fuelType}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Vehicle Description</h2>
                            <div className="prose max-w-none text-muted-foreground">
                                <p>
                                    This {vehicle.year} {vehicle.make} {vehicle.model} is in excellent condition.
                                    Finished in {vehicle.color}, it features a {vehicle.engineSize} engine
                                    paired with a smooth {vehicle.transmission} transmission.
                                </p>
                                {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.length > 0 ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                        {(vehicle.features as string[]).map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-primary" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-4 italic">No specific features listed.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Lead Form */}
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Interested?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LeadForm
                                    vehicleId={vehicle.id}
                                    vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
