"use server";

import { db } from "@/lib/db";
import { expenses } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserProfile, checkRole } from "@/lib/auth/utils";
import { expenseSchema } from "@/lib/validations/expense";

export async function createExpense(formData: FormData) {
    const user = await checkRole(["admin", "sales"]);

    const vehicleId = formData.get("vehicleId");

    const rawData = {
        vehicleId: typeof vehicleId === "string" && vehicleId.length > 0 ? vehicleId : undefined,
        amount: formData.get("amount"),
        category: formData.get("category"),
        description: formData.get("description"),
        date: formData.get("date"),
    };

    const validatedData = expenseSchema.parse(rawData);

    await db.insert(expenses).values({
        dealerId: user.dealerId,
        vehicleId: validatedData.vehicleId || null,
        amount: validatedData.amount,
        category: validatedData.category,
        description: validatedData.description,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
    });

    if (validatedData.vehicleId) {
        revalidatePath(`/dashboard/inventory/${validatedData.vehicleId}`);
    }
    revalidatePath("/dashboard/inventory");
}

export async function getExpenses(vehicleId?: string) {
    const user = await getUserProfile();

    const whereClause = vehicleId
        ? and(eq(expenses.vehicleId, vehicleId), eq(expenses.dealerId, user.dealerId))
        : eq(expenses.dealerId, user.dealerId);

    const data = await db.query.expenses.findMany({
        where: whereClause,
        orderBy: desc(expenses.date),
    });

    return data;
}
