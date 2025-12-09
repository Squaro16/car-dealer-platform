import { db } from "./index";
import { makes } from "./schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Comprehensive list of major car manufacturers
// Ordered by popularity/market presence for better UX
export const carMakesData = [
  // Luxury European Brands
  { name: "Mercedes-Benz", country: "Germany", foundedYear: 1926, website: "https://www.mercedes-benz.com" },
  { name: "BMW", country: "Germany", foundedYear: 1916, website: "https://www.bmw.com" },
  { name: "Audi", country: "Germany", foundedYear: 1909, website: "https://www.audi.com" },
  { name: "Porsche", country: "Germany", foundedYear: 1931, website: "https://www.porsche.com" },
  { name: "Bentley", country: "United Kingdom", foundedYear: 1919, website: "https://www.bentley.com" },
  { name: "Rolls-Royce", country: "United Kingdom", foundedYear: 1904, website: "https://www.rolls-roycemotorcars.com" },
  { name: "Aston Martin", country: "United Kingdom", foundedYear: 1913, website: "https://www.astonmartin.com" },
  { name: "Jaguar", country: "United Kingdom", foundedYear: 1922, website: "https://www.jaguar.com" },
  { name: "Land Rover", country: "United Kingdom", foundedYear: 1948, website: "https://www.landrover.com" },
  { name: "Ferrari", country: "Italy", foundedYear: 1947, website: "https://www.ferrari.com" },
  { name: "Lamborghini", country: "Italy", foundedYear: 1963, website: "https://www.lamborghini.com" },
  { name: "Maserati", country: "Italy", foundedYear: 1914, website: "https://www.maserati.com" },
  { name: "Bugatti", country: "France", foundedYear: 1909, website: "https://www.bugatti.com" },
  { name: "Alpine", country: "France", foundedYear: 1955, website: "https://www.alpinecars.com" },
  { name: "DS Automobiles", country: "France", foundedYear: 2014, website: "https://www.dsautomobiles.com" },

  // Mainstream European Brands
  { name: "Volkswagen", country: "Germany", foundedYear: 1937, website: "https://www.volkswagen.com" },
  { name: "Ford", country: "United States", foundedYear: 1903, website: "https://www.ford.com" },
  { name: "Opel", country: "Germany", foundedYear: 1862, website: "https://www.opel.com" },
  { name: "Peugeot", country: "France", foundedYear: 1889, website: "https://www.peugeot.com" },
  { name: "Citroën", country: "France", foundedYear: 1919, website: "https://www.citroen.com" },
  { name: "Renault", country: "France", foundedYear: 1899, website: "https://www.renault.com" },
  { name: "Dacia", country: "Romania", foundedYear: 1966, website: "https://www.dacia.com" },
  { name: "Seat", country: "Spain", foundedYear: 1950, website: "https://www.seat.com" },
  { name: "Skoda", country: "Czech Republic", foundedYear: 1895, website: "https://www.skoda.com" },
  { name: "Volvo", country: "Sweden", foundedYear: 1927, website: "https://www.volvo.com" },
  { name: "Saab", country: "Sweden", foundedYear: 1945, website: "https://www.saab.com" },
  { name: "Fiat", country: "Italy", foundedYear: 1899, website: "https://www.fiat.com" },
  { name: "Alfa Romeo", country: "Italy", foundedYear: 1910, website: "https://www.alfaromeo.com" },
  { name: "Lancia", country: "Italy", foundedYear: 1906, website: "https://www.lancia.com" },

  // Asian Brands
  { name: "Toyota", country: "Japan", foundedYear: 1937, website: "https://www.toyota.com" },
  { name: "Honda", country: "Japan", foundedYear: 1948, website: "https://www.honda.com" },
  { name: "Nissan", country: "Japan", foundedYear: 1933, website: "https://www.nissan.com" },
  { name: "Mitsubishi", country: "Japan", foundedYear: 1870, website: "https://www.mitsubishi-motors.com" },
  { name: "Mazda", country: "Japan", foundedYear: 1920, website: "https://www.mazda.com" },
  { name: "Subaru", country: "Japan", foundedYear: 1953, website: "https://www.subaru.com" },
  { name: "Suzuki", country: "Japan", foundedYear: 1909, website: "https://www.suzuki.com" },
  { name: "Lexus", country: "Japan", foundedYear: 1989, website: "https://www.lexus.com" },
  { name: "Infiniti", country: "Japan", foundedYear: 1989, website: "https://www.infiniti.com" },
  { name: "Acura", country: "Japan", foundedYear: 1986, website: "https://www.acura.com" },
  { name: "Hyundai", country: "South Korea", foundedYear: 1967, website: "https://www.hyundai.com" },
  { name: "Kia", country: "South Korea", foundedYear: 1944, website: "https://www.kia.com" },
  { name: "Genesis", country: "South Korea", foundedYear: 2015, website: "https://www.genesis.com" },
  { name: "SsangYong", country: "South Korea", foundedYear: 1954, website: "https://www.smotor.com" },
  { name: "Geely", country: "China", foundedYear: 1986, website: "https://www.geely.com" },
  { name: "BYD", country: "China", foundedYear: 1995, website: "https://www.byd.com" },
  { name: "NIO", country: "China", foundedYear: 2014, website: "https://www.nio.com" },
  { name: "Li Auto", country: "China", foundedYear: 2015, website: "https://www.lixiang.com" },
  { name: "XPeng", country: "China", foundedYear: 2014, website: "https://www.xpeng.com" },

  // American Brands
  { name: "Chevrolet", country: "United States", foundedYear: 1911, website: "https://www.chevrolet.com" },
  { name: "GMC", country: "United States", foundedYear: 1908, website: "https://www.gmc.com" },
  { name: "Cadillac", country: "United States", foundedYear: 1902, website: "https://www.cadillac.com" },
  { name: "Buick", country: "United States", foundedYear: 1899, website: "https://www.buick.com" },
  { name: "Lincoln", country: "United States", foundedYear: 1917, website: "https://www.lincoln.com" },
  { name: "Chrysler", country: "United States", foundedYear: 1925, website: "https://www.chrysler.com" },
  { name: "Dodge", country: "United States", foundedYear: 1900, website: "https://www.dodge.com" },
  { name: "Jeep", country: "United States", foundedYear: 1941, website: "https://www.jeep.com" },
  { name: "Ram", country: "United States", foundedYear: 2010, website: "https://www.ram.com" },
  { name: "Tesla", country: "United States", foundedYear: 2003, website: "https://www.tesla.com" },
  { name: "Rivian", country: "United States", foundedYear: 2009, website: "https://www.rivian.com" },
  { name: "Lucid Motors", country: "United States", foundedYear: 2007, website: "https://www.lucidmotors.com" },
  { name: "Fisker", country: "United States", foundedYear: 2016, website: "https://www.fiskerinc.com" },

  // Other Notable Brands
  { name: "McLaren", country: "United Kingdom", foundedYear: 1980, website: "https://www.mclaren.com" },
  { name: "Lotus", country: "United Kingdom", foundedYear: 1952, website: "https://www.lotuscars.com" },
  { name: "Morgan", country: "United Kingdom", foundedYear: 1909, website: "https://www.morgan-motor.co.uk" },
  { name: "Caterham", country: "United Kingdom", foundedYear: 1957, website: "https://www.caterhamcars.com" },
  { name: "Koenigsegg", country: "Sweden", foundedYear: 1994, website: "https://www.koenigsegg.com" },
  { name: "Pagani", country: "Italy", foundedYear: 1992, website: "https://www.pagani.com" },
  { name: "Maybach", country: "Germany", foundedYear: 1909, website: "https://www.maybach.com" },
];

export async function seedMakes() {
  console.log("🌱 Seeding car makes...");

  try {
    // Insert all makes with display order based on array position
    const makesWithOrder = carMakesData.map((make, index) => ({
      ...make,
      displayOrder: index,
      isActive: true,
    }));

    await db.insert(makes).values(makesWithOrder);

    console.log(`✅ Successfully seeded ${carMakesData.length} car manufacturers`);
  } catch (error) {
    console.error("❌ Error seeding car makes:", error);
    throw error;
  }
}

export async function getMakeByName(name: string) {
  const result = await db
    .select()
    .from(makes)
    .where(eq(makes.name, name))
    .limit(1);

  return result[0] || null;
}

export async function getActiveMakes() {
  return await db
    .select()
    .from(makes)
    .where(eq(makes.isActive, true))
    .orderBy(makes.displayOrder);
}

// Run if executed directly
if (require.main === module) {
  seedMakes()
    .then(() => {
      console.log("🎉 Makes seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Makes seeding failed:", error);
      process.exit(1);
    });
}
