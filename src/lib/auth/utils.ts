import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "sales" | "service" | "viewer";

export interface AuthSession {
    user: any;
    profile: any;
    expiresAt: number;
    isValid: boolean;
}

// Cache for session validation to reduce database calls
const sessionCache = new Map<string, { profile: any; expiresAt: number }>();
const SESSION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        // Clear any cached session data
        sessionCache.delete(user?.id || 'anonymous');
        redirect("/login");
    }

    // Check cache first
    const cached = sessionCache.get(user.id);
    if (cached && Date.now() < cached.expiresAt) {
        return cached.profile;
    }

    const userProfile = await db.query.users.findFirst({
        where: eq(users.id, user.id),
        with: {
            dealer: true,
        },
    });

    if (!userProfile) {
        // Clear cache and handle missing profile
        sessionCache.delete(user.id);
        throw new Error("User profile not found. Please contact your administrator.");
    }

    if (!userProfile.isActive) {
        // Clear cache for inactive users
        sessionCache.delete(user.id);
        throw new Error("Your account has been deactivated. Please contact your administrator.");
    }

    // Cache the profile
    sessionCache.set(user.id, {
        profile: userProfile,
        expiresAt: Date.now() + SESSION_CACHE_TTL
    });

    return userProfile;
}

export async function validateSession(): Promise<AuthSession> {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        return {
            user: null,
            profile: null,
            expiresAt: 0,
            isValid: false
        };
    }

    try {
        const profile = await getUserProfile();
        return {
            user: session.user,
            profile,
            expiresAt: new Date(session.expires_at!).getTime(),
            isValid: true
        };
    } catch {
        return {
            user: session.user,
            profile: null,
            expiresAt: new Date(session.expires_at!).getTime(),
            isValid: false
        };
    }
}

export async function invalidateSession(userId?: string) {
    const supabase = await createClient();

    if (userId) {
        sessionCache.delete(userId);
    } else {
        // Clear all cached sessions (useful for admin actions)
        sessionCache.clear();
    }

    await supabase.auth.signOut();
}

export async function checkRole(allowedRoles: UserRole[]) {
    const profile = await getUserProfile();

    if (!allowedRoles.includes(profile.role as UserRole)) {
        throw new Error("Unauthorized: Insufficient permissions");
    }

    return profile;
}
