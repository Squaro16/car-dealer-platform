"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export function PaginationControls({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
}: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-16 border-t border-white/5 pt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="bg-transparent border-white/10 text-white hover:bg-white/10 w-10 h-10"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-sm font-medium font-heading text-gray-400">
                Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="bg-transparent border-white/10 text-white hover:bg-white/10 w-10 h-10"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
