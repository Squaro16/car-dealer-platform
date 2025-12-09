import { Skeleton } from "@/components/ui/skeleton";

export function VehicleGridSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
    if (viewMode === "list") {
        return (
            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-sm overflow-hidden border border-white/5 flex flex-col md:flex-row min-h-[220px]">
                        <div className="w-full md:w-80 lg:w-96 h-48 md:h-full bg-neutral-900 relative">
                            <Skeleton className="w-full h-full" />
                        </div>
                        <div className="p-6 flex-1 space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-sm overflow-hidden border border-white/5 flex flex-col h-full">
                    <div className="aspect-[4/3] relative bg-neutral-900">
                        <Skeleton className="w-full h-full" />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
