"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GallerySliderProps {
    images: string[];
    title: string;
}

export function GallerySlider({ images, title }: GallerySliderProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // If no images, return null or placeholder
    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-video bg-neutral-900 flex items-center justify-center text-gray-400 rounded-sm">
                No Images Available
            </div>
        );
    }

    const nextImage = useCallback(() => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextImage, prevImage]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Stage */}
            <div
                className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden rounded-sm bg-neutral-900 group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Image */}
                <div className="w-full h-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={images[selectedIndex]}
                        alt={`${title} - View ${selectedIndex + 1}`}
                        className="w-full h-full object-cover animate-in fade-in duration-500"
                        key={selectedIndex} // Force re-render for animation
                    />

                    {/* Gradient Overlay for Text Visibility (Optional) */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Navigation Controls - Visible on Hover */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-between p-4 transition-opacity duration-300",
                    isHovering ? "opacity-100" : "opacity-0 md:opacity-0" // Always show on touch? Maybe not.
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </div>

                {/* Index Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white">
                    {selectedIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails Strip */}
            <div className="relative w-full overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-3 min-w-full">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative flex-shrink-0 h-20 w-32 rounded-sm overflow-hidden transition-all duration-300 border-2",
                                selectedIndex === idx
                                    ? "border-primary opacity-100 ring-2 ring-primary/20"
                                    : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
