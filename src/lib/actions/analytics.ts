"use server";

import { db } from "@/lib/db";
import { sales, expenses, vehicles } from "@/lib/db/schema";
import { sql, eq, and, gte, lte } from "drizzle-orm";
import { getUserProfile } from "@/lib/auth/utils";

export async function getFinancialMetrics(startDate?: Date, endDate?: Date) {
    const user = await getUserProfile();

    // Default to last 6 months if no date range provided
    const end = endDate || new Date();
    const start = startDate || new Date(new Date().setMonth(end.getMonth() - 6));

    // 1. Revenue (Total Sales)
    const revenueResult = await db
        .select({
            totalRevenue: sql<number>`sum(${sales.salePrice})`,
        })
        .from(sales)
        .where(and(
            eq(sales.dealerId, user.dealerId),
            gte(sales.saleDate, start),
            lte(sales.saleDate, end)
        ));

    const totalRevenue = Number(revenueResult[0]?.totalRevenue || 0);

    // 2. Expenses (Total Expenses)
    const expensesResult = await db
        .select({
            totalExpenses: sql<number>`sum(${expenses.amount})`,
        })
        .from(expenses)
        .where(and(
            eq(expenses.dealerId, user.dealerId),
            gte(expenses.date, start),
            lte(expenses.date, end)
        ));

    const totalExpenses = Number(expensesResult[0]?.totalExpenses || 0);

    // 3. Cost of Goods Sold (COGS) - Sum of costPrice of sold vehicles
    // We need to join sales with vehicles to get costPrice
    const cogsResult = await db
        .select({
            totalCost: sql<number>`sum(${vehicles.costPrice})`,
        })
        .from(sales)
        .innerJoin(vehicles, eq(sales.vehicleId, vehicles.id))
        .where(and(
            eq(sales.dealerId, user.dealerId),
            gte(sales.saleDate, start),
            lte(sales.saleDate, end)
        ));

    const totalCOGS = Number(cogsResult[0]?.totalCost || 0);

    // 4. Net Profit
    const netProfit = totalRevenue - totalExpenses - totalCOGS;

    return {
        totalRevenue,
        totalExpenses,
        totalCOGS,
        netProfit,
        period: {
            start,
            end
        }
    };
}

export async function getRevenueOverTime() {
    const user = await getUserProfile();

    // Get data for the last 6 months, grouped by month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Include current month
    sixMonthsAgo.setDate(1); // Start of the month

    const revenueData = await db
        .select({
            month: sql<string>`to_char(${sales.saleDate}, 'Mon')`,
            revenue: sql<number>`sum(${sales.salePrice})`,
            date: sql<Date>`date_trunc('month', ${sales.saleDate})`,
        })
        .from(sales)
        .where(and(
            eq(sales.dealerId, user.dealerId),
            gte(sales.saleDate, sixMonthsAgo)
        ))
        .groupBy(sql`to_char(${sales.saleDate}, 'Mon')`, sql`date_trunc('month', ${sales.saleDate})`)
        .orderBy(sql`date_trunc('month', ${sales.saleDate})`);

    // Format for Recharts: [{ name: 'Jan', revenue: 1000 }, ...]
    return revenueData.map(item => ({
        name: item.month,
        revenue: Number(item.revenue)
    }));
}

export async function getInventoryTurnover() {
    const user = await getUserProfile();

    // Calculate average days to sell for sold vehicles
    const soldVehicles = await db
        .select({
            created: vehicles.createdAt,
            sold: sales.saleDate,
        })
        .from(sales)
        .innerJoin(vehicles, eq(sales.vehicleId, vehicles.id))
        .where(eq(sales.dealerId, user.dealerId));

    if (soldVehicles.length === 0) return 0;

    const totalDays = soldVehicles.reduce((acc, curr) => {
        const days = Math.floor((new Date(curr.sold).getTime() - new Date(curr.created).getTime()) / (1000 * 60 * 60 * 24));
        return acc + Math.max(0, days); // Ensure no negative days
    }, 0);

    return Math.round(totalDays / soldVehicles.length);
}
