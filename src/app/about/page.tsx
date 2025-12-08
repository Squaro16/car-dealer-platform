// import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Trophy, Users, History } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            {/* Navbar handled in global layout */}

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950 z-0" />
                <div className="absolute inset-0 bg-grid-white/[0.02] z-0" />
                <div className="container relative z-10 px-4 md:px-6 text-center">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">The LS Motor Experience</span>
                    <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase">
                        Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Excellence</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        More than just a dealership. Curating the world&apos;s most exclusive automobiles for the discerning few.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container py-16 md:py-24 px-4 md:px-6">
                {/* Story Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white">About Us</h2>
                        <div className="space-y-6 text-gray-300 text-lg font-light leading-relaxed">
                            <p>
                                LS Motors is a reputable used car dealership with over 20 years of experience in the industry, providing customers with a wide range of high-quality pre-owned vehicles.
                            </p>
                            <p>
                                With a strong focus on customer satisfaction, LS Motors has garnered a loyal following of happy customers who have praised the dealership for their fair pricing and excellent customer service.
                            </p>
                            <p>
                                Whether you’re in the market for a reliable commuter car or a luxurious SUV, LS Motors is a trustworthy choice for anyone looking for a high-quality used vehicle.
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden border border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        {/* Placeholder for Showroom Image - Using a gradient pattern for now */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-20" />
                        <div className="absolute bottom-0 left-0 p-8 z-20">
                            <div className="text-4xl font-heading font-bold text-white mb-2">20+</div>
                            <div className="text-sm text-gray-300 uppercase tracking-widest">Years of Excellence</div>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Trophy,
                            title: "Unmatched Quality",
                            description: "Our inventory is curated from the top 1% of vehicles available globally, ensuring pristine condition and provenance."
                        },
                        {
                            icon: History,
                            title: "Transparent History",
                            description: "Complete documentation and transparent vehicle history reports are standard with every automobile we represent."
                        },
                        {
                            icon: Users,
                            title: "Concierge Service",
                            description: "From private viewings to global shipping logistics, our dedicated team handles every detail of your acquisition."
                        }
                    ].map((item, idx) => (
                        <Card key={idx} className="bg-card/30 backdrop-blur border-white/5 hover:bg-card/50 transition-colors duration-500 group">
                            <CardContent className="pt-8 p-8">
                                <div className="mb-6 p-4 rounded-sm bg-primary/10 w-fit text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h3 className="font-heading text-xl font-bold text-white mb-4 uppercase tracking-wide">{item.title}</h3>
                                <p className="text-gray-300 leading-relaxed font-light">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
