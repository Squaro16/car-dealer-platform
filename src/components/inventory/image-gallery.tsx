"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-muted-foreground text-lg">
                No Images Available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-slate-100">
                <Image
                    src={images[selectedIndex]}
                    alt={`${title} - Image ${selectedIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative aspect-video w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all hover:opacity-100",
                                selectedIndex === index
                                    ? "border-primary ring-2 ring-primary ring-offset-2 opacity-100"
                                    : "border-transparent opacity-70"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${title} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
