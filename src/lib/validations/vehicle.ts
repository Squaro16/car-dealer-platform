import { z } from "zod";

export const vehicleSchema = z.object({
    makeId: z.string().uuid("Please select a valid manufacturer"),
    model: z.string().min(1, "Model is required"),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    price: z.coerce.number().min(0, "Price must be positive"),
    mileage: z.coerce.number().min(0),
    status: z.enum(["in_stock", "reserved", "sold", "hidden"]),
    condition: z.enum(["new", "used", "reconditioned"]),

    // New fields
    vin: z.string().min(1, "VIN is required"), // Critical
    stockNumber: z.string().optional(),
    costPrice: z.coerce.number().min(0, "Cost price must be positive").optional(), // Critical for profit

    // Specs
    color: z.string().optional(),
    engineSize: z.string().optional(),
    transmission: z.enum(["automatic", "manual", "cvt", "dct"]).optional(),
    fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "plug_in_hybrid"]).optional(),
    doors: z.coerce.number().optional(),
    seats: z.coerce.number().optional(),
    bodyType: z.string().optional(),
    variant: z.string().optional(),

    // Metadata
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
