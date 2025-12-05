import { getVehicle } from "@/lib/actions/vehicles";
import VehicleForm from "@/components/inventory/vehicle-form";
import { notFound } from "next/navigation";

interface EditVehiclePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
    const { id } = await params;
    const vehicle = await getVehicle(id);

    if (!vehicle) {
        notFound();
    }

    // Transform vehicle data to match form expectations
    // The form expects images as string[], but DB might return jsonb
    // We need to ensure types match
    const formattedVehicle = {
        ...vehicle,
        price: vehicle.price.toString(),
        mileage: vehicle.mileage ?? 0,
        images: Array.isArray(vehicle.images) ? vehicle.images as string[] : [],
        features: Array.isArray(vehicle.features) ? vehicle.features as string[] : [],
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Vehicle</h2>
            </div>
            <VehicleForm initialData={formattedVehicle} />
        </div>
    );
}
