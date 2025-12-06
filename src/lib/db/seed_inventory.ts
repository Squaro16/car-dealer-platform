import { db, client } from "./index";
import { dealers, users, vehicles } from "./schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const luxuryCars = [
    {
        make: "Ferrari",
        model: "F8 Tributo",
        year: 2022,
        variant: "3.9L V8",
        price: "450000",
        mileage: 3200,
        status: "in_stock",
        condition: "used",
        fuelType: "petrol",
        transmission: "automatic",
        color: "Rosso Corsa",
        images: ["https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1000&q=80"]
    },
    {
        make: "Lamborghini",
        model: "Huracan EVO",
        year: 2023,
        variant: "LP 640-4",
        price: "680000",
        mileage: 1500,
        status: "in_stock",
        condition: "used",
        fuelType: "petrol",
        transmission: "automatic",
        color: "Grigio Titans",
        images: ["https://images.unsplash.com/photo-1544605972-e2d499138009?auto=format&fit=crop&w=1000&q=80"]
    },
    {
        make: "Porsche",
        model: "911 GT3 RS",
        year: 2024,
        variant: "Weissach Package",
        price: "550000",
        mileage: 100,
        status: "in_stock",
        condition: "new",
        fuelType: "petrol",
        transmission: "pdk",
        color: "Black",
        images: ["https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=1000&q=80"]
    },
    {
        make: "Rolls-Royce",
        model: "Phantom",
        year: 2023,
        variant: "Extended Wheelbase",
        price: "1200000",
        mileage: 500,
        status: "in_stock",
        condition: "used",
        fuelType: "petrol",
        transmission: "automatic",
        color: "Arctic White",
        images: ["https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80"]
    },
    {
        make: "McLaren",
        model: "720S",
        year: 2021,
        variant: "Performance",
        price: "380000",
        mileage: 8500,
        status: "in_stock",
        condition: "used",
        fuelType: "petrol",
        transmission: "automatic",
        color: "Volcano Orange",
        images: ["https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1000&q=80"]
    },
    {
        make: "Bugatti",
        model: "Chiron",
        year: 2022,
        variant: "Pur Sport",
        price: "3500000",
        mileage: 1200,
        status: "available",
        condition: "used",
        fuelType: "petrol",
        transmission: "automatic",
        color: "Blue",
        images: ["https://images.unsplash.com/photo-1627454820574-fb99d0e2e8f1?auto=format&fit=crop&w=1000&q=80"]
    }
];

async function main() {
    console.log("🏎️  Seeding luxury inventory...");

    try {
        // 1. Get Dealer
        const dealer = await db.query.dealers.findFirst({
            where: eq(dealers.slug, "prestige-motors")
        });

        if (!dealer) {
            throw new Error("Dealer not found. Run standard seed first.");
        }

        // 2. Get Admin User
        const admin = await db.query.users.findFirst({
            where: eq(users.email, "admin@prestigemotors.com")
        });

        if (!admin) {
            throw new Error("Admin user not found. Run standard seed first.");
        }

        // 3. Insert Vehicles
        for (const car of luxuryCars) {
            await db.insert(vehicles).values({
                dealerId: dealer.id,
                make: car.make,
                model: car.model,
                year: car.year,
                variant: car.variant,
                price: car.price,
                mileage: car.mileage,
                status: car.status as any,
                condition: car.condition as any,
                fuelType: car.fuelType,
                transmission: car.transmission,
                color: car.color,
                images: car.images,
                createdById: admin.id,
            } as any);
            console.log(`✅ Added ${car.make} ${car.model}`);
        }

        console.log("✨ Inventory seeding complete!");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await client.end();
    }
}

main();
