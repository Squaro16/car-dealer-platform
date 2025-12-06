import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVehicle } from "@/lib/actions/vehicles";
import { notFound } from "next/navigation";
import { Calendar, Gauge, Fuel, Zap, CheckCircle2 } from "lucide-react";
import { LeadForm } from "@/components/inventory/lead-form";
import { ImageGallery } from "@/components/inventory/image-gallery";

import { vehicles } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Vehicle = InferSelectModel<typeof vehicles>;

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const vehicle = (await getVehicle(id)) as Vehicle | undefined;

    if (!vehicle) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            <Navbar />

            {/* Immersive Audio/Visual Hero */}
            <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
                {vehicle.images && Array.isArray(vehicle.images) && (vehicle.images as string[]).length > 0 ? (
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                        <div className="absolute inset-0 bg-black/20 z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={(vehicle.images as string[])[0]}
                            alt="Hero"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-gray-400">No Image Available</div>
                )}

                <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-32 bg-gradient-to-t from-background to-transparent">
                    <div className="container px-4 md:px-6">
                        <Badge variant="secondary" className="mb-4 bg-primary text-white border-none uppercase tracking-widest text-xs font-bold px-3 py-1 rounded-sm">
                            {String(vehicle.condition)}
                        </Badge>
                        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight mb-2">
                            {String(vehicle.year)} {String(vehicle.make)} <span className="text-primary">{String(vehicle.model)}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide">{String(vehicle.variant || '')}</p>
                    </div>
                </div>
            </div>

            <div className="container py-12 px-4 md:px-6 -mt-8 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Key Specs - Minimalist Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-card/50 backdrop-blur border border-white/5 rounded-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Mileage</span>
                                <span className="text-xl font-heading text-white">{Number(vehicle.mileage).toLocaleString()} km</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Transmission</span>
                                <span className="text-xl font-heading text-white capitalize">{String(vehicle.transmission)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Engine</span>
                                <span className="text-xl font-heading text-white">{String(vehicle.engineSize || 'N/A')}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Fuel</span>
                                <span className="text-xl font-heading text-white capitalize">{String(vehicle.fuelType)}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wide border-l-4 border-primary pl-4">Vehicle Overview</h2>
                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
                                <p>
                                    Experience the epitome of automotive engineering with this {String(vehicle.year)} {String(vehicle.make)} {String(vehicle.model)}.
                                    Finished in a stunning {String(vehicle.color || 'custom finish')}, this vehicle represents the perfect blend of performance and luxury.
                                </p>
                                <p className="mt-4">
                                    Every detail has been meticulously inspected to ensure it meets our exacting standards.
                                    From the {String(vehicle.engineSize || 'high-performance')} powertrain to the refined interior, this {String(vehicle.make)} delivers an unforgettable driving experience.
                                </p>
                            </div>
                        </div>

                        {/* Features Grid */}
                        {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wide border-l-4 border-primary pl-4">Specifications & Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(vehicle.features as string[]).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5 hover:border-primary/30 transition-colors">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span className="text-gray-200">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mosaic Gallery */}
                        <ImageGallery
                            images={(vehicle.images as string[])?.slice(1) || []}
                            title={`${String(vehicle.year)} ${String(vehicle.make)} ${String(vehicle.model)}`}
                        />
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="space-y-8">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-none bg-card/80 backdrop-blur-md overflow-hidden">
                                <div className="h-2 w-full bg-primary" />
                                <CardContent className="p-8">
                                    <div className="text-3xl font-heading font-bold text-white mb-2">
                                        ${Number(vehicle.price).toLocaleString()}
                                    </div>
                                    <p className="text-gray-300 text-sm mb-8">Includes all taxes & duties</p>

                                    <div className="space-y-4">
                                        <LeadForm
                                            vehicleId={vehicle.id}
                                            vehicleTitle={`${String(vehicle.year)} ${String(vehicle.make)} ${String(vehicle.model)}`}
                                        />
                                        <div className="text-center">
                                            <span className="text-xs text-gray-400 uppercase tracking-widest">Global Shipping Available</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-6 border border-white/10 rounded-sm bg-black/20 text-center">
                                <p className="text-gray-300 text-sm mb-2">Need help?</p>
                                <p className="text-white text-lg font-bold">Call words +1 (555) 000-0000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
