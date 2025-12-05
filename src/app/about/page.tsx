import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-24">
                <div className="container px-4 md:px-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-6">About Prestige Motors</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We&apos;re a team of car enthusiasts dedicated to helping you find your perfect ride.</p>
                </div>
            </section>

            <div className="container py-16 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Our Story</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Prestige Motors was founded with a simple mission: to make buying a premium vehicle as enjoyable as driving one.
                            We noticed a gap in the market for a dealership that combined high-quality inventory with a modern, transparent buying process.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Over the last decade, we&apos;ve helped thousands of customers find their dream cars.
                            Our rigorous 150-point inspection process ensures that every vehicle on our lot meets our high standards for safety and performance.
                        </p>
                    </div>
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-muted-foreground">
                        Showroom Image Placeholder
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit text-primary">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
                            <p className="text-muted-foreground">
                                Every vehicle undergoes a comprehensive mechanical and cosmetic inspection before listing.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit text-primary">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
                            <p className="text-muted-foreground">
                                No hidden fees, no haggling. The price you see is the price you pay, plus standard taxes.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit text-primary">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Lifetime Support</h3>
                            <p className="text-muted-foreground">We&apos;re committed to providing the best car buying experience. Our relationship doesn&apos;t end at the sale. We offer service packages and support for the life of your car.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
