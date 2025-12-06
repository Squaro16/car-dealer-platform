"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Show after 2 seconds scroll or delay
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
            {/* Chat Popup */}
            <div
                className={cn(
                    "bg-white text-neutral-900 rounded-lg shadow-2xl p-6 w-80 mb-4 transition-all duration-300 origin-bottom-right transform border-t-4 border-primary",
                    isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none translate-y-4 h-0 overflow-hidden p-0 mb-0"
                )}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-heading font-bold text-lg">Sales Concierge</h3>
                        <p className="text-sm text-gray-500">Online & Ready to Help</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mt-2 -mr-2" onClick={() => setIsOpen(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Looking for a specific model or need financing options? Chat with our premium specialists directly.
                </p>

                <Button
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2"
                    onClick={() => window.open('https://wa.me/6512345678', '_blank')}
                >
                    <MessageSquare className="h-4 w-4" />
                    Start WhatsApp Chat
                </Button>
            </div>

            {/* Toggle Button */}
            <Button
                size="lg"
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-all duration-300 relative",
                    isOpen ? "bg-neutral-900 rotate-90" : "bg-primary hover:bg-primary/90 hover:scale-105"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <div className="relative">
                        <MessageSquare className="h-6 w-6 text-white" />
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </div>
                )}
            </Button>
        </div>
    );
}
