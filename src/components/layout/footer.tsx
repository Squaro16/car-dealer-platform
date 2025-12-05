import Link from "next/link";
import { Car, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                            <Car className="h-6 w-6" />
                            <span>Prestige Motors</span>
                        </Link>
                        <p className="text-sm text-slate-400">
                            Premium selection of new and used vehicles. Quality you can trust.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Inventory</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/inventory" className="hover:text-white transition-colors">All Vehicles</Link></li>
                            <li><Link href="/inventory?condition=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="/inventory?condition=used" className="hover:text-white transition-colors">Used Cars</Link></li>
                            <li><Link href="/financing" className="hover:text-white transition-colors">Financing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li>123 Premium Drive</li>
                            <li>Automotive City, SG 123456</li>
                            <li>+65 6123 4567</li>
                            <li>contact@prestigemotors.com</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} Prestige Motors. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
