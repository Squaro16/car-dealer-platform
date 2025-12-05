"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";

export function FilterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [make, setMake] = useState(searchParams.get("make") || "all");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (search) params.set("search", search);
        else params.delete("search");

        if (make && make !== "all") params.set("make", make);
        else params.delete("make");

        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        startTransition(() => {
            router.push(`/inventory?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        setSearch("");
        setMake("all");
        setMinPrice("");
        setMaxPrice("");
        startTransition(() => {
            router.push("/inventory");
        });
    };

    return (
        <div className="space-y-4 mb-8 bg-slate-50 p-4 rounded-lg border">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search make, model, or stock #..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select value={make} onValueChange={setMake}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="All Makes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Makes</SelectItem>
                            <SelectItem value="Toyota">Toyota</SelectItem>
                            <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                            <SelectItem value="BMW">BMW</SelectItem>
                            <SelectItem value="Honda">Honda</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        type="number"
                        placeholder="Min Price"
                        className="w-full md:w-32 bg-white"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Max Price"
                        className="w-full md:w-32 bg-white"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSearch} disabled={isPending}>
                        {isPending ? "Searching..." : "Search"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={clearFilters} title="Clear Filters">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
