import { db, client } from "./index";
import { dealers, users, vehicles } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    console.log("🌱 Seeding database...");

    try {
        // 1. Create Dealer
        const [dealer] = await db.insert(dealers).values({
            name: "Prestige Motors",
            slug: "prestige-motors",
            contactEmail: "admin@prestigemotors.com",
            settings: { currency: "SGD", country: "SG" },
        }).returning();

        console.log("✅ Dealer created:", dealer.name);

        // 2. Create Admin User (Note: In real app, this ID comes from Supabase Auth)
        // For seeding, we'll generate a random UUID, but you should update this 
        // to match your actual Supabase User ID if you want to log in.
        const [admin] = await db.insert(users).values({
            id: "00000000-0000-0000-0000-000000000000", // REPLACE WITH REAL SUPABASE USER ID
            dealerId: dealer.id,
            email: "admin@prestigemotors.com",
            name: "Admin User",
            role: "admin",
        }).returning();

        console.log("✅ Admin user created");

        // 3. Create Sample Vehicles
        await db.insert(vehicles).values([
            {
                dealerId: dealer.id,
                make: "Toyota",
                model: "Alphard",
                year: 2021,
                variant: "2.5 SC Package",
                price: "238000",
                mileage: 45000,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "cvt",
                color: "White",
                createdById: admin.id,
            },
            {
                dealerId: dealer.id,
                make: "Mercedes-Benz",
                model: "E200",
                year: 2023,
                variant: "AMG Line",
                price: "318000",
                mileage: 5000,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Black",
                createdById: admin.id,
            },
        ]);

        console.log("✅ Sample vehicles created");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await client.end();
    }
}

main();
