import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-background to-background z-0" />
                <div className="container relative z-10 px-4 md:px-6 text-center">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Get in Touch</span>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase">
                        Contact <span className="text-primary">Prestige</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Whether you&apos;re looking to acquire a specific vehicle or have questions about our inventory, our concierge team is at your service.
                    </p>
                </div>
            </div>

            <div className="container py-8 md:py-12 px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <Card className="border-none bg-card/30 backdrop-blur-md">
                        <CardContent className="p-8">
                            <h2 className="font-heading text-2xl font-bold text-white mb-8 border-l-4 border-primary pl-4 uppercase">Send a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-gray-200 uppercase text-xs tracking-wider">First Name</Label>
                                        <Input id="firstName" placeholder="JOHN" className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-gray-200 uppercase text-xs tracking-wider">Last Name</Label>
                                        <Input id="lastName" placeholder="DOE" className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-200 uppercase text-xs tracking-wider">Email</Label>
                                    <Input id="email" type="email" placeholder="JOHN@EXAMPLE.COM" className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-200 uppercase text-xs tracking-wider">Phone</Label>
                                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-gray-200 uppercase text-xs tracking-wider">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="I am interested in..."
                                        className="min-h-[150px] bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 resize-none"
                                    />
                                </div>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wider uppercase py-6">
                                    Send Message <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Info & Map */}
                    <div className="space-y-12">
                        <div className="grid gap-8">
                            {[
                                { icon: MapPin, title: "Visit Our Showroom", content: ["123 Premium Drive", "Automotive City, SG 123456"] },
                                { icon: Phone, title: "Call Us", content: ["+65 6123 4567"] },
                                { icon: Mail, title: "Email Us", content: ["contact@prestigemotors.com"] },
                                { icon: Clock, title: "Opening Hours", content: ["Mon - Fri: 9:00 AM - 7:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"] }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-6 group">
                                    <div className="p-4 rounded-sm bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-white/5">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-white text-lg mb-2 uppercase tracking-wide">{item.title}</h3>
                                        <div className="text-gray-300 font-light leading-relaxed">
                                            {item.content.map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map Placeholder */}
                        <div className="aspect-video bg-neutral-900 rounded-sm border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-20" />
                            <div className="text-center z-10">
                                <MapPin className="h-12 w-12 text-primary mx-auto mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-gray-400 uppercase tracking-widest font-bold text-sm">Main Headquarters</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
