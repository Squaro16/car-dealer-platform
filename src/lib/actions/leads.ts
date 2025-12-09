/** Handles lead capture and seller requests with validation, captcha, and rate limits. */
"use server";

import { sendLeadNotification } from "@/lib/email";

import { db } from "@/lib/db";
import { leads, vehicles, makes } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getUserProfile, checkRole } from "@/lib/auth/utils";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { verifyCaptchaToken } from "@/lib/security/captcha";
import {
    leadSchema,
    sellRequestSchema,
    type LeadFormValues,
    type SellRequestFormValues,
} from "@/lib/validations/lead";

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
            make: makes.name,
            model: vehicles.model,
            year: vehicles.year,
        }
    })
        .from(leads)
        .leftJoin(vehicles, eq(leads.vehicleId, vehicles.id))
        .leftJoin(makes, eq(vehicles.makeId, makes.id))
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
    const requestHeaders = await headers();
    const ip =
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        requestHeaders.get("x-real-ip") ??
        "unknown";

    enforceRateLimit(`lead:${ip}`, 60_000, 5);

    const parsedData: LeadFormValues = leadSchema.parse({
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
        vehicleId: formData.get("vehicleId"),
        captchaToken: formData.get("captchaToken") as string | null,
    });

    await verifyCaptchaToken(parsedData.captchaToken);

    // Fetch vehicle to get dealerId
    const vehicleData = await db
        .select({
            id: vehicles.id,
            dealerId: vehicles.dealerId,
            make: makes.name,
            model: vehicles.model,
            year: vehicles.year,
        })
        .from(vehicles)
        .leftJoin(makes, eq(vehicles.makeId, makes.id))
        .where(eq(vehicles.id, parsedData.vehicleId));
    const vehicle = vehicleData[0];

    if (!vehicle) {
        throw new Error("Vehicle not found");
    }

    await db.insert(leads).values({
        name: parsedData.name,
        phone: parsedData.phone,
        email: parsedData.email || null,
        message: parsedData.message,
        vehicleId: parsedData.vehicleId,
        dealerId: vehicle.dealerId,
        source: "website",
        status: "new",
    });

    if (vehicle) {
        await sendLeadNotification({
            leadName: parsedData.name,
            leadEmail: parsedData.email || "",
            leadPhone: parsedData.phone,
            leadMessage: parsedData.message,
            vehicleMake: vehicle.make ?? "Unknown",
            vehicleModel: vehicle.model,
            vehicleYear: vehicle.year,
            vehicleId: vehicle.id,
        });
    }

    return { success: true };
}

import { dealers } from "@/lib/db/schema";

export async function submitSellRequest(data: SellRequestFormValues) {
    const requestHeaders = await headers();
    const ip =
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        requestHeaders.get("x-real-ip") ??
        "unknown";

    enforceRateLimit(`sell:${ip}`, 60_000, 3);

    const parsedData = sellRequestSchema.parse(data);
    await verifyCaptchaToken(parsedData.captchaToken);

    // Find default dealer (first one)
    const dealerData = await db.select().from(dealers).limit(1);
    const dealer = dealerData[0];

    if (!dealer) throw new Error("No dealer found to submit request to.");

    const message = `SELL REQUEST:
Vehicle: ${parsedData.year} ${parsedData.make} ${parsedData.model}
VIN: ${parsedData.vin}
Mileage: ${parsedData.mileage}
Condition: ${parsedData.condition}
Expected Price: ${parsedData.price || "N/A"}`;

    await db.insert(leads).values({
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        message: message,
        dealerId: dealer.id,
        source: "website",
        status: "new",
        // No vehicleId as it's not in inventory yet
    });

    return { success: true };
}
