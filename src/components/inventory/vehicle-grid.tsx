"use client";

// Renders the public inventory grid with view toggle, favorites, and lazy images.

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Determine the shape of a vehicle object based on what we see in the code
// This now includes joined make data from the database query
export interface Vehicle {
    id: string;
    makeId: string;
    make: string | { name?: string };
    makeCountry: string | null;
    model: string;
    year: number;
    price: string | number;
    mileage: number | null;
    transmission: string | null;
    fuelType: string | null;
    engineSize: string | null;
    variant: string | null;
    condition: string;
    images: unknown; // jsonb in DB
    status?: string;
    color?: string | null;
    bodyType?: string | null;
    doors?: number | null;
    seats?: number | null;
    description?: string | null;
    features?: unknown;
    createdAt?: Date;
    updatedAt?: Date;
}

interface VehicleGridProps {
    vehicles: Vehicle[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
    function getMakeName(car: Vehicle): string {
        if (typeof car.make === "string") {
            return car.make;
        }
        return car.make?.name ?? "";
    }

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("favorites");
        if (stored) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setFavorites(JSON.parse(stored));
        }
    }, []);

    const toggleFavorite = (e: React.MouseEvent, carId: string) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        const isFavorited = favorites.includes(carId);
        let newFavorites;

        if (isFavorited) {
            newFavorites = favorites.filter(id => id !== carId);
            toast.info("Removed from favorites");
        } else {
            newFavorites = [...favorites, carId];
            toast.success("Added to favorites");
        }

        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
    };

    if (vehicles.length === 0) {
        return (
            <div className="text-center py-20 bg-black/20 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">No vehicles found</h3>
                <p className="text-gray-400">Try adjusting your filters or search criteria.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end border-b border-white/10 pb-4">
                <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`h-8 w-8 p-0 rounded-md ${viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                        title="Grid View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`h-8 w-8 p-0 rounded-md ${viewMode === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                        title="List View"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className={viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col gap-4"
            }>
                {vehicles.map((car) => (
                    <Link
                        href={`/inventory/${car.id}`}
                        key={car.id}
                        className={`group block bg-card rounded-sm overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 ${viewMode === "list" ? "flex flex-col md:flex-row min-h-[220px]" : ""
                            }`}
                    >
                        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-full md:w-80 lg:w-96 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]"
                            }`}>
                            {Array.isArray(car.images) && car.images.length > 0 && typeof car.images[0] === 'string' ? (
                                <>
                                    <Image
                                        src={car.images[0]}
                                        alt={`${car.year} ${getMakeName(car)} ${car.model}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={false}
                                        loading="lazy"
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                                    />
                                    {/* Secondary Image on Hover */}
                                    {car.images.length > 1 && typeof car.images[1] === 'string' && (
                                        <Image
                                            src={car.images[1]}
                                            alt={`${car.year} ${getMakeName(car)} ${car.model} Rear`}
                                            fill
                                            className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={false}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-neutral-900">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-3 right-3 z-10">
                                <Badge variant="secondary" className="bg-black/60 backdrop-blur text-white border-none uppercase tracking-wider text-xs font-bold px-3 py-1">
                                    {car.condition}
                                </Badge>
                            </div>

                            {/* Favorite Button */}
                            <button
                                onClick={(e) => toggleFavorite(e, car.id)}
                                className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center transition-all hover:bg-black/60 hover:scale-110"
                            >
                                <Heart
                                    className={`h-4 w-4 transition-colors ${favorites.includes(car.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                                />
                            </button>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                        </div>

                        <div className={`p-4 md:p-6 flex flex-col justify-between flex-1 ${viewMode === "list" ? "py-4 md:py-6" : ""}`}>
                            <div>
                                <div className="mb-4">
                                    <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                                        <span>{getMakeName(car)}</span>
                                    </div>
                                    <h3 className="text-2xl font-heading font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                        {car.model}
                                    </h3>
                                    <p className="text-gray-300 text-sm">{car.year} • {car.variant}</p>
                                </div>

                                <div className={`grid gap-y-2 text-sm text-gray-400 mb-6 border-t border-white/10 pt-4 ${viewMode === "list" ? "grid-cols-2 md:grid-cols-4 gap-x-8" : "grid-cols-2"
                                    }`}>
                                    <div className="flex items-center">
                                        <span className="font-heading text-white mr-2">Mileage:</span> {Number(car.mileage).toLocaleString()} km
                                    </div>
                                    <div className={`flex items-center ${viewMode === "grid" ? "justify-end" : ""}`}>
                                        <span className="font-heading text-white mr-2">Trans:</span> <span className="capitalize">{car.transmission}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-heading text-white mr-2">Fuel:</span> <span className="capitalize">{car.fuelType}</span>
                                    </div>
                                    <div className={`flex items-center ${viewMode === "grid" ? "justify-end" : ""}`}>
                                        {car.engineSize && <span>{car.engineSize}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-2xl font-bold text-white">
                                    ${Number(car.price).toLocaleString()}
                                </div>
                                <span className="text-xs uppercase tracking-widest text-primary font-bold group-hover:underline decoration-2 underline-offset-4">
                                    View Details
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
