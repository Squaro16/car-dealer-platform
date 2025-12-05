"use server";

import { sendLeadNotification } from "@/lib/email";

import { db } from "@/lib/db";
import { leads, vehicles } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserProfile, checkRole } from "@/lib/auth/utils";

export async function getLeads() {
    const user = await getUserProfile();

    const data = await db.select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        phone: leads.phone,
        status: leads.status,
        source: leads.source,
        message: leads.message,
        createdAt: leads.createdAt,
        vehicle: {
            make: vehicles.make,
            model: vehicles.model,
            year: vehicles.year,
        }
    })
        .from(leads)
        .leftJoin(vehicles, eq(leads.vehicleId, vehicles.id))
        .where(eq(leads.dealerId, user.dealerId))
        .orderBy(desc(leads.createdAt));

    return data;
}

export async function updateLeadStatus(id: string, status: string) {
    const user = await checkRole(["admin", "sales"]);

    // Ensure lead belongs to user's dealer
    const lead = await db.query.leads.findFirst({
        where: and(
            eq(leads.id, id),
            eq(leads.dealerId, user.dealerId)
        )
    });

    if (!lead) {
        throw new Error("Lead not found or unauthorized");
    }

    await db.update(leads).set({ status: status as "new" | "contacted" | "qualified" | "test_drive_booked" | "won" | "lost" }).where(eq(leads.id, id));
    revalidatePath("/dashboard/leads");
}

export async function createLead(formData: FormData) {
    // Public action, but needs to assign to the correct dealer based on the vehicle
    const vehicleId = formData.get("vehicleId") as string;

    // Fetch vehicle to get dealerId
    const vehicleData = await db.select().from(vehicles).where(eq(vehicles.id, vehicleId));
    const vehicle = vehicleData[0];

    if (!vehicle) {
        throw new Error("Vehicle not found");
    }

    const rawData = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
        vehicleId: vehicleId,
        dealerId: vehicle.dealerId,
        source: "website" as const,
        status: "new" as const,
    };

    await db.insert(leads).values(rawData);

    if (vehicle) {
        await sendLeadNotification({
            leadName: rawData.name,
            leadEmail: rawData.email,
            leadPhone: rawData.phone,
            leadMessage: rawData.message,
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleYear: vehicle.year,
            vehicleId: vehicle.id,
        });
    }

    return { success: true };
}
