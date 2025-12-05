"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCustomer, updateCustomer } from "@/lib/actions/customers";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
    initialData?: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        idNumber: string | null;
        notes: string | null;
    };
}

export default function CustomerForm({ initialData }: CustomerFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            if (initialData) {
                await updateCustomer(initialData.id, formData);
                toast.success("Customer updated successfully");
            } else {
                await createCustomer(formData);
                toast.success("Customer created successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={onSubmit} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name (Required)</Label>
                    <Input id="name" name="name" defaultValue={initialData?.name} required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={initialData?.email || ""} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={initialData?.phone || ""} placeholder="+65 9123 4567" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number (NRIC/Passport)</Label>
                    <Input id="idNumber" name="idNumber" defaultValue={initialData?.idNumber || ""} placeholder="S1234567A" />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" defaultValue={initialData?.address || ""} placeholder="123 Main St, Singapore 123456" />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" defaultValue={initialData?.notes || ""} placeholder="Customer preferences, history, etc." />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Customer" : "Create Customer"}
                </Button>
            </div>
        </form>
    );
}
