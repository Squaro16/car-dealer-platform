import { SourcingForm } from "@/components/services/sourcing-form";
import { Navbar } from "@/components/layout/navbar";
import { CheckCircle2, ShieldCheck, Globe2, Clock } from "lucide-react";

export default function SourcingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-neutral-900 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />

                <div className="container relative z-10 px-4 mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Premium Concierge Service</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 tracking-tight">
                        We Find Your <span className="text-primary">Dream Machine</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                        Looking for something specific? Our global network and sourcing specialists will locate, inspect, and deliver the exact vehicle you desire.
                    </p>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container px-4 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                        {/* Left: Value Proposition */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-heading font-bold mb-4">The Sourcing Process</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Our sourcing service is designed for the discerning individual who knows exactly what they want. We handle everything from the global search to the final delivery to your driveway.
                                </p>
                            </div>

                            <div className="grid gap-8">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                        <Globe2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Global Network Access</h3>
                                        <p className="text-sm text-muted-foreground">Access to off-market inventory and exclusive dealer networks worldwide.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Rigorous Inspection</h3>
                                        <p className="text-sm text-muted-foreground">Every vehicle undergoes a 150-point inspection by certified specialists before purchase.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Time-Saving Concierge</h3>
                                        <p className="text-sm text-muted-foreground">We handle negotiation, paperwork, import logistics, and registration.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-muted/30 border border-muted">
                                <h4 className="font-bold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Satisfaction Guarantee
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    We verify provenance, service history, and condition. If the car isn&apos;t exactly as described, we don&apos;t buy it.
                                </p>
                            </div>
                        </div>

                        {/* Right: The Form */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-3xl" />
                            <div className="relative bg-card rounded-xl border shadow-xl p-1 overflow-hidden h-full min-h-[600px]">
                                <SourcingForm />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
