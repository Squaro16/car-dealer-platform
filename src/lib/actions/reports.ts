"use server";

import { db } from "@/lib/db";
import { sales, expenses, vehicles } from "@/lib/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { getUserProfile } from "@/lib/auth/utils";

export async function getSalesReport(startDate: Date, endDate: Date) {
    const user = await getUserProfile();

    const data = await db.query.sales.findMany({
        where: and(
            eq(sales.dealerId, user.dealerId),
            gte(sales.saleDate, startDate),
            lte(sales.saleDate, endDate)
        ),
        with: {
            customer: true,
            vehicle: true,
            seller: true,
        },
        orderBy: [desc(sales.saleDate)],
    });

    return data;
}

export async function getExpenseReport(startDate: Date, endDate: Date) {
    const user = await getUserProfile();

    const data = await db.query.expenses.findMany({
        where: and(
            eq(expenses.dealerId, user.dealerId),
            gte(expenses.date, startDate),
            lte(expenses.date, endDate)
        ),
        with: {
            vehicle: true,
        },
        orderBy: [desc(expenses.date)],
    });

    return data;
}

export async function getInventoryReport() {
    const user = await getUserProfile();

    const data = await db.query.vehicles.findMany({
        where: and(
            eq(vehicles.dealerId, user.dealerId),
            eq(vehicles.status, "in_stock")
        ),
        orderBy: [desc(vehicles.createdAt)],
    });

    return data;
}
