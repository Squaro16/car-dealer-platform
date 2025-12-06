import { Navbar } from "@/components/layout/navbar";
import { getPublicVehicles } from "@/lib/actions/vehicles";
import { ComparisonTool, Vehicle } from "@/components/compare/comparison-tool";

export default async function ComparePage() {
    const { data: vehicles } = await getPublicVehicles({ limit: 100 });

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
            <Navbar />
            <div className="flex-1 container pt-24 pb-12 md:pt-32 md:pb-20 px-4">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white tracking-tight">
                        Compare <span className="text-primary">Models</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                        Select up to 3 vehicles to compare specs, features, and pricing side-by-side.
                        Make an informed decision with our detailed comparison tool.
                    </p>
                </div>

                <ComparisonTool availableVehicles={vehicles as unknown as Vehicle[]} />
            </div>
        </div>
    );
}
