"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDealerProfile } from "@/lib/actions/settings";
import { useState } from "react";
import { toast } from "sonner";

interface DealerProfileFormProps {
    initialData: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
}

export function DealerProfileForm({ initialData }: DealerProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
        };

        try {
            await updateDealerProfile(data);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Dealership Name</Label>
                <Input id="name" name="name" defaultValue={initialData.name} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" name="email" type="email" defaultValue={initialData.email} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={initialData.phone} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" defaultValue={initialData.address} required />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
