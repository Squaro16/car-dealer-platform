"use server";

import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { eq, desc, and, count, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserProfile, checkRole } from "@/lib/auth/utils";
import { customerSchema } from "@/lib/validations/customer";

export type GetCustomersOptions = {
    search?: string;
    page?: number;
    limit?: number;
};

export async function getCustomers(options: GetCustomersOptions = {}) {
    const user = await getUserProfile();

    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [
        eq(customers.dealerId, user.dealerId)
    ];

    if (options.search) {
        const searchLower = `%${options.search.toLowerCase()}%`;
        conditions.push(
            or(
                ilike(customers.name, searchLower),
                ilike(customers.email, searchLower),
                ilike(customers.phone, searchLower)
            )!
        );
    }

    const whereClause = and(...conditions);

    const [countResult] = await db
        .select({ count: count() })
        .from(customers)
        .where(whereClause);

    const totalCount = countResult?.count ?? 0;
    const totalPages = Math.ceil(totalCount / limit);

    const data = await db
        .select()
        .from(customers)
        .where(whereClause)
        .orderBy(desc(customers.createdAt))
        .limit(limit)
        .offset(offset);

    return {
        data,
        metadata: {
            totalCount,
            totalPages,
            currentPage: page,
            limit
        }
    };
}

export async function getCustomer(id: string) {
    const user = await getUserProfile();

    const customer = await db.query.customers.findFirst({
        where: and(
            eq(customers.id, id),
            eq(customers.dealerId, user.dealerId)
        )
    });

    return customer;
}

export async function createCustomer(formData: FormData) {
    const user = await checkRole(["admin", "sales"]);

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        idNumber: formData.get("idNumber"),
        notes: formData.get("notes"),
    };

    const validatedData = customerSchema.parse(rawData);

    await db.insert(customers).values({
        ...validatedData,
        dealerId: user.dealerId,
    });

    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
}

export async function updateCustomer(id: string, formData: FormData) {
    const user = await checkRole(["admin", "sales"]);

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        idNumber: formData.get("idNumber"),
        notes: formData.get("notes"),
    };

    const validatedData = customerSchema.parse(rawData);

    await db.update(customers)
        .set(validatedData)
        .where(and(
            eq(customers.id, id),
            eq(customers.dealerId, user.dealerId)
        ));

    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${id}`);
    redirect("/dashboard/customers");
}
