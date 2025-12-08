// import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getVehicle } from "@/lib/actions/vehicles";
import { notFound } from "next/navigation";
import { Calendar, Gauge, Fuel, Zap, CheckCircle2 } from "lucide-react";
import { LeadForm } from "@/components/inventory/lead-form";
import { ImageGallery } from "@/components/inventory/image-gallery";
import { GallerySlider } from "@/components/inventory/gallery-slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            {/* Navbar handled in global layout */}

            {/* Immersive Audio/Visual Hero replaced by Gallery */}
            <div className="container py-8 px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery */}
                        <GallerySlider
                            images={vehicle.images as string[] || []}
                            title={`${String(vehicle.year)} ${String(vehicle.make)} ${String(vehicle.model)}`}
                        />

                        {/* Title Section (Moved from Hero) */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="secondary" className="bg-primary text-white border-none uppercase tracking-widest text-xs font-bold px-3 py-1 rounded-sm">
                                    {String(vehicle.condition)}
                                </Badge>
                                {Boolean(vehicle.isFeatured) && (
                                    <Badge variant="outline" className="text-yellow-500 border-yellow-500 uppercase tracking-widest text-xs font-bold px-3 py-1 rounded-sm">
                                        Featured
                                    </Badge>
                                )}
                            </div>
                            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-2">
                                {String(vehicle.year)} {String(vehicle.make)} <span className="text-primary">{String(vehicle.model)}</span>
                            </h1>
                            <p className="text-xl text-gray-400 font-light tracking-wide">{String(vehicle.variant || '')}</p>
                        </div>

                        {/* Tabs for Details */}
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="bg-white/5 border-b border-white/10 w-full justify-start h-auto p-0 rounded-none">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white rounded-none py-4 px-6 text-gray-400 uppercase tracking-wider font-medium hover:text-white transition-colors"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="specs"
                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white rounded-none py-4 px-6 text-gray-400 uppercase tracking-wider font-medium hover:text-white transition-colors"
                                >
                                    Specifications
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="pt-8 space-y-8">
                                {/* Key Specs Grid */}
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
                                    <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wide border-l-4 border-primary pl-4">Vehicle Description</h2>
                                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                                        {vehicle.description ? (
                                            <p className="whitespace-pre-line">{vehicle.description}</p>
                                        ) : (
                                            <>
                                                <p>
                                                    Experience the epitome of automotive engineering with this {String(vehicle.year)} {String(vehicle.make)} {String(vehicle.model)}.
                                                    Finished in a stunning {String(vehicle.color || 'custom finish')}, this vehicle represents the perfect blend of performance and luxury.
                                                </p>
                                                <p className="mt-4">
                                                    Every detail has been meticulously inspected to ensure it meets our exacting standards.
                                                    From the {String(vehicle.engineSize || 'high-performance')} powertrain to the refined interior, this {String(vehicle.make)} delivers an unforgettable driving experience.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="specs" className="pt-8 space-y-8">
                                {/* Features Grid */}
                                {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.length > 0 ? (
                                    <div className="space-y-6">
                                        <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wide border-l-4 border-primary pl-4">Features & Options</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(vehicle.features as string[]).map((feature, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5 hover:border-primary/30 transition-colors">
                                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                                    <span className="text-gray-200">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No specific features listed for this vehicle.</p>
                                )}

                                {/* Technical Specs Table */}
                                <div className="space-y-6">
                                    <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wide border-l-4 border-primary pl-4">Technical Data</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                                        <div className="flex justify-between py-2 border-b border-white/5">
                                            <span className="text-gray-400">Box</span>
                                            <span className="text-white capitalize">{String(vehicle.transmission)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/5">
                                            <span className="text-gray-400">Exterior Color</span>
                                            <span className="text-white">{String(vehicle.color)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/5">
                                            <span className="text-gray-400">Doors</span>
                                            <span className="text-white">{String(vehicle.doors || 'N/A')}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/5">
                                            <span className="text-gray-400">Seats</span>
                                            <span className="text-white">{String(vehicle.seats || 'N/A')}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/5">
                                            <span className="text-gray-400">VIN / Chassis</span>
                                            <span className="text-white font-mono">{String(vehicle.vin || 'N/A')}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-white/5">
                                            <span className="text-gray-400">Stock ID</span>
                                            <span className="text-white font-mono">{String(vehicle.stockNumber || 'N/A')}</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
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
                                        <div id="lead-form" className="scroll-mt-24">
                                            <LeadForm
                                                vehicleId={vehicle.id}
                                                vehicleTitle={`${String(vehicle.year)} ${String(vehicle.make)} ${String(vehicle.model)}`}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-xs text-gray-400 uppercase tracking-widest">Global Shipping Available</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-6 border border-white/10 rounded-sm bg-black/20 text-center">
                                <p className="text-gray-300 text-sm mb-2">Need help?</p>
                                <p className="text-white text-lg font-bold">+6017 266 4314 (Eugene)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-white/10 md:hidden z-50 safe-area-bottom">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Price</p>
                        <p className="text-xl font-bold text-white">${Number(vehicle.price).toLocaleString()}</p>
                    </div>
                    <Link href="#lead-form" className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
                            Inquire Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
