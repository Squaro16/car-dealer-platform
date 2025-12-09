/** Handles public sourcing requests with validation, captcha, and rate limits. */
"use server";

import { db } from "@/lib/db";
import { sourcingRequests } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { verifyCaptchaToken } from "@/lib/security/captcha";
import {
    sourcingRequestSchema,
    type SourcingRequestFormValues,
} from "@/lib/validations/sourcing-request";

export async function createSourcingRequest(formData: FormData) {
    const requestHeaders = await headers();
    const ip =
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        requestHeaders.get("x-real-ip") ??
        "unknown";

    enforceRateLimit(`sourcing:${ip}`, 60_000, 5);

    const parsedData: SourcingRequestFormValues = sourcingRequestSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        make: formData.get("make"),
        model: formData.get("model"),
        yearRange: formData.get("yearRange"),
        budget: formData.get("budget"),
        color: formData.get("color"),
        transmission: formData.get("transmission"),
        notes: formData.get("notes"),
        captchaToken: formData.get("captchaToken") as string | null,
    });

    await verifyCaptchaToken(parsedData.captchaToken);

    // 1. Get the dealer ID (single dedicated dealer)
    const dealer = await db.query.dealers.findFirst();

    if (!dealer) {
        throw new Error("No dealer configuration found.");
    }

    // 2. Extract data
    const rawData = {
        dealerId: dealer.id,
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        make: parsedData.make,
        model: parsedData.model,
        yearRange: parsedData.yearRange || null,
        budget: parsedData.budget
            ? String(parsedData.budget)
            : null,
        color: parsedData.color || null,
        transmission: parsedData.transmission || null,
        notes: parsedData.notes || null,
        status: "new" as const,
    };

    // 3. Insert into DB
    await db.insert(sourcingRequests).values(rawData);

    // 4. Revalidate (if we had an admin list view, we'd revalidate that too)
    revalidatePath("/dashboard/leads");

    return { success: true };
}
