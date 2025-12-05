
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { dealers, users } from "./src/lib/db/schema";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
// Use anon key for signup, or service role if anon disabled... usually anon is fine for signup if open.
// Actually, better to use service role key to bypass email confirmation if possible, or just standard signup.
// Let's use service_role to auto-confirm if possible or just use admin api.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

// DB setup
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
    const email = "evaluation_admin@example.com";
    const password = "Password123!";

    console.log(`Attempting to create user: ${email}`);

    // 1. Create User in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (error) {
        console.error("Error creating user:", error);
        // If user already exists, try to get their ID?
        // But for fresh start, let's assume we need to make one.
        // If "User already registered", proceed.
    }

    let userId = data.user?.id;

    if (!userId) {
        // Try to sign in to get ID if they exist
        const { data: loginData } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        userId = loginData.user?.id;
    }

    if (!userId) {
        console.error("Could not get user ID. Exiting.");
        process.exit(1);
    }

    console.log(`User ID: ${userId}`);

    // 2. Create Dealer if not exists
    let dealerId: string;
    const existingDealer = await db.select().from(dealers).limit(1);

    if (existingDealer.length > 0) {
        dealerId = existingDealer[0].id;
        console.log("Using existing dealer:", dealerId);
    } else {
        const [dealer] = await db.insert(dealers).values({
            name: "Evaluation Motors",
            slug: "evaluation-motors",
            contactEmail: email,
            settings: { currency: "USD", country: "US" },
        }).returning();
        dealerId = dealer.id;
        console.log("Created new dealer:", dealerId);
    }

    // 3. Create/Update User Profile
    // Check if user profile exists
    const existingUser = await db.select().from(users).where(eq(users.id, userId));

    if (existingUser.length > 0) {
        console.log("User profile already exists.");
        // Ensure role is admin
        await db.update(users).set({ role: "admin", dealerId }).where(eq(users.id, userId));
        console.log("Updated user role to admin.");
    } else {
        await db.insert(users).values({
            id: userId,
            dealerId: dealerId,
            email: email,
            name: "Eval Admin",
            role: "admin",
        });
        console.log("Created user profile.");
    }

    console.log("Setup complete. You can now log in.");
    process.exit(0);
}

main();
