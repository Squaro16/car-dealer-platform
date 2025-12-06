"use client";

import Link from "next/link";
import { Car, ChevronDown, FileText, Repeat, DollarSign, Menu, ArrowRight, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { getInventoryStats } from "@/lib/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function Navbar() {
    const [isHovered, setIsHovered] = useState(false);
    const [stats, setStats] = useState<{ brand: string | null; count: number }[]>([]);

    useEffect(() => {
        getInventoryStats().then(setStats);
    }, []);

    const topBrands = stats.slice(0, 5);
    const moreBrands = stats.slice(5, 12);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
            <div className="container flex h-20 items-center justify-between px-4 md:px-6 relative">
                <Link href="/" className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tighter uppercase relative z-50">
                    <Car className="h-6 w-6 text-primary" />
                    <span>Prestige Motors</span>
                </Link>

                <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
                    {/* Cars Mega Menu Trigger */}
                    <div
                        className="group relative h-20 flex items-center"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Link href="/inventory" className="flex items-center gap-1 transition-colors hover:text-primary uppercase tracking-wide">
                            Cars <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
                        </Link>

                        {/* Mega Menu Dropdown */}
                        <div
                            className={`absolute top-full left-1/2 -translate-x-1/2 w-[900px] p-6 rounded-xl border border-white/10 shadow-2xl bg-[#0f0f0f]/95 backdrop-blur-xl transition-all duration-300 origin-top
                            ${isHovered ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible pointer-events-none'}`}
                        >
                            <div className="grid grid-cols-12 gap-8">
                                {/* Left Column: Actions */}
                                <div className="col-span-4 space-y-4 border-r border-white/10 pr-6">
                                    <Link href="/inventory" className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="p-2 rounded-md bg-primary/20 text-primary group-hover/item:scale-110 transition-transform">
                                            <Car size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Inventory</div>
                                            <div className="text-xs text-gray-400">Explore all cars</div>
                                        </div>
                                    </Link>
                                    <Link href="/specs" className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="p-2 rounded-md bg-orange-500/20 text-orange-400 group-hover/item:scale-110 transition-transform">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Specs</div>
                                            <div className="text-xs text-gray-400">Discover specifications</div>
                                        </div>
                                    </Link>
                                    <Link href="/compare" className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="p-2 rounded-md bg-blue-500/20 text-blue-400 group-hover/item:scale-110 transition-transform">
                                            <Repeat size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Compare</div>
                                            <div className="text-xs text-gray-400">Model comparison</div>
                                        </div>
                                    </Link>
                                    <Link href="/sell-my-car" className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="p-2 rounded-md bg-green-500/20 text-green-400 group-hover/item:scale-110 transition-transform">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Sell My Car</div>
                                            <div className="text-xs text-gray-400">Get a valuation</div>
                                        </div>
                                    </Link>
                                    <Link href="/services/sourcing" className="group/item flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="p-2 rounded-md bg-purple-500/20 text-purple-400 group-hover/item:scale-110 transition-transform">
                                            <Search size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Vehicle Sourcing</div>
                                            <div className="text-xs text-gray-400">We find your dream car</div>
                                        </div>
                                    </Link>
                                </div>

                                {/* Middle Column: Available Brands */}
                                <div className="col-span-4 pl-4">
                                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-primary" /> Available Brands
                                    </h3>
                                    <div className="space-y-3">
                                        {topBrands.length > 0 ? (
                                            topBrands.map((stat) => (
                                                <Link key={stat.brand} href={`/inventory?make=${stat.brand}`} className="block text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center justify-between group/link">
                                                    <span className="flex items-center gap-2">
                                                        {stat.brand}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                                                        {stat.count}
                                                    </span>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500 italic">No brands available</div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: More Brands */}
                                <div className="col-span-4 pl-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-gray-500" /> More Makes
                                    </h3>
                                    <div className="space-y-3">
                                        {moreBrands.length > 0 ? (
                                            moreBrands.map((stat) => (
                                                <Link key={stat.brand} href={`/inventory?make=${stat.brand}`} className="block text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center justify-between group/link">
                                                    <span className="flex items-center gap-2">
                                                        {stat.brand}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                                                        {stat.count}
                                                    </span>
                                                </Link>
                                            ))
                                        ) : (
                                            <Link href="/inventory" className="text-sm text-gray-500 hover:text-primary transition-colors">View all inventory &rarr;</Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/financing" className="transition-colors hover:text-primary uppercase tracking-wide">
                        Financing
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-primary uppercase tracking-wide">
                        About
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-primary uppercase tracking-wide">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/contact" className="hidden md:block">
                        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors cursor-pointer mr-4">
                            Inquire Now
                        </div>
                    </Link>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-neutral-950 border-white/10 p-0 text-white">
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b border-white/10">
                                        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl tracking-tighter uppercase">
                                            <Car className="h-5 w-5 text-primary" />
                                            <span>Prestige Motors</span>
                                        </Link>
                                    </div>
                                    <nav className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
                                        <Collapsible className="group/collapsible">
                                            <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium hover:text-primary transition-colors">
                                                Cars
                                                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-4 pt-4 pl-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                                <Link href="/inventory" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    Inventory
                                                </Link>
                                                <Link href="/specs" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    Specifications
                                                </Link>
                                                <Link href="/compare" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    Compare Models
                                                </Link>
                                                <Link href="/sell-my-car" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    Sell My Car
                                                </Link>
                                                <Link href="/services/sourcing" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    Vehicle Sourcing
                                                </Link>
                                            </CollapsibleContent>
                                        </Collapsible>
                                        <Link href="/financing" className="text-lg font-medium hover:text-primary transition-colors flex items-center justify-between">
                                            Financing <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors flex items-center justify-between">
                                            About <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors flex items-center justify-between">
                                            Contact <ArrowRight className="h-4 w-4" />
                                        </Link>

                                    </nav>
                                    <div className="p-6 border-t border-white/10">
                                        <Link href="/contact">
                                            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider py-6">
                                                Inquire Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

