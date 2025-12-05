"use client";

import CustomerForm from "@/components/customers/customer-form";

export default function NewCustomerPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Add Customer</h2>
            </div>
            <CustomerForm />
        </div>
    );
}
