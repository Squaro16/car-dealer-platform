import { dealers, users, vehicles, sales, leads, expenses, sourcingRequests, customers } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { db, client } = await import("./index");

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
            // 1. Research: Lamborghini Aventador (Utama Motors)
            {
                dealerId: dealer.id,
                make: "Lamborghini",
                model: "Aventador",
                year: 2019,
                variant: "SVJ LP770-4",
                price: "3490000",
                mileage: 12000,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Green",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1544614471-f9bba68d4072?q=80&w=2669&auto=format&fit=crop", // Green Aventador (replaced broken)
                    "https://images.unsplash.com/photo-1544614471-f9bba68d4072?q=80&w=2669&auto=format&fit=crop", // Interior detail
                    "https://images.unsplash.com/photo-1580274455117-1c911b66df82?q=80&w=2670&auto=format&fit=crop", // Rear
                ],
                features: ["V12 Engine", "ALA 2.0 Aerodynamics", "Carbon Fibre Monocoque", "Lift System", "Sensonum Audio"],
                description: "The pinnacle of Lamborghini V12 heritage. This Aventador SVJ is 1 of 900 worldwide. Finished in Verde Alceo with bespoke Ad Personam interior. A true collector's piece.",
                engineSize: "6.5L",
                bodyType: "Coupe"
            },
            // 2. Research: Porsche 911 GT3 RS (Utama Motors)
            {
                dealerId: dealer.id,
                make: "Porsche",
                model: "911",
                year: 2023,
                variant: "GT3 RS",
                price: "2380000",
                mileage: 1500,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "dct", // PDK
                color: "White",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2670&auto=format&fit=crop", // GT3 RS style
                    "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670&auto=format&fit=crop", // Detail
                    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2783&auto=format&fit=crop", // Action
                ],
                features: ["Weissach Package", "PCCB Ceramic Brakes", "Magnesium Wheels", "Club Sport Package", "Carbon Bucket Seats"],
                description: "Track weapon for the road. The 992 GT3 RS redefines aerodynamic performance. This unit features the full Weissach package and is finished in White with Pyro Red accents.",
                engineSize: "4.0L",
                bodyType: "Coupe"
            },
            // 3. Toyota Alphard (MPV staple)
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
                    "https://images.unsplash.com/photo-1596822262945-8149eb556276?q=80&w=2670&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1596822262945-8149eb556276?q=80&w=2670&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2574&auto=format&fit=crop",
                ],
                features: ["Dual Power Sliding Doors", "Captain Seats", "Moonroof", "Alpine Sound System", "360 Camera"],
                description: "The ultimate luxury people mover. This Alphard SC Package offers first-class travel for 7 passengers. Immaculate condition with full service history.",
                engineSize: "2.5L",
                bodyType: "MPV"
            },
            // 4. Mercedes-Benz E200 (Existing)
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
                    "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2531&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop",
                ],
                features: ["AMG Body Styling", "Widescreen Cockpit", "360 Camera", "Memory Seats", "Apple CarPlay"],
                description: "Elegance meets sportiness. This E200 AMG Line is practically brand new. Offers the latest MBUX system and driver assistance package.",
                engineSize: "2.0L",
                bodyType: "Sedan"
            },
            // 5. Ferrari 488 Pista
            {
                dealerId: dealer.id,
                make: "Ferrari",
                model: "488",
                year: 2020,
                variant: "Pista Spider",
                price: "2100000",
                mileage: 3400,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "dct",
                color: "Red",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2670&auto=format&fit=crop", // Red Ferrari
                    "https://images.unsplash.com/photo-1583121274602-3e2820c698d9?q=80&w=2574&auto=format&fit=crop", // Detail
                    "https://images.unsplash.com/photo-1534069818816-f28359288eac?q=80&w=2574&auto=format&fit=crop", // Convertible
                ],
                features: ["Carbon Fibre Racing Seats", "Suspension Lifter", "Titanium Exhaust", "Scuderia Shields", "JBL Audio"],
                description: "A convertible masterpiece. The 488 Pista Spider combines track-derived tech with open-top emotion. Finished in Rosso Corsa with NART stripes.",
                engineSize: "3.9L",
                bodyType: "Convertible"
            },
            // 6. Rolls Royce Ghost
            {
                dealerId: dealer.id,
                make: "Rolls Royce",
                model: "Ghost",
                year: 2022,
                variant: "Black Badge",
                price: "2850000",
                mileage: 8000,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Black",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2574&auto=format&fit=crop", // RR Ghost
                    "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2615&auto=format&fit=crop", // Spirit of Ecstasy
                    "https://images.unsplash.com/photo-1633511048182-2782b6c20530?q=80&w=2670&auto=format&fit=crop", // Interior
                ],
                features: ["Shooting Star Headliner", "Massage Seats", "Rear Theatre Configuration", "Bespoke Audio", "Lambswool Footmats"],
                description: "The ultimate expression of dynamism and luxury. Black Badge details with a bespoke Mugello Red interior. Effortless power and silence.",
                engineSize: "6.75L",
                bodyType: "Sedan"
            },
            // 7. McLaren 720S
            {
                dealerId: dealer.id,
                make: "McLaren",
                model: "720S",
                year: 2021,
                variant: "Performance",
                price: "1550000",
                mileage: 9500,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "dct",
                color: "Orange",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2670&auto=format&fit=crop", // McLaren Orange
                    "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2670&auto=format&fit=crop", // Doors Up
                    "https://images.unsplash.com/photo-1517362302400-873b4e30f5c0?q=80&w=2574&auto=format&fit=crop", // Interior
                ],
                features: ["Carbon Fibre Exterior Pack", "Sports Exhaust", "360 Park Assist", "Bowers & Wilkins Audio", "Vehicle Lift"],
                description: "Supercar benchmarks redefined. The 720S offers blistering acceleration and daily usability. Papaya Spark exterior with Alcantara interior.",
                engineSize: "4.0L",
                bodyType: "Coupe"
            },
            // 8. Bentley Continental GT
            {
                dealerId: dealer.id,
                make: "Bentley",
                model: "Continental",
                year: 2022,
                variant: "GT Speed",
                price: "1950000",
                mileage: 6000,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Blue",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2670&auto=format&fit=crop", // Bentley Front
                    "https://images.unsplash.com/photo-1471444026367-be3d463e8a4e?q=80&w=2669&auto=format&fit=crop", // Detail
                    "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=2694&auto=format&fit=crop", // Interior
                ],
                features: ["Rotating Display", "Mulliner Driving Spec", "Naim for Bentley", "City Specification", "Mood Lighting"],
                description: "The definitive Grand Tourer. W12 engine providing effortless torque. Sequin Blue with Linen/Beluga split interior.",
                engineSize: "6.0L",
                bodyType: "Coupe"
            },
            // 9. Land Rover Defender
            {
                dealerId: dealer.id,
                make: "Land Rover",
                model: "Defender",
                year: 2024,
                variant: "110 V8 Carpathian Edition",
                price: "988000",
                mileage: 100,
                status: "in_stock",
                condition: "new",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Grey",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1626090710684-1818274a2cb5?q=80&w=2670&auto=format&fit=crop", // Defender
                    "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?q=80&w=2574&auto=format&fit=crop", // Offroad vibe
                    "https://images.unsplash.com/photo-1605218427306-633ba88c9735?q=80&w=2670&auto=format&fit=crop", // Interior
                ],
                features: ["V8 Engine", "Air Suspension", "Meridian Surround Sound", "Head-Up Display", "ClearSight Rear View"],
                description: "Unstoppable capability meets V8 performance. Brand new unit. Carpathian Grey with Satin Protective Film from factory.",
                engineSize: "5.0L",
                bodyType: "SUV"
            },
            // 10. BMW M4 Competition
            {
                dealerId: dealer.id,
                make: "BMW",
                model: "M4",
                year: 2023,
                variant: "Competition xDrive",
                price: "850000",
                mileage: 12000,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Yellow",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1617814076668-8dfc6da342da?q=80&w=2672&auto=format&fit=crop", // BMW M4
                    "https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=2680&auto=format&fit=crop", // Wheel
                    "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2574&auto=format&fit=crop", // Interior
                ],
                features: ["M Carbon Bucket Seats", "Laserlight", "Harman Kardon", "Driving Assistant Pro", "M Drift Analyser"],
                description: "Pure driving dynamics. Sao Paulo Yellow with Yas Marina Blue interior. Full service history with BMW.",
                engineSize: "3.0L",
                bodyType: "Coupe"
            },
            // 11. Mercedes-Benz G63 AMG
            {
                dealerId: dealer.id,
                make: "Mercedes-Benz",
                model: "G-Class",
                year: 2022,
                variant: "AMG G 63",
                price: "1680000",
                mileage: 15000,
                status: "reserved",
                condition: "used",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Black",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1520031441872-265149a42303?q=80&w=2672&auto=format&fit=crop", // G Wagon
                    "https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=2574&auto=format&fit=crop", // Detail
                    "https://images.unsplash.com/photo-1563720360172-67b8f3dcebb1?q=80&w=2574&auto=format&fit=crop", // Interior
                ],
                features: ["Burmester Surround Sound", "Multibeam LED", "Night Package", "22-inch Forged Wheels", "Designo Leather"],
                description: "The automotive icon. Obsidian Black with Red Diamond stitching. Reserved for a VIP client.",
                engineSize: "4.0L",
                bodyType: "SUV"
            },
            // 12. Aston Martin DBX
            {
                dealerId: dealer.id,
                make: "Aston Martin",
                model: "DBX",
                year: 2021,
                variant: "V8",
                price: "1250000",
                mileage: 18000,
                status: "in_stock",
                condition: "used",
                fuelType: "petrol",
                transmission: "automatic",
                color: "Silver",
                createdById: admin.id,
                images: [
                    "https://images.unsplash.com/photo-1629897048514-3dd72277d929?q=80&w=2671&auto=format&fit=crop", // Aston DBX
                    "https://images.unsplash.com/photo-1600712242805-5f78671d24da?q=80&w=2574&auto=format&fit=crop", // Detail
                    "https://images.unsplash.com/photo-1618486026034-399fa37265be?q=80&w=2574&auto=format&fit=crop", // Interior
                ],
                features: ["dbx707 Wheels", "Sports Exhaust", "Panoramic Roof", "Camera System", "Ventilated Seats"],
                description: "Beauty and beast. The DBX brings Aston Martin soul to the SUV segment. Lightning Silver with Oxford Tan leather.",
                engineSize: "4.0L",
                bodyType: "SUV"
            }
        ]);

        console.log("✅ Sample vehicles created");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await client.end();
    }
}

main();
