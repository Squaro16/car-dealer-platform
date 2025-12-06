import Link from "next/link";
import { Car, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 text-gray-300 py-16 font-body">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tighter uppercase text-white">
                            <Car className="h-6 w-6 text-primary" />
                            <span>Prestige Motors</span>
                        </Link>
                        Curating the world&apos;s finest automobiles for the most discerning collectors. Experience excellence in every interaction.
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <Link key={i} href="#" className="h-10 w-10 flex items-center justify-center rounded-sm bg-white/5 hover:bg-primary hover:text-white transition-all duration-300">
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-heading font-bold text-white uppercase tracking-wide mb-6 text-lg">Inventory</h3>
                        <ul className="space-y-4 text-sm font-light">
                            <li><Link href="/inventory" className="hover:text-primary transition-colors flex items-center gap-2"><div className="h-1 w-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />All Vehicles</Link></li>
                            <li><Link href="/inventory?sort=newest" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/inventory?condition=used" className="hover:text-primary transition-colors">Pre-Owned Collection</Link></li>
                            <li><Link href="/sell-my-car" className="hover:text-primary transition-colors">Sell Your Car</Link></li>
                            <li><Link href="/compare" className="hover:text-primary transition-colors">Compare Models</Link></li>
                            <li><Link href="/specs" className="hover:text-primary transition-colors">Specifications</Link></li>
                            <li><Link href="/financing" className="hover:text-primary transition-colors">Bespoke Financing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading font-bold text-white uppercase tracking-wide mb-6 text-lg">Company</h3>
                        <ul className="space-y-4 text-sm font-light">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Our Legacy</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Concierge</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading font-bold text-white uppercase tracking-wide mb-6 text-lg">Contact</h3>
                        <ul className="space-y-4 text-sm font-light">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>123 Premium Drive<br />Automotive City, SG 123456</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+65 6123 4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>contact@prestigemotors.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-gray-400 font-light flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} Prestige Motors. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
