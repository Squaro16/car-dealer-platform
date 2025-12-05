"use client";

import { Button } from "@/components/ui/button";
import { SourcingForm } from "@/components/services/sourcing-form";
import { Car, X, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function CarFinderModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

            if (scrolledToBottom && !isOpen) {
                setShowPrompt(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isOpen]);

    const toggleOpen = () => {
        if (!isOpen) {
            setShowPrompt(false);
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Widget Container */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out transform origin-bottom-right overflow-hidden",
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-4 pointer-events-none h-0"
                )}
            >
                <Card className="w-[350px] md:w-[400px] shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
                    <div className="flex items-center justify-between p-4 border-b bg-muted/50">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Car className="h-5 w-5 text-primary" />
                                Car Finder
                            </h3>
                            <p className="text-xs text-muted-foreground">We&apos;ll help you find your dream car</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto p-1">
                        <SourcingForm />
                    </div>
                </Card>
            </div>

            {/* Prompt Bubble */}
            {showPrompt && !isOpen && (
                <div
                    className="bg-popover text-popover-foreground shadow-lg rounded-xl p-4 max-w-[250px] relative animate-in fade-in slide-in-from-bottom-2 border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                        setIsOpen(true);
                        setShowPrompt(false);
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPrompt(false);
                        }}
                        className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground rounded-full p-1 hover:bg-secondary/80 shadow-sm"
                    >
                        <X className="h-3 w-3" />
                    </button>
                    <p className="text-sm font-medium leading-relaxed">
                        Don&apos;t see what you&apos;re looking for? <span className="text-primary font-bold">Review our sourcing service!</span>
                    </p>
                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-popover border-b border-r transform rotate-45"></div>
                </div>
            )}

            {/* FAB Trigger */}
            <Button
                size="icon"
                onClick={toggleOpen}
                className={cn(
                    "h-14 w-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 z-50",
                    isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90",
                    showPrompt ? "animate-bounce" : ""
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
                <span className="sr-only">Toggle Car Finder</span>
            </Button>
        </div>
    );
}
