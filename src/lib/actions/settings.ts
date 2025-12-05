"use server";

import { db } from "@/lib/db";
import { dealers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserProfile } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";

export async function updateDealerProfile(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
}) {
    const user = await getUserProfile();

    if (user.role !== "admin") {
        throw new Error("Unauthorized: Only admins can update dealership settings");
    }

    await db.update(dealers)
        .set({
            name: data.name,
            contactEmail: data.email,
            contactPhone: data.phone,
            address: data.address,
            updatedAt: new Date(),
        })
        .where(eq(dealers.id, user.dealerId));

    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function getUsers() {
    const user = await getUserProfile();

    if (user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const dealerUsers = await db
        .select()
        .from(users)
        .where(eq(users.dealerId, user.dealerId));

    return dealerUsers;
}

export async function updateUserRole(userId: string, role: "admin" | "sales" | "service" | "viewer") {
    const currentUser = await getUserProfile();

    if (currentUser.role !== "admin") {
        throw new Error("Unauthorized");
    }

    // Prevent removing own admin status if you are the only admin (optional safety check, skipping for MVP)

    await db.update(users)
        .set({
            role: role,
            updatedAt: new Date(),
        })
        .where(and(eq(users.id, userId), eq(users.dealerId, currentUser.dealerId)));

    revalidatePath("/dashboard/settings");
    return { success: true };
}


