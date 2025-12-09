// Seeds a minimal, deterministic dataset for e2e runs (dealer, admin, vehicles, customer).
// Ensures the login user used in Playwright exists in Supabase and in the public.users table.
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase envs. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
}

const adminEmail = "admin@lsgroup.com.my";
const adminPassword = "LSGroup@123!";
const salesEmail = "sales@lsgroup.com.my";
const salesPassword = "LSGroup@123!";
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function ensureAuthUser(): Promise<string> {
    const { data, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { name: "E2E Admin" },
    });

    if (!error && data.user?.id) {
        console.log({ createdUserId: data.user.id });
        return data.user.id;
    }

    if (error && !error.message.includes("already")) {
        console.error("Failed to create Supabase user:", error.message);
        process.exit(1);
    }

    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error("Failed to list Supabase users:", listError.message);
        process.exit(1);
    }

    const existing = listData.users.find((u) => u.email === adminEmail);
    if (!existing) {
        console.error("Supabase user not found after creation attempt.");
        process.exit(1);
    }

    console.log({ existingUserId: existing.id });
    return existing.id;
}

async function ensureSalesUser(): Promise<string> {
    const { data, error } = await supabase.auth.admin.createUser({
        email: salesEmail,
        password: salesPassword,
        email_confirm: true,
        user_metadata: { name: "E2E Sales" },
    });

    if (!error && data.user?.id) {
        console.log({ createdSalesId: data.user.id });
        return data.user.id;
    }

    if (error && !error.message.includes("already")) {
        console.error("Failed to create sales user:", error.message);
        process.exit(1);
    }

    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error("Failed to list Supabase users:", listError.message);
        process.exit(1);
    }

    const existing = listData.users.find((u) => u.email === salesEmail);
    if (!existing) {
        console.error("Sales user not found after creation attempt.");
        process.exit(1);
    }

    console.log({ existingSalesId: existing.id });
    return existing.id;
}

async function main() {
    const adminId = await ensureAuthUser();
    const salesId = await ensureSalesUser();
    const { db, client } = await import("../src/lib/db");
    const { dealers, users, vehicles, customers, sales, leads, expenses, makes } = await import("../src/lib/db/schema");

    console.log("🧹 Clearing data for e2e seed...");
    await db.delete(sales);
    await db.delete(leads);
    await db.delete(expenses);
    await db.delete(vehicles);
    await db.delete(customers);
    await db.delete(users);
    await db.delete(dealers);

    console.log("✅ Cleared tables");

    const [dealer] = await db
        .insert(dealers)
        .values({
            name: "LS Motor E2E",
            slug: "ls-motor-e2e",
            contactEmail: adminEmail,
            contactPhone: "+65 6000 0000",
            address: "1 Test Drive, Singapore",
            settings: { currency: "SGD", country: "SG" },
        })
        .returning();

    await db
        .insert(users)
        .values({
            id: adminId,
            dealerId: dealer.id,
            email: adminEmail,
            name: "E2E Admin",
            role: "admin",
            isActive: true,
        })
        .onConflictDoUpdate({
            target: users.id,
            set: {
                dealerId: dealer.id,
                email: adminEmail,
                name: "E2E Admin",
                role: "admin",
                isActive: true,
            },
        });

    await db
        .insert(users)
        .values({
            id: salesId,
            dealerId: dealer.id,
            email: salesEmail,
            name: "E2E Sales",
            role: "sales",
            isActive: true,
        })
        .onConflictDoUpdate({
            target: users.id,
            set: {
                dealerId: dealer.id,
                email: salesEmail,
                name: "E2E Sales",
                role: "sales",
                isActive: true,
            },
        });

    const [customer] = await db
        .insert(customers)
        .values({
            dealerId: dealer.id,
            name: "Test Customer",
            email: "customer@test.com",
            phone: "90000000",
            address: "123 Test St",
            idNumber: "T1234567A",
        })
        .returning();

    // First, seed some test makes with known IDs
    const testMakes = await db.insert(makes).values([
        {
            id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
            name: "Toyota",
            country: "Japan",
            foundedYear: 1937,
            website: "https://www.toyota.com",
            displayOrder: 1,
        },
        {
            id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
            name: "Honda",
            country: "Japan",
            foundedYear: 1948,
            website: "https://www.honda.com",
            displayOrder: 2,
        },
        {
            id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
            name: "Mercedes-Benz",
            country: "Germany",
            foundedYear: 1926,
            website: "https://www.mercedes-benz.com",
            displayOrder: 3,
        },
    ]).returning();

    const insertedVehicles = await db.insert(vehicles).values([
        {
            id: "11111111-1111-4111-8111-111111111111",
            dealerId: dealer.id,
            makeId: testMakes[0].id, // Toyota
            model: "Corolla",
            year: 2022,
            variant: "Altis",
            price: "120000",
            mileage: 15000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "automatic",
            color: "White",
            createdById: adminId,
            images: [],
            features: ["Keyless Entry", "LED Headlights"],
        },
        {
            id: "22222222-2222-4222-8222-222222222222",
            dealerId: dealer.id,
            makeId: testMakes[1].id, // Honda
            model: "Civic",
            year: 2023,
            variant: "RS",
            price: "135000",
            mileage: 8000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "automatic",
            color: "Black",
            createdById: adminId,
            images: [],
            features: ["Adaptive Cruise", "Lane Keep Assist"],
        },
    ]).returning({ id: vehicles.id });

    // Seed a lead tied to the first vehicle for status-update flows
    const firstVehicleId = insertedVehicles[0]?.id;
    if (firstVehicleId) {
        await db.insert(leads).values({
            dealerId: dealer.id,
            vehicleId: firstVehicleId,
            name: "Seed Lead",
            email: "lead@test.com",
            phone: "90000001",
            status: "new",
            source: "website",
            message: "Interested in this vehicle.",
        });
    }

    console.log({
        seededDealer: dealer.slug,
        adminUser: adminEmail,
        salesUser: salesEmail,
        seededCustomer: customer.email,
    });
    await client.end();
}

main().catch((error) => {
    console.error("E2E seed failed:", error);
    process.exit(1);
});

