import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { users, dealers } from "./schema";
import { eq } from "drizzle-orm"; // drizzle-orm is fine to static import? No, schema depends on types? Schema is pure defs.

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Supabase URL or Service Role Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { db, client } = await import("./index");

    const email = "admin@lsgroup.com.my";
    const password = "LSGroup@123!";
    let userId: string | null = null;

    console.log(`🌱 Seeding admin user: ${email}`);

    // 1. Create User in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: "LS Group Admin" }
    });

    if (error) {
        if (error.message.includes("already been registered")) {
            console.log("ℹ️ User already exists in Supabase Auth. Fetching ID...");
            // List users to find the ID (admin.listUsers)
            const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
            if (listError) {
                console.error("❌ Failed to list users:", listError.message);
                process.exit(1);
            }
            const existingUser = listData.users.find(u => u.email === email);
            if (existingUser) {
                userId = existingUser.id;
                console.log(`✅ Found existing Supabase User ID: ${userId}`);
            } else {
                console.error("❌ User registered but not found in list. This is unexpected.");
                process.exit(1);
            }
        } else {
            console.error("❌ Failed to create Supabase user:", error.message);
            process.exit(1);
        }
    } else {
        userId = data.user.id;
        console.log(`✅ Created Supabase User ID: ${userId}`);
    }

    if (!userId) {
        console.error("❌ Could not determine User ID.");
        process.exit(1);
    }

    // 2. Insert/Update User in Public Database
    console.log("🔄 Syncing to public.users table...");

    // Get the dealer ID
    const dealerResults = await db.select().from(dealers).where(eq(dealers.slug, "ls-motor")).limit(1);
    const dealer = dealerResults[0];

    if (!dealer) {
        console.error("❌ Dealer 'ls-motor' not found. Please run the main seed script first.");
        process.exit(1);
    }

    try {
        await db.insert(users).values({
            id: userId,
            dealerId: dealer.id,
            email: email,
            name: "LS Group Admin",
            role: "admin",
            isActive: true,
        }).onConflictDoUpdate({
            target: users.id,
            set: {
                role: "admin",
                dealerId: dealer.id,
                email: email, // ensure email matches
                isActive: true
            }
        });

        console.log(`✅ User 'admin@lsgroup.com.my' is now an Admin for 'LS Motor'.`);
    } catch (dbError) {
        console.error("❌ Database sync failed:", dbError);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
