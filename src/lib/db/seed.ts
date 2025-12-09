// Seed script for local development: creates dealer, admin user, and sample data.

import { dealers, users, vehicles, sales, leads, expenses, sourcingRequests, customers, makes } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SHOULD_PURGE = process.env.SEED_PURGE !== "false";

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { db, client } = await import("./index");

    console.log("🌱 Seeding database...");

    try {
        // 0. Cleanup (skippable with SEED_PURGE=false)
        if (SHOULD_PURGE) {
            console.log("🧹 Clearing existing data...");
            await db.delete(sales);
            await db.delete(leads);
            await db.delete(expenses);
            await db.delete(sourcingRequests);
            await db.delete(customers);
            await db.delete(vehicles);
            await db.delete(makes);
            await db.delete(users);
            await db.delete(dealers);
        } else {
            console.log("⚠️  Skipping purge (SEED_PURGE=false). Existing data will remain.");
        }

        // 1. Create Dealer
        const [dealer] = await db.insert(dealers).values({
            name: "LS Motor",
            slug: "ls-motor",
            contactEmail: "lsmotor3838@gmail.com",
            settings: { currency: "SGD", country: "SG" },
        }).returning();

        console.log("✅ Dealer created:", dealer.name);

        // 2. Create Admin User (Note: In real app, this ID comes from Supabase Auth)
        // For seeding, we'll generate a random UUID, but you should update this 
        // to match your actual Supabase User ID if you want to log in.
        const [admin] = await db.insert(users).values({
            id: "00000000-0000-0000-0000-000000000000", // REPLACE WITH REAL SUPABASE USER ID
            dealerId: dealer.id,
            email: "admin@lsmotor.com",
            name: "Admin User",
            role: "admin",
        }).returning();

        console.log("✅ Admin user created");

        // 3. Seed Makes (minimal set used below)
        const seededMakes = await db.insert(makes).values([
            { name: "Lamborghini", country: "Italy" },
            { name: "Porsche", country: "Germany" },
            { name: "Toyota", country: "Japan" },
            { name: "Mercedes-Benz", country: "Germany" },
            { name: "Ferrari", country: "Italy" },
            { name: "Rolls Royce", country: "United Kingdom" },
            { name: "McLaren", country: "United Kingdom" },
            { name: "Bentley", country: "United Kingdom" },
            { name: "BMW", country: "Germany" },
            { name: "Land Rover", country: "United Kingdom" },
            { name: "Aston Martin", country: "United Kingdom" },
            { name: "Audi", country: "Germany" },
            { name: "Volkswagen", country: "Germany" },
            { name: "Volvo", country: "Sweden" },
            { name: "Tesla", country: "United States" },
            { name: "Lucid", country: "United States" },
            { name: "Ford", country: "United States" },
            { name: "Chevrolet", country: "United States" },
            { name: "Kia", country: "South Korea" },
            { name: "Hyundai", country: "South Korea" },
            { name: "Subaru", country: "Japan" },
            { name: "Mazda", country: "Japan" },
            { name: "Nissan", country: "Japan" },
            { name: "Honda", country: "Japan" },
            { name: "Jeep", country: "United States" },
            { name: "Cadillac", country: "United States" },
        ]).returning();

        const makeIdByName = new Map<string, string>(
            seededMakes.map((m) => [m.name, m.id])
        );

        function getMakeId(name: string) {
            const id = makeIdByName.get(name);
            if (!id) {
                throw new Error(`Missing makeId for ${name}`);
            }
            return id;
        }

        // 4. Create Sample Vehicles
        const vehicleSeeds = [
            // 1. Research: Lamborghini Aventador (Utama Motors)
            {
                dealerId: dealer.id,
                makeName: "Lamborghini",
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
                makeName: "Porsche",
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
                makeName: "Toyota",
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
                makeName: "Mercedes-Benz",
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
                makeName: "Ferrari",
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
                makeName: "Rolls Royce",
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
            makeName: "McLaren",
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
            makeName: "Bentley",
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
            makeName: "Land Rover",
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
            makeName: "BMW",
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
            makeName: "Mercedes-Benz",
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
            makeName: "Aston Martin",
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
        },
        // 13. Tesla Model Y Performance
        {
            dealerId: dealer.id,
            makeName: "Tesla",
            model: "Model Y",
            year: 2024,
            variant: "Performance",
            price: "89000",
            mileage: 1500,
            status: "in_stock",
            condition: "new",
            fuelType: "electric",
            transmission: "automatic",
            color: "White",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1619767886558-efdc259cde1b?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Dual Motor AWD", "Acceleration Boost", "Autopilot", "Premium Interior"],
            description: "Quick, quiet, and spacious EV crossover with blistering 0-100 in 3.7s.",
            engineSize: "Electric",
            bodyType: "SUV"
        },
        // 14. Audi Q8 e-tron
        {
            dealerId: dealer.id,
            makeName: "Audi",
            model: "Q8 e-tron",
            year: 2024,
            variant: "55 quattro",
            price: "168000",
            mileage: 3200,
            status: "in_stock",
            condition: "new",
            fuelType: "electric",
            transmission: "automatic",
            color: "Black",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Adaptive Air Suspension", "Matrix LED", "Bang & Olufsen", "360 Camera"],
            description: "Flagship electric SUV with quattro confidence and premium comfort.",
            engineSize: "Electric",
            bodyType: "SUV"
        },
        // 15. Ford F-150 Lightning
        {
            dealerId: dealer.id,
            makeName: "Ford",
            model: "F-150",
            year: 2023,
            variant: "Lightning Lariat",
            price: "118000",
            mileage: 5200,
            status: "in_stock",
            condition: "used",
            fuelType: "electric",
            transmission: "automatic",
            color: "Grey",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Extended Range Battery", "BlueCruise", "Pro Power Onboard", "Tow Tech"],
            description: "All-electric pickup with serious utility and silent torque.",
            engineSize: "Electric",
            bodyType: "Truck"
        },
        // 16. Kia EV6 GT
        {
            dealerId: dealer.id,
            makeName: "Kia",
            model: "EV6",
            year: 2023,
            variant: "GT",
            price: "89000",
            mileage: 4800,
            status: "in_stock",
            condition: "used",
            fuelType: "electric",
            transmission: "automatic",
            color: "Green",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Dual Motor AWD", "Drift Mode", "Augmented Reality HUD", "Meridian Audio"],
            description: "Hot hatch energy in an EV crossover silhouette with supercar sprints.",
            engineSize: "Electric",
            bodyType: "Crossover"
        },
        // 17. Hyundai Ioniq 5
        {
            dealerId: dealer.id,
            makeName: "Hyundai",
            model: "Ioniq 5",
            year: 2023,
            variant: "Ultimate AWD",
            price: "76000",
            mileage: 6200,
            status: "in_stock",
            condition: "used",
            fuelType: "electric",
            transmission: "automatic",
            color: "Silver",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["800V Charging", "Vehicle-to-Load", "Relaxation Seats", "SmartSense"],
            description: "Retro-modern EV with ultra-fast charging and lounge-like cabin.",
            engineSize: "Electric",
            bodyType: "Crossover"
        },
        // 18. Honda Civic Type R
        {
            dealerId: dealer.id,
            makeName: "Honda",
            model: "Civic",
            year: 2024,
            variant: "Type R",
            price: "72000",
            mileage: 1200,
            status: "in_stock",
            condition: "new",
            fuelType: "petrol",
            transmission: "manual",
            color: "Red",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Rev-Match", "Brembo Brakes", "Adaptive Dampers", "Bucket Seats"],
            description: "Track-bred hot hatch with six-speed purity and daily usability.",
            engineSize: "2.0L",
            bodyType: "Hatchback"
        },
        // 19. Nissan GT-R
        {
            dealerId: dealer.id,
            makeName: "Nissan",
            model: "GT-R",
            year: 2021,
            variant: "Premium",
            price: "298000",
            mileage: 14000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "dct",
            color: "Grey",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["ATTESA E-TS AWD", "Launch Control", "Recaro Seats", "Bose Audio"],
            description: "Godzilla performance with relentless grip and twin-turbo punch.",
            engineSize: "3.8L",
            bodyType: "Coupe"
        },
        // 20. Mazda CX-5
        {
            dealerId: dealer.id,
            makeName: "Mazda",
            model: "CX-5",
            year: 2022,
            variant: "Signature",
            price: "54000",
            mileage: 18000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "automatic",
            color: "Blue",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Nappa Leather", "HUD", "Adaptive Cruise", "360 Camera"],
            description: "Refined crossover with premium feel and engaging dynamics.",
            engineSize: "2.5L",
            bodyType: "SUV"
        },
        // 21. Subaru Forester
        {
            dealerId: dealer.id,
            makeName: "Subaru",
            model: "Forester",
            year: 2022,
            variant: "2.0i-S EyeSight",
            price: "52000",
            mileage: 22000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "cvt",
            color: "Green",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Symmetrical AWD", "X-Mode", "EyeSight", "Panoramic Roof"],
            description: "All-weather SUV with safety tech and practical space.",
            engineSize: "2.0L",
            bodyType: "SUV"
        },
        // 22. Volkswagen Golf GTI
        {
            dealerId: dealer.id,
            makeName: "Volkswagen",
            model: "Golf",
            year: 2023,
            variant: "GTI",
            price: "61000",
            mileage: 9000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "manual",
            color: "White",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["VAQ LSD", "IQ.Light", "Digital Cockpit", "Driving Mode Select"],
            description: "Iconic hot hatch balancing fun, efficiency, and practicality.",
            engineSize: "2.0L",
            bodyType: "Hatchback"
        },
        // 23. Volvo XC90 Recharge
        {
            dealerId: dealer.id,
            makeName: "Volvo",
            model: "XC90",
            year: 2023,
            variant: "Recharge T8",
            price: "168000",
            mileage: 7000,
            status: "in_stock",
            condition: "used",
            fuelType: "plug_in_hybrid",
            transmission: "automatic",
            color: "Grey",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Air Suspension", "Pilot Assist", "Bowers & Wilkins", "7 Seats"],
            description: "Luxury 7-seater PHEV with serene ride and strong efficiency.",
            engineSize: "2.0L",
            bodyType: "SUV"
        },
        // 24. Chevrolet Corvette Stingray
        {
            dealerId: dealer.id,
            makeName: "Chevrolet",
            model: "Corvette",
            year: 2022,
            variant: "C8 3LT",
            price: "198000",
            mileage: 8500,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "dct",
            color: "Red",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Z51 Package", "Magnetic Ride", "Performance Exhaust", "Front Lift"],
            description: "Mid-engine American icon with exotic looks and everyday manners.",
            engineSize: "6.2L",
            bodyType: "Coupe"
        },
        // 25. Jeep Wrangler Rubicon
        {
            dealerId: dealer.id,
            makeName: "Jeep",
            model: "Wrangler",
            year: 2021,
            variant: "Rubicon 4-door",
            price: "115000",
            mileage: 26000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "automatic",
            color: "Orange",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["Rock-Trac 4x4", "Front/Rear Lockers", "Fox Shocks", "Steel Bumpers"],
            description: "Trail-ready legend built for rock crawling and open-air adventure.",
            engineSize: "3.6L",
            bodyType: "SUV"
        },
        // 26. Cadillac Escalade
        {
            dealerId: dealer.id,
            makeName: "Cadillac",
            model: "Escalade",
            year: 2022,
            variant: "Sport Platinum",
            price: "225000",
            mileage: 15000,
            status: "in_stock",
            condition: "used",
            fuelType: "petrol",
            transmission: "automatic",
            color: "Black",
            createdById: admin.id,
            images: [
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2670&auto=format&fit=crop",
            ],
            features: ["AKG Studio Reference", "Super Cruise", "Air Ride", "OLED Dash"],
            description: "Full-size luxury SUV with tech-laden cabin and commanding presence.",
            engineSize: "6.2L",
            bodyType: "SUV"
        }
        ] satisfies Array<{
            dealerId: string;
            makeName: string;
            model: string;
            year: number;
            variant?: string;
            price: string;
            mileage: number;
            status: "in_stock" | "reserved" | "sold" | "hidden";
            condition: "new" | "used" | "reconditioned";
            fuelType: "petrol" | "diesel" | "hybrid" | "electric" | "plug_in_hybrid";
            transmission: "automatic" | "manual" | "cvt" | "dct";
            color?: string;
            createdById?: string;
            images: string[];
            features?: string[];
            description?: string;
            engineSize?: string;
            bodyType?: string;
        }>;

        await db.insert(vehicles).values(
            vehicleSeeds.map(({ makeName, ...rest }) => ({
                ...rest,
                makeId: getMakeId(makeName),
            }))
        );

        console.log("✅ Sample vehicles created");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await client.end();
    }
}

main();
