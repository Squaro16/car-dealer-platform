// import { Navbar } from "@/components/layout/navbar";
import { getPublicVehicles } from "@/lib/actions/vehicles";
import { FilterForm } from "@/components/inventory/filter-form";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { VehicleGrid } from "@/components/inventory/vehicle-grid";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function PublicInventoryPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    // Parse search params
    const params = await searchParams;
    const search = typeof params.search === "string" ? params.search : undefined;
    const make = typeof params.make === "string" ? params.make : undefined;
    const bodyType = typeof params.bodyType === "string" ? params.bodyType : undefined;
    const sort = typeof params.sort === "string" ? params.sort : undefined;

    // Parse numeric params
    const minPrice = typeof params.minPrice === "string" ? parseInt(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === "string" ? parseInt(params.maxPrice) : undefined;
    const minYear = typeof params.minYear === "string" ? parseInt(params.minYear) : undefined;
    const maxYear = typeof params.maxYear === "string" ? parseInt(params.maxYear) : undefined;
    const minMileage = typeof params.minMileage === "string" ? parseInt(params.minMileage) : undefined;
    const maxMileage = typeof params.maxMileage === "string" ? parseInt(params.maxMileage) : undefined;

    const page = typeof params.page === "string" ? parseInt(params.page) : 1;


    const { data: vehicles, metadata } = await getPublicVehicles({
        search,
        make,
        bodyType,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        minMileage,
        maxMileage,
        sort,
        status: "in_stock",
        page,
        limit: 12,
    });

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar handled in global layout */}

            <div className="container py-12 px-4 md:px-6">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                        <p className="text-muted-foreground">
                            Showing {vehicles.length} of {metadata.totalCount} vehicles available
                        </p>
                    </div>

                    <FilterForm />
                </div>

                <VehicleGrid vehicles={vehicles} />

                <PaginationControls
                    currentPage={metadata.currentPage}
                    totalPages={metadata.totalPages}
                    hasNextPage={metadata.currentPage < metadata.totalPages}
                    hasPrevPage={metadata.currentPage > 1}
                />
            </div>
        </div>
    );
}
