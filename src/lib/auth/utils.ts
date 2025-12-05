import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "sales" | "service" | "viewer";

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const userProfile = await db.query.users.findFirst({
        where: eq(users.id, user.id),
        with: {
            dealer: true,
        },
    });

    if (!userProfile) {
        // This handles the case where a user is in Supabase Auth but not in our DB
        // In a real app, you might redirect to an onboarding page
        throw new Error("User profile not found");
    }

    if (!userProfile.isActive) {
        throw new Error("User account is inactive");
    }

    return userProfile;
}

export async function checkRole(allowedRoles: UserRole[]) {
    const profile = await getUserProfile();

    if (!allowedRoles.includes(profile.role as UserRole)) {
        throw new Error("Unauthorized: Insufficient permissions");
    }

    return profile;
}
