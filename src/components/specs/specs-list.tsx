"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Download, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    variant: string | null;
    images: unknown;
    engineSize: string | null;
    transmission: string | null;
    fuelType: string | null;
    bodyType: string | null;
    features: unknown;
}

interface SpecsListProps {
    models: Vehicle[];
}

export function SpecsList({ models }: SpecsListProps) {
    const [search, setSearch] = useState("");

    const filteredModels = models.filter(car => {
        const query = search.toLowerCase();
        return (
            car.make.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            (car.variant && car.variant.toLowerCase().includes(query)) ||
            car.year.toString().includes(query)
        );
    });

    const handleDownload = (e: React.MouseEvent, carName: string) => {
        e.preventDefault();
        e.stopPropagation();
        // Mock download
        alert(`Downloading brochure for ${carName}...`);
    };

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                    type="search"
                    placeholder="Search specifications by make, model..."
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-10 focus-visible:ring-primary/50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((car) => (
                    <div key={car.id} className="group relative bg-card rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                        {/* Image Header */}
                        <div className="relative h-48 overflow-hidden bg-neutral-900">
                            {Array.isArray(car.images) && car.images.length > 0 && typeof car.images[0] === 'string' ? (
                                <img
                                    src={car.images[0]}
                                    alt={`${car.year} ${car.make} ${car.model}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                    <FileText className="h-12 w-12 opacity-20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                    {car.make} {car.model}
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    {car.year} {car.variant && `• ${car.variant}`}
                                </p>
                            </div>
                        </div>

                        {/* Specs Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Engine</span>
                                    <p className="text-sm font-medium text-white">{car.engineSize || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Transmission</span>
                                    <p className="text-sm font-medium text-white capitalize">{car.transmission || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Fuel Type</span>
                                    <p className="text-sm font-medium text-white capitalize">{car.fuelType || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Body</span>
                                    <p className="text-sm font-medium text-white capitalize">{car.bodyType || "N/A"}</p>
                                </div>
                            </div>

                            {/* Features Preview */}
                            {Array.isArray(car.features) && car.features.length > 0 && (
                                <div className="mb-6">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Key Features</span>
                                    <div className="flex flex-wrap gap-2">
                                        {(car.features as string[]).slice(0, 3).map((feature, i) => (
                                            <Badge key={i} variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 border-none text-[10px]">
                                                {feature}
                                            </Badge>
                                        ))}
                                        {(car.features as string[]).length > 3 && (
                                            <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-gray-300 border-none text-[10px]">
                                                +{(car.features as string[]).length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-white/10 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white"
                                    onClick={(e) => handleDownload(e, `${car.year} ${car.make} ${car.model}`)}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Brochure
                                </Button>
                                <Button size="sm" className="flex-1 bg-white/10 hover:bg-white/20 text-white" asChild>
                                    <Link href={`/inventory/${car.id}`}>
                                        Details <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredModels.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No specifications found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
