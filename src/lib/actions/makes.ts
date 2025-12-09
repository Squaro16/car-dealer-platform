"use server";

import { db } from "@/lib/db";
import { makes } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { getUserProfile } from "@/lib/auth/utils";

export async function getMakes() {
  try {
    const result = await db
      .select({
        id: makes.id,
        name: makes.name,
        country: makes.country,
        logoUrl: makes.logoUrl,
        foundedYear: makes.foundedYear,
        website: makes.website,
        isActive: makes.isActive,
        displayOrder: makes.displayOrder,
      })
      .from(makes)
      .where(eq(makes.isActive, true))
      .orderBy(asc(makes.displayOrder));

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching makes:", error);
    return {
      success: false,
      error: "Failed to load car manufacturers",
      data: [],
    };
  }
}

export async function getMakeById(id: string) {
  try {
    const result = await db
      .select()
      .from(makes)
      .where(eq(makes.id, id))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Manufacturer not found" };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error fetching make:", error);
    return {
      success: false,
      error: "Failed to load manufacturer details",
    };
  }
}

export async function getMakesForSelect() {
  try {
    const result = await db
      .select({
        value: makes.id,
        label: makes.name,
        country: makes.country,
      })
      .from(makes)
      .where(eq(makes.isActive, true))
      .orderBy(asc(makes.displayOrder));

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching makes for select:", error);
    return {
      success: false,
      error: "Failed to load manufacturers",
      data: [],
    };
  }
}
