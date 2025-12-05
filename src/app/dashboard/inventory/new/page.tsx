"use client";

import VehicleForm from "@/components/inventory/vehicle-form";

export default function NewVehiclePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Add Vehicle</h2>
            </div>
            <VehicleForm />
        </div>
    );
}
