"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles";
import { useState } from "react";
import { ImageUpload } from "@/components/inventory/image-upload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VehicleFormProps {
    initialData?: {
        id: string;
        make: string;
        model: string;
        year: number;
        price: string;
        mileage: number;
        status: string;
        condition: string;
        images: string[];
        vin?: string | null;
        stockNumber?: string | null;
        costPrice?: string | null;
        color?: string | null;
        engineSize?: string | null;
        transmission?: string | null;
        fuelType?: string | null;
        doors?: number | null;
        seats?: number | null;
        bodyType?: string | null;
        variant?: string | null;
        description?: string | null;
        features?: string[] | null;
    };
}

export default function VehicleForm({ initialData }: VehicleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            // Append images to formData
            formData.set("images", JSON.stringify(images));

            // Convert features from comma-separated string to array if needed
            const featuresString = formData.get("features_input") as string;
            if (featuresString) {
                const featuresArray = featuresString.split(",").map(f => f.trim()).filter(f => f !== "");
                formData.set("features", JSON.stringify(featuresArray));
            } else {
                formData.set("features", JSON.stringify([]));
            }

            if (initialData) {
                await updateVehicle(initialData.id, formData);
                toast.success("Vehicle updated successfully");
            } else {
                await createVehicle(formData);
                toast.success("Vehicle created successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={onSubmit} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Identity & Financials */}
                <div className="space-y-2">
                    <Label htmlFor="vin">VIN (Required)</Label>
                    <Input id="vin" name="vin" defaultValue={initialData?.vin || ""} required placeholder="Vehicle Identification Number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stockNumber">Stock Number</Label>
                    <Input id="stockNumber" name="stockNumber" defaultValue={initialData?.stockNumber || ""} placeholder="e.g. STK-001" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input id="costPrice" name="costPrice" type="number" step="0.01" defaultValue={initialData?.costPrice || ""} placeholder="0.00" />
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" name="make" defaultValue={initialData?.make} required placeholder="e.g. Toyota" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" name="model" defaultValue={initialData?.model} required placeholder="e.g. Camry" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="variant">Variant</Label>
                    <Input id="variant" name="variant" defaultValue={initialData?.variant || ""} placeholder="e.g. 2.5 Hybrid" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" type="number" defaultValue={initialData?.year} required placeholder="2024" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Selling Price</Label>
                    <Input id="price" name="price" type="number" step="0.01" defaultValue={initialData?.price} required placeholder="0.00" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km)</Label>
                    <Input id="mileage" name="mileage" type="number" defaultValue={initialData?.mileage} required placeholder="0" />
                </div>

                {/* Specs */}
                <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" name="color" defaultValue={initialData?.color || ""} placeholder="e.g. Pearl White" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Input id="bodyType" name="bodyType" defaultValue={initialData?.bodyType || ""} placeholder="e.g. Sedan, SUV" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="engineSize">Engine Size</Label>
                    <Input id="engineSize" name="engineSize" defaultValue={initialData?.engineSize || ""} placeholder="e.g. 2.5L" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select name="transmission" defaultValue={initialData?.transmission || "automatic"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="cvt">CVT</SelectItem>
                            <SelectItem value="dct">DCT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select name="fuelType" defaultValue={initialData?.fuelType || "petrol"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="plug_in_hybrid">Plug-in Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="doors">Doors</Label>
                    <Input id="doors" name="doors" type="number" defaultValue={initialData?.doors || ""} placeholder="4" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seats">Seats</Label>
                    <Input id="seats" name="seats" type="number" defaultValue={initialData?.seats || ""} placeholder="5" />
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={initialData?.status || "in_stock"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="in_stock">In Stock</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select name="condition" defaultValue={initialData?.condition || "used"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                            <SelectItem value="reconditioned">Reconditioned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={initialData?.description || ""} placeholder="Detailed vehicle description..." className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="features_input">Features (Comma separated)</Label>
                <Textarea id="features_input" name="features_input" defaultValue={initialData?.features?.join(", ") || ""} placeholder="Bluetooth, Sunroof, Leather Seats..." />
            </div>

            {/* Images */}
            <div className="space-y-2">
                <Label>Images</Label>
                <ImageUpload
                    defaultImages={images}
                    onUploadComplete={(urls) => setImages(urls)}
                />
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update Vehicle" : "Create Vehicle"}
            </Button>
        </form>
    );
}
