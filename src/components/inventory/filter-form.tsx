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
import { Search, X, SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";

export function FilterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [make, setMake] = useState(searchParams.get("make") || "all");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [minYear, setMinYear] = useState(searchParams.get("minYear") || "");
    const [maxYear, setMaxYear] = useState(searchParams.get("maxYear") || "");
    const [minMileage, setMinMileage] = useState(searchParams.get("minMileage") || "");
    const [maxMileage, setMaxMileage] = useState(searchParams.get("maxMileage") || "");
    const [bodyType, setBodyType] = useState(searchParams.get("bodyType") || "all");
    const [sort, setSort] = useState(searchParams.get("sort") || "created_at_desc");

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (search) params.set("search", search);
        else params.delete("search");

        if (make && make !== "all") params.set("make", make);
        else params.delete("make");

        if (bodyType && bodyType !== "all") params.set("bodyType", bodyType);
        else params.delete("bodyType");

        if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
        if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
        if (minYear) params.set("minYear", minYear); else params.delete("minYear");
        if (maxYear) params.set("maxYear", maxYear); else params.delete("maxYear");
        if (minMileage) params.set("minMileage", minMileage); else params.delete("minMileage");
        if (maxMileage) params.set("maxMileage", maxMileage); else params.delete("maxMileage");

        if (sort && sort !== "created_at_desc") params.set("sort", sort);
        else params.delete("sort");

        startTransition(() => {
            router.push(`/inventory?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        setSearch("");
        setMake("all");
        setBodyType("all");
        setMinPrice("");
        setMaxPrice("");
        setMinYear("");
        setMaxYear("");
        setMinMileage("");
        setMaxMileage("");
        setSort("created_at_desc");
        startTransition(() => {
            router.push("/inventory");
        });
    };

    const hasActiveFilters = make !== "all" || bodyType !== "all" || minPrice || maxPrice || minYear || maxYear || minMileage || maxMileage;

    return (
        <div className="mb-12 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
            {/* Command Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-0 lg:h-16 h-auto">
                {/* Search - Left Side */}
                <div className="w-full lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-white/5 py-3 lg:py-0 px-4">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by make, model, or keywords..."
                        className="w-full bg-transparent border-none outline-none h-10 pl-10 text-white placeholder:text-gray-500 focus:ring-0 text-base md:text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                {/* Quick Actions - Right Side */}
                <div className="w-full lg:w-auto flex flex-wrap lg:flex-nowrap items-center">
                    {/* Make Select */}
                    <div className="w-1/2 lg:w-48 border-r border-white/5">
                        <Select value={make} onValueChange={setMake}>
                            <SelectTrigger className="w-full h-14 border-none bg-transparent hover:bg-white/5 rounded-none data-[state=open]:bg-white/5 focus:ring-0 text-white px-6">
                                <div className="flex flex-col items-start gap-0.5 pointer-events-none">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Make</span>
                                    <span className="text-sm font-medium truncate">{make === 'all' ? 'All Makes' : make}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/10 text-white overflow-hidden max-h-[300px]">
                                <SelectItem value="all">All Makes</SelectItem>
                                <SelectItem value="Toyota">Toyota</SelectItem>
                                <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                                <SelectItem value="BMW">BMW</SelectItem>
                                <SelectItem value="Honda">Honda</SelectItem>
                                <SelectItem value="Ferrari">Ferrari</SelectItem>
                                <SelectItem value="Lamborghini">Lamborghini</SelectItem>
                                <SelectItem value="Porsche">Porsche</SelectItem>
                                <SelectItem value="McLaren">McLaren</SelectItem>
                                <SelectItem value="Bugatti">Bugatti</SelectItem>
                                <SelectItem value="Rolls Royce">Rolls Royce</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Select */}
                    <div className="w-1/2 lg:w-48 border-r lg:border-r-0 border-white/5">
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-full h-14 border-none bg-transparent hover:bg-white/5 rounded-none data-[state=open]:bg-white/5 focus:ring-0 text-white px-6">
                                <div className="flex flex-col items-start gap-0.5 pointer-events-none">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Sort</span>
                                    <span className="text-sm font-medium truncate">
                                        {sort === 'created_at_desc' && 'Newest Arrivals'}
                                        {sort === 'price_asc' && 'Price: Low to High'}
                                        {sort === 'price_desc' && 'Price: High to Low'}
                                        {sort === 'year_desc' && 'Newest Year'}
                                        {sort === 'year_asc' && 'Oldest Year'}
                                        {sort === 'mileage_asc' && 'Lowest Mileage'}
                                        {sort === 'mileage_desc' && 'Highest Mileage'}
                                    </span>
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/10 text-white">
                                <SelectItem value="created_at_desc">Newest Arrivals</SelectItem>
                                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                <SelectItem value="year_desc">Year: Newest</SelectItem>
                                <SelectItem value="year_asc">Year: Oldest</SelectItem>
                                <SelectItem value="mileage_asc">Mileage: Low to High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center w-full lg:w-auto border-t lg:border-t-0 border-white/5">
                        {/* Toggle Filters */}
                        <div className="flex-1 lg:flex-none">
                            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className={`w-full lg:w-auto h-14 px-6 rounded-none hover:bg-white/5 justify-between lg:justify-center border-r border-white/5 ${isOpen ? 'bg-white/5 text-primary' : 'text-gray-300'}`}>
                                        <span className="flex items-center gap-2">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            <span className="lg:hidden">More Filters</span>
                                        </span>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 lg:ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="lg:hidden">
                                    {/* Mobile wrapper handles content below */}
                                </CollapsibleContent>
                            </Collapsible>
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={handleSearch}
                            disabled={isPending}
                            className="flex-1 lg:flex-none h-14 w-full lg:w-20 rounded-none bg-primary hover:bg-red-700 text-white transition-all font-bold tracking-wide rounded-br-none lg:rounded-br-none"
                        >
                            {isPending ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                                "SEARCH"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Expanded Content Area */}
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="p-6 border-t border-white/5 bg-black/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Price Range */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                    Price Range
                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">$ USD</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all font-mono"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all font-mono"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Year Range */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Year Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="From"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all font-mono"
                                        value={minYear}
                                        onChange={(e) => setMinYear(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="To"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all font-mono"
                                        value={maxYear}
                                        onChange={(e) => setMaxYear(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Mileage Range */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mileage Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all font-mono"
                                        value={minMileage}
                                        onChange={(e) => setMinMileage(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all font-mono"
                                        value={maxMileage}
                                        onChange={(e) => setMaxMileage(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Body Type */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Body Type</label>
                                <Select value={bodyType} onValueChange={setBodyType}>
                                    <SelectTrigger className="bg-black/40 border-white/10 text-white h-10 focus:ring-primary/50 hover:bg-white/5 transition-colors">
                                        <SelectValue placeholder="All Body Types" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border-white/10 text-white">
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Coupe">Coupe</SelectItem>
                                        <SelectItem value="Convertible">Convertible</SelectItem>
                                        <SelectItem value="SUV">SUV</SelectItem>
                                        <SelectItem value="Sedan">Sedan</SelectItem>
                                        <SelectItem value="Hypercar">Hypercar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        {hasActiveFilters && (
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                                <p className="text-xs text-gray-500">
                                    Refine your search for the perfect vehicle.
                                </p>
                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={clearFilters} className="text-gray-400 hover:text-white hover:bg-white/10 h-9">
                                        <X className="h-3.5 w-3.5 mr-2" /> Reset Filters
                                    </Button>
                                    <Button onClick={handleSearch} className="bg-white/10 hover:bg-white/20 text-white h-9 border border-white/5">
                                        Update Results
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
