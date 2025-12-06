"use client";

import { cn } from "@/lib/utils";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wide border-l-4 border-primary pl-4">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "relative overflow-hidden rounded-sm group",
                            idx % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={img}
                            alt={`${title} - Gallery ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
