"use server";

import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteImages } from "@/lib/storage";
import { getUserProfile, checkRole } from "@/lib/auth/utils";

export type GetVehiclesOptions = {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    make?: string;
    status?: string;
    page?: number;
    limit?: number;
};

export async function getVehicles(options: GetVehiclesOptions = {}) {
    const user = await getUserProfile();

    const page = options.page || 1;
    const limit = options.limit || 12;
    const offset = (page - 1) * limit;

    const conditions = [
        eq(vehicles.dealerId, user.dealerId) // Enforce multi-tenancy
    ];

    if (options.make && options.make !== "all") {
        conditions.push(eq(vehicles.make, options.make));
    }

    if (options.status && options.status !== "all") {
        conditions.push(eq(vehicles.status, options.status as "in_stock" | "reserved" | "sold" | "hidden"));
    }

    // Build where clause
    const whereClause = and(...conditions);

    // Get total count
    const [countResult] = await db
        .select({ count: count() })
        .from(vehicles)
        .where(whereClause);

    const totalCount = countResult?.count ?? 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Get data
    const data = await db
        .select()
        .from(vehicles)
        .where(whereClause)
        .orderBy(desc(vehicles.createdAt))
        .limit(limit)
        .offset(offset);

    return {
        data,
        metadata: {
            totalCount,
            totalPages,
            currentPage: page,
            limit
        }
    };
}

export async function getFeaturedCars() {
    // Public function, no auth needed for now, but should probably filter by dealer if we had a public site context
    // For now, return latest 4 from ALL dealers (or maybe just one featured dealer?)
    // Let's assume public site shows all for now, or we need a way to know which dealer site we are on.
    // Given the schema has 'slug' on dealers, we should probably filter by that in a real app.
    // For this MVP template, we'll just return latest 4 global.
    const data = await db.select().from(vehicles).orderBy(desc(vehicles.createdAt)).limit(4);
    return data;
}

export async function getVehicle(id: string) {
    // Public function
    const data = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return data[0];
}

import { vehicleSchema } from "@/lib/validations/vehicle";

export async function createVehicle(formData: FormData) {
    const user = await checkRole(["admin", "sales"]);

    const rawData = {
        make: formData.get("make"),
        model: formData.get("model"),
        year: formData.get("year"),
        price: formData.get("price"),
        mileage: formData.get("mileage"),
        status: formData.get("status"),
        condition: formData.get("condition"),
        vin: formData.get("vin"),
        stockNumber: formData.get("stockNumber") || undefined,
        costPrice: formData.get("costPrice") || undefined,
        color: formData.get("color") || undefined,
        engineSize: formData.get("engineSize") || undefined,
        transmission: formData.get("transmission") || undefined,
        fuelType: formData.get("fuelType") || undefined,
        doors: formData.get("doors") || undefined,
        seats: formData.get("seats") || undefined,
        bodyType: formData.get("bodyType") || undefined,
        variant: formData.get("variant") || undefined,
        description: formData.get("description") || undefined,
        features: JSON.parse(formData.get("features") as string || "[]"),
        images: JSON.parse(formData.get("images") as string || "[]"),
    };

    const validatedData = vehicleSchema.parse(rawData);

    await db.insert(vehicles).values({
        ...validatedData,
        price: validatedData.price.toString(),
        costPrice: validatedData.costPrice?.toString() ?? undefined,
        dealerId: user.dealerId,
        createdById: user.id,
    });

    revalidatePath("/dashboard/inventory");
    redirect("/dashboard/inventory");
}

export async function deleteVehicle(id: string) {
    const user = await checkRole(["admin"]);

    // Fetch vehicle to ensure it belongs to the user's dealer
    const vehicleData = await db.select()
        .from(vehicles)
        .where(and(
            eq(vehicles.id, id),
            eq(vehicles.dealerId, user.dealerId)
        ));
    const vehicle = vehicleData[0];

    if (!vehicle) {
        throw new Error("Vehicle not found or unauthorized");
    }

    if (vehicle.images && Array.isArray(vehicle.images)) {
        await deleteImages(vehicle.images as string[]);
    }

    await db.delete(vehicles).where(eq(vehicles.id, id));
    revalidatePath("/dashboard/inventory");
}

export async function updateVehicle(id: string, formData: FormData) {
    const user = await checkRole(["admin", "sales"]);

    // Ensure vehicle belongs to user's dealer
    const existingVehicle = await db.query.vehicles.findFirst({
        where: and(
            eq(vehicles.id, id),
            eq(vehicles.dealerId, user.dealerId)
        )
    });

    if (!existingVehicle) {
        throw new Error("Vehicle not found or unauthorized");
    }

    const rawData = {
        make: formData.get("make"),
        model: formData.get("model"),
        year: formData.get("year"),
        price: formData.get("price"),
        mileage: formData.get("mileage"),
        status: formData.get("status"),
        condition: formData.get("condition"),
        vin: formData.get("vin"),
        stockNumber: formData.get("stockNumber") || undefined,
        costPrice: formData.get("costPrice") || undefined,
        color: formData.get("color") || undefined,
        engineSize: formData.get("engineSize") || undefined,
        transmission: formData.get("transmission") || undefined,
        fuelType: formData.get("fuelType") || undefined,
        doors: formData.get("doors") || undefined,
        seats: formData.get("seats") || undefined,
        bodyType: formData.get("bodyType") || undefined,
        variant: formData.get("variant") || undefined,
        description: formData.get("description") || undefined,
        features: JSON.parse(formData.get("features") as string || "[]"),
        images: JSON.parse(formData.get("images") as string || "[]"),
    };

    const validatedData = vehicleSchema.parse(rawData);

    await db.update(vehicles)
        .set({
            ...validatedData,
            price: validatedData.price.toString(),
            costPrice: validatedData.costPrice?.toString() ?? undefined,
        })
        .where(eq(vehicles.id, id));

    revalidatePath("/dashboard/inventory");
    revalidatePath(`/dashboard/inventory/${id}`);
    revalidatePath(`/inventory/${id}`);
    redirect("/dashboard/inventory");
}
