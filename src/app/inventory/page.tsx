import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVehicles } from "@/lib/actions/vehicles";
import Link from "next/link";
import { FilterForm } from "@/components/inventory/filter-form";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { CarFinderModal } from "@/components/inventory/car-finder-modal";

export default async function PublicInventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Parse search params
    const params = await searchParams;
    const search = typeof params.search === "string" ? params.search : undefined;
    const make = typeof params.make === "string" ? params.make : undefined;
    const minPrice = typeof params.minPrice === "string" ? parseInt(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === "string" ? parseInt(params.maxPrice) : undefined;
    const page = typeof params.page === "string" ? parseInt(params.page) : 1;

    const { data: vehicles, metadata } = await getVehicles({
        search,
        make,
        minPrice,
        maxPrice,
        status: "in_stock", // Only show in-stock cars publicly
        page,
        limit: 12,
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {vehicles.map((car) => (
                        <Card key={car.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                            <div className="aspect-[16/10] bg-slate-100 relative">
                                {car.images && Array.isArray(car.images) && car.images.length > 0 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={car.images[0] as string}
                                        alt={`${car.year} ${car.make} ${car.model}`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-slate-200">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                                        {car.condition}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="line-clamp-1 text-lg">
                                            {car.year} {car.make} {car.model}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">{car.variant}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-4">
                                    <div>{Number(car.mileage).toLocaleString()} km</div>
                                    <div className="text-right capitalize">{car.transmission}</div>
                                    <div className="capitalize">{car.fuelType}</div>
                                    <div className="text-right">{car.engineSize || "N/A"}</div>
                                </div>
                                <div className="text-xl font-bold text-primary">
                                    ${Number(car.price).toLocaleString()}
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Link href={`/inventory/${car.id}`} className="w-full">
                                    <Button className="w-full">View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <PaginationControls
                    currentPage={metadata.currentPage}
                    totalPages={metadata.totalPages}
                    hasNextPage={metadata.currentPage < metadata.totalPages}
                    hasPrevPage={metadata.currentPage > 1}
                />
            </div>
            <CarFinderModal />
        </div>
    );
}
