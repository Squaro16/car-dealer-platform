import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DealerProfileForm } from "@/components/settings/dealer-profile-form";
import { UserManagement } from "@/components/settings/user-management";
import { getUserProfile } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { dealers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUsers } from "@/lib/actions/settings";

export default async function SettingsPage() {
    const user = await getUserProfile();

    // Fetch dealer info
    const dealer = await db.query.dealers.findFirst({
        where: eq(dealers.id, user.dealerId),
    });

    if (!dealer) return null;

    // Fetch users (only if admin)
    const dealerUsers = user.role === "admin" ? await getUsers() : [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dealer Profile</CardTitle>
                        <CardDescription>Manage your dealership&apos;s public information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DealerProfileForm
                            initialData={{
                                name: dealer.name,
                                email: dealer.contactEmail || "",
                                phone: dealer.contactPhone || "",
                                address: dealer.address || "",
                            }}
                        />
                    </CardContent>
                </Card>

                {user.role === "admin" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage user access and roles.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserManagement users={dealerUsers} currentUserId={user.id} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
