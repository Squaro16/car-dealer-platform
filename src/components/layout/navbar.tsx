import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Car className="h-6 w-6" />
                    <span>Prestige Motors</span>
                </Link>
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    <Link href="/inventory" className="transition-colors hover:text-primary">
                        Inventory
                    </Link>
                    <Link href="/financing" className="transition-colors hover:text-primary">
                        Financing
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-primary">
                        About Us
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-primary">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/inventory">
                        <Button>Browse Cars</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
