"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowRight, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    variant: string | null;
    price: string | number;
    images: unknown;
    engineSize: string | null;
    transmission: string | null;
    fuelType: string | null;
    features: unknown;
    mileage: number | null;
    status: string;
}

interface ComparisonToolProps {
    availableVehicles: Vehicle[];
}

export function ComparisonTool({ availableVehicles }: ComparisonToolProps) {
    const [slots, setSlots] = useState<(Vehicle | null)[]>([null, null]);
    const [search, setSearch] = useState("");
    const [openSlotIndex, setOpenSlotIndex] = useState<number | null>(null);

    const filteredVehicles = availableVehicles.filter(v => {
        const query = search.toLowerCase();
        return (
            v.status === "in_stock" &&
            (v.make.toLowerCase().includes(query) ||
                v.model.toLowerCase().includes(query) ||
                v.year.toString().includes(query))
        );
    });

    const handleSelectVehicle = (vehicle: Vehicle) => {
        if (openSlotIndex !== null) {
            const newSlots = [...slots];
            newSlots[openSlotIndex] = vehicle;
            setSlots(newSlots);
            setOpenSlotIndex(null);
            setSearch("");
        }
    };

    const handleRemoveVehicle = (index: number) => {
        const newSlots = [...slots];
        newSlots[index] = null;
        setSlots(newSlots);
    };

    const addSlot = () => {
        if (slots.length < 3) {
            setSlots([...slots, null]);
        }
    };

    // Helper to get image URL
    const getImg = (v: Vehicle) => {
        return Array.isArray(v.images) && v.images.length > 0 && typeof v.images[0] === 'string'
            ? v.images[0]
            : null;
    };

    return (
        <div className="space-y-12">
            {/* Vehicle Selection Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {slots.map((vehicle, index) => (
                    <div key={index} className="relative">
                        {vehicle ? (
                            <div className="bg-card border border-white/10 rounded-xl overflow-hidden group h-full flex flex-col">
                                <div className="absolute top-2 right-2 z-10">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveVehicle(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="h-48 relative bg-neutral-900">
                                    {getImg(vehicle) ? (
                                        <img src={getImg(vehicle)!} alt={vehicle.model} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                    )}
                                </div>
                                <div className="p-4 flex-1">
                                    <h3 className="text-xl font-bold text-white">{vehicle.year} {vehicle.make}</h3>
                                    <p className="text-lg text-primary">{vehicle.model} {vehicle.variant}</p>
                                    <p className="text-2xl font-bold text-white mt-2">${Number(vehicle.price).toLocaleString()}</p>
                                    <div className="mt-4">
                                        <Button asChild className="w-full bg-white/10 hover:bg-white/20">
                                            <Link href={`/inventory/${vehicle.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Dialog open={openSlotIndex === index} onOpenChange={(open) => !open && setOpenSlotIndex(null)}>
                                <DialogTrigger asChild>
                                    <button
                                        className="w-full h-full min-h-[300px] border-2 border-dashed border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-4 group"
                                        onClick={() => setOpenSlotIndex(index)}
                                    >
                                        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Plus className="h-8 w-8 text-gray-400 group-hover:text-primary" />
                                        </div>
                                        <span className="text-lg font-medium text-gray-400 group-hover:text-white">Add Vehicle</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-background/95 backdrop-blur-xl border-white/10 text-white">
                                    <DialogHeader>
                                        <DialogTitle>Select a Vehicle</DialogTitle>
                                    </DialogHeader>
                                    <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                                        <Input
                                            placeholder="Search inventory..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                            {filteredVehicles.map(v => (
                                                <div
                                                    key={v.id}
                                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/5"
                                                    onClick={() => handleSelectVehicle(v)}
                                                >
                                                    <div className="h-16 w-24 bg-neutral-900 rounded overflow-hidden shrink-0">
                                                        {getImg(v) && <img src={getImg(v)!} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white">{v.year} {v.make} {v.model}</h4>
                                                        <p className="text-sm text-gray-400">{v.variant} • ${Number(v.price).toLocaleString()}</p>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="shrink-0">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {filteredVehicles.length === 0 && (
                                                <p className="text-center text-gray-500 py-8">No vehicles found.</p>
                                            )}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                ))}

                {slots.length < 3 && (
                    <button
                        className="w-full h-full min-h-[100px] border border-dashed border-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={addSlot}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Another Comparison Slot
                    </button>
                )}
            </div>

            {/* Comparison Table */}
            {slots.some(s => s !== null) && (
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-3 md:p-6 w-1/4 font-heading text-gray-400 font-normal">Feature</th>
                                {slots.map((v, i) => (
                                    <th key={i} className="p-3 md:p-6 w-1/4">
                                        {v ? <span className="font-bold text-white">{v.make} {v.model}</span> : <span className="text-gray-600 italic">Empty</span>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { label: "Price", key: "price", format: (v: any) => `$${Number(v).toLocaleString()}` },
                                { label: "Year", key: "year" },
                                { label: "Mileage", key: "mileage", format: (v: any) => `${Number(v).toLocaleString()} km` },
                                { label: "Engine", key: "engineSize" },
                                { label: "Transmission", key: "transmission", capitalize: true },
                                { label: "Fuel Type", key: "fuelType", capitalize: true },
                                { label: "Condition", key: "condition", capitalize: true },
                            ].map((row) => (
                                <tr key={row.key} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 md:p-6 text-gray-400 font-medium">{row.label}</td>
                                    {slots.map((vehicle, i) => (
                                        <td key={i} className="p-3 md:p-6 text-white text-lg">
                                            {vehicle ? (
                                                // @ts-ignore
                                                row.format ? row.format(vehicle[row.key]) : (
                                                    <span className={row.capitalize ? "capitalize" : ""}>
                                                        {/* @ts-ignore */}
                                                        {vehicle[row.key] || "-"}
                                                    </span>
                                                )
                                            ) : "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Features Row */}
                            <tr className="border-t border-white/10 bg-white/5">
                                <td className="p-3 md:p-6 text-gray-400 font-medium align-top">Key Features</td>
                                {slots.map((vehicle, i) => (
                                    <td key={i} className="p-3 md:p-6 align-top">
                                        {vehicle && Array.isArray(vehicle.features) ? (
                                            <div className="flex flex-col gap-2">
                                                {(vehicle.features as string[]).slice(0, 5).map(f => (
                                                    <div key={f} className="flex items-center text-sm text-gray-300">
                                                        <Check className="h-3 w-3 text-primary mr-2" /> {f}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : "-"}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
