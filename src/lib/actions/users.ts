"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function inviteUser(formData: FormData) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
        throw new Error("Unauthorized");
    }

    // Check if current user is admin (optional, for now we allow any logged in user to invite)
    // In real app, check users table for role='admin'

    const email = formData.get("email") as string;
    const role = formData.get("role") as "admin" | "sales" | "service" | "viewer";
    const name = formData.get("name") as string;

    const adminClient = createAdminClient();

    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email);

    if (error) {
        console.error("Error inviting user:", error);
        throw new Error(error.message);
    }

    // Create user record in our DB
    if (data.user) {
        await db.insert(users).values({
            id: data.user.id,
            email: data.user.email!,
            name: name,
            role: role,
            dealerId: "d290f1ee-6c54-4b01-90e6-d701748f0851", // TODO: Get from context
            isActive: true,
        });
    }

    revalidatePath("/dashboard/users");
}
