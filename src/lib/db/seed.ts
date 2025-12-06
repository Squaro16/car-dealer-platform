import { db, client } from "./index";
import { dealers, users, vehicles, sales, leads, expenses, sourcingRequests, customers } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    console.log("🌱 Seeding database...");

    try {
        // 0. Cleanup (Optional: remove if you want to keep existing data)
        console.log("🧹 Clearing existing data...");
        // Clear dependent tables first
        await db.delete(sales);
        await db.delete(leads);
        await db.delete(expenses);
        await db.delete(sourcingRequests);
        await db.delete(customers);
        // Then clear core tables
        await db.delete(vehicles);
        await db.delete(users);
        await db.delete(dealers);

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
                images: [
                    "https://images.unsplash.com/photo-1621995166270-344425dd943b?q=80&w=2574&auto=format&fit=crop", // Alphard/Van front
                    "https://images.unsplash.com/photo-1596822262945-8149eb556276?q=80&w=2670&auto=format&fit=crop", // Interior
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2574&auto=format&fit=crop", // Side/Rear
                ],
                features: ["Dual Power Sliding Doors", "Captain Seats", "Moonroof", "Alpine Sound System"],
                description: "The ultimate luxury people mover. This Toyota Alphard comes with the highly sought-after SC package, featuring pilot seats and a premium sound system. Perfect for executive transport or family comfort.",
                engineSize: "2.5L",
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
                images: [
                    "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2531&auto=format&fit=crop", // Mercedes Front
                    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop", // Interior
                    "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop", // Rear/Side
                    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2664&auto=format&fit=crop", // Detail
                ],
                features: ["AMG Body Styling", "Widescreen Cockpit", "360 Camera", "Memory Seats", "Apple CarPlay"],
                description: "Experience the perfect balance of elegance and sportiness with this E200 AMG Line. Barely driven with only 5,000km on the clock. Showroom condition.",
                engineSize: "2.0L",
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
