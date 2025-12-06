import { Navbar } from "@/components/layout/navbar";
import { getUniqueModels } from "@/lib/actions/vehicles";
import { SpecsList, Vehicle } from "@/components/specs/specs-list";

export default async function SpecsPage() {
    const models = await getUniqueModels();

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
            <Navbar />
            <div className="flex-1 container pt-32 pb-20 px-4 md:px-6">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white tracking-tight">
                        Technical <span className="text-primary">Specifications</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                        Detailed performance data, dimensions, and technical specifications for our exclusive collection.
                        Download official brochures and compare model variants.
                    </p>
                </div>

                <SpecsList models={models as unknown as Vehicle[]} />
            </div>
        </div>
    );
}
