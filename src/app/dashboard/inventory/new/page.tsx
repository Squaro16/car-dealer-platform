// Dashboard page for creating a new vehicle using the enhanced form.
"use client";

import EnhancedVehicleForm from "@/components/inventory/enhanced-vehicle-form";
import { FormErrorBoundary } from "@/components/error-boundary";

export default function NewVehiclePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Add Vehicle</h2>
            </div>
            <FormErrorBoundary>
                <EnhancedVehicleForm />
            </FormErrorBoundary>
        </div>
    );
}
