"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface GallerySliderProps {
    images: string[];
    title: string;
}

export function GallerySlider({ images, title }: GallerySliderProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

    const nextImage = useCallback(() => {
        if (!images) return;
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }, [images]);

    const prevImage = useCallback(() => {
        if (!images) return;
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextImage, prevImage]);

    // If no images, return null or placeholder
    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-video bg-neutral-900 flex items-center justify-center text-gray-400 rounded-sm">
                No Images Available
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Stage */}
            <div
                className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden rounded-sm bg-neutral-900 group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Image */}
                <div className="w-full h-full relative cursor-pointer" onClick={() => setIsLightBoxOpen(true)}>
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

                {/* Lightbox Trigger */}
                <div className={cn(
                    "absolute top-4 right-4 transition-opacity duration-300 z-10",
                    isHovering ? "opacity-100" : "opacity-0"
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLightBoxOpen(true)}
                        className="h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation Controls - Visible on Hover */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-between p-4 transition-opacity duration-300 pointer-events-none",
                    isHovering ? "opacity-100" : "opacity-100 md:opacity-0"
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm pointer-events-auto"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm pointer-events-auto"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </div>

                {/* Index Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white pointer-events-none">
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

            {/* Lightbox Modal */}
            <Dialog open={isLightBoxOpen} onOpenChange={setIsLightBoxOpen}>
                <DialogContent className="max-w-[95vw] h-[90vh] bg-black border-none p-0 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close Button is handled by DialogPrimitive logic usually, but we can add overlay controls if needed */}

                        {/* Lightbox Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={images[selectedIndex]}
                            alt={`${title} - Fullscreen View`}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Lightbox Navigation */}
                        <div className="absolute inset-0 flex items-center justify-between p-4 md:p-8">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={prevImage}
                                className="h-14 w-14 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md"
                            >
                                <ChevronLeft className="h-10 w-10" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextImage}
                                className="h-14 w-14 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md"
                            >
                                <ChevronRight className="h-10 w-10" />
                            </Button>
                        </div>

                        {/* Lightbox Footer info */}
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                            <h3 className="text-white text-xl font-heading font-medium text-center">{title}</h3>
                            <p className="text-gray-400 text-sm text-center mt-1">{selectedIndex + 1} / {images.length}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
