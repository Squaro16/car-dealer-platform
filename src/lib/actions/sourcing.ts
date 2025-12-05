"use server";

import { db } from "@/lib/db";
import { sourcingRequests } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function createSourcingRequest(formData: FormData) {
    // 1. Get the dealer ID (assuming single dealer for now, or pick the first one)
    const dealer = await db.query.dealers.findFirst();

    if (!dealer) {
        throw new Error("No dealer configuration found.");
    }

    // 2. Extract data
    const rawData = {
        dealerId: dealer.id,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        make: formData.get("make") as string,
        model: formData.get("model") as string,
        yearRange: (formData.get("yearRange") as string) || null,
        budget: formData.get("budget") && String(formData.get("budget")).trim() !== "" ? String(formData.get("budget")) : null,
        color: (formData.get("color") as string) || null,
        transmission: (formData.get("transmission") as string) === "" ? null : (formData.get("transmission") as "automatic" | "manual" | "cvt" | "dct" | null),
        notes: (formData.get("notes") as string) || null,
        status: "new" as const,
    };

    // 3. Insert into DB
    await db.insert(sourcingRequests).values(rawData);

    // 4. Revalidate (if we had an admin list view, we'd revalidate that too)
    revalidatePath("/dashboard/leads");

    return { success: true };
}
