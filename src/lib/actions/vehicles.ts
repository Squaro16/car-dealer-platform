"use server";

import { db } from "@/lib/db";
import { vehicles } from "@/lib/db/schema";
import { eq, desc, asc, and, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteImages } from "@/lib/storage";
import { getUserProfile, checkRole } from "@/lib/auth/utils";

export type GetVehiclesOptions = {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    minMileage?: number;
    maxMileage?: number;
    make?: string;
    bodyType?: string;
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
};

export async function getVehicles(options: GetVehiclesOptions = {}) {
    const user = await getUserProfile();

    const page = options.page || 1;
    const limit = options.limit || 12;
    const offset = (page - 1) * limit;
    const sort = options.sort || "created_at_desc";

    const conditions = [
        eq(vehicles.dealerId, user.dealerId) // Enforce multi-tenancy
    ];

    if (options.make && options.make !== "all") {
        conditions.push(eq(vehicles.make, options.make));
    }

    if (options.bodyType && options.bodyType !== "all") {
        conditions.push(eq(vehicles.bodyType, options.bodyType));
    }

    if (options.status && options.status !== "all") {
        conditions.push(eq(vehicles.status, options.status as "in_stock" | "reserved" | "sold" | "hidden"));
    }

    if (options.minYear) conditions.push(sql`${vehicles.year} >= ${options.minYear}`);
    if (options.maxYear) conditions.push(sql`${vehicles.year} <= ${options.maxYear}`);
    if (options.minMileage) conditions.push(sql`${vehicles.mileage} >= ${options.minMileage}`);
    if (options.maxMileage) conditions.push(sql`${vehicles.mileage} <= ${options.maxMileage}`);

    // Build where clause
    const whereClause = and(...conditions);

    // Sort mapping
    let orderBy;
    switch (sort) {
        case "price_asc": orderBy = asc(vehicles.price); break;
        case "price_desc": orderBy = desc(vehicles.price); break;
        case "year_asc": orderBy = asc(vehicles.year); break;
        case "year_desc": orderBy = desc(vehicles.year); break;
        case "mileage_asc": orderBy = asc(vehicles.mileage); break;
        case "mileage_desc": orderBy = desc(vehicles.mileage); break;
        default: orderBy = desc(vehicles.createdAt);
    }

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
        .orderBy(orderBy)
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

export async function getPublicVehicles(options: GetVehiclesOptions = {}) {
    // Public access - no user check
    const page = options.page || 1;
    const limit = options.limit || 12;
    const offset = (page - 1) * limit;
    const sort = options.sort || "created_at_desc";

    const conditions = [
        eq(vehicles.status, "in_stock") // Only show in-stock vehicles publicly
    ];

    if (options.make && options.make !== "all") {
        conditions.push(eq(vehicles.make, options.make));
    }

    if (options.bodyType && options.bodyType !== "all") {
        conditions.push(eq(vehicles.bodyType, options.bodyType));
    }

    if (options.minYear) conditions.push(sql`${vehicles.year} >= ${options.minYear}`);
    if (options.maxYear) conditions.push(sql`${vehicles.year} <= ${options.maxYear}`);
    if (options.minMileage) conditions.push(sql`${vehicles.mileage} >= ${options.minMileage}`);
    if (options.maxMileage) conditions.push(sql`${vehicles.mileage} <= ${options.maxMileage}`);

    // Build where clause
    const whereClause = and(...conditions);

    // Sort mapping
    let orderBy;
    switch (sort) {
        case "price_asc": orderBy = asc(vehicles.price); break;
        case "price_desc": orderBy = desc(vehicles.price); break;
        case "year_asc": orderBy = asc(vehicles.year); break;
        case "year_desc": orderBy = desc(vehicles.year); break;
        case "mileage_asc": orderBy = asc(vehicles.mileage); break;
        case "mileage_desc": orderBy = desc(vehicles.mileage); break;
        default: orderBy = desc(vehicles.createdAt);
    }

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
        .orderBy(orderBy)
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

export async function getUniqueModels() {
    // Return one vehicle per Make+Model+Year combination to serve as a Spec Sheet
    // Ideally we would have a dedicated Models table, but for this dealer template we infer from inventory
    const data = await db.select().from(vehicles)
        .where(eq(vehicles.status, 'in_stock'))
        .orderBy(desc(vehicles.year), desc(vehicles.price));

    const uniqueMap = new Map();
    data.forEach(car => {
        // distinct by Make, Model, Year, Variant
        const key = `${car.make}-${car.model}-${car.year}-${car.variant || ''}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, car);
        }
    });

    return Array.from(uniqueMap.values());
}

export async function getInventoryStats() {
    const stats = await db
        .select({
            brand: vehicles.make,
            count: count(vehicles.id)
        })
        .from(vehicles)
        .where(eq(vehicles.status, "in_stock"))
        .groupBy(vehicles.make)
        .orderBy(desc(count(vehicles.id)));

    return stats;
}
