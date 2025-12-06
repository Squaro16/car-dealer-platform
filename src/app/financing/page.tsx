import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Check, Wallet, Percent, Calendar } from "lucide-react";
import { PaymentCalculator } from "@/components/financing/payment-calculator";

export default function FinancingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-background to-background z-0" />
                <div className="container relative z-10 px-4 md:px-6 text-center">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Financial Services</span>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase">
                        Bespoke <span className="text-primary">Financing</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Tailored financial solutions designed to match your unique requirements.
                    </p>
                </div>
            </div>

            <div className="container py-12 px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Calculator */}
                    {/* Calculator */}
                    <PaymentCalculator />

                    {/* Benefits */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h3 className="font-heading text-3xl font-bold text-white uppercase tracking-wide border-l-4 border-primary pl-6">
                                Use Our Leverage
                            </h3>
                            <p className="text-gray-300 text-lg font-light leading-relaxed">
                                Our bespoke financing solutions are designed to make ownership seamless. We work with a network of premium financial institutions to secure the most competitive rates for our clients.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {[
                                "Competitive interest rates starting from 2.88%",
                                "Flexible terms up to 84 months",
                                "Fast approval process",
                                "Zero down payment options available",
                                "Trade-ins accepted as down payment",
                                "Balloon scheme options available"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span className="text-gray-200 text-lg font-light">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-black/20 border border-white/10 p-8 rounded-sm backdrop-blur-sm">
                            <h4 className="font-heading font-bold text-white uppercase tracking-wide mb-4">Required Documents</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 font-light">
                                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> NRIC / Passport</li>
                                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Latest 3 months payslips</li>
                                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Latest 12 months CPF history</li>
                                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary" /> Proof of residence</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
