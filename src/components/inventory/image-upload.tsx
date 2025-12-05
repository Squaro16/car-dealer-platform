"use client";

import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    onUploadComplete: (urls: string[]) => void;
    defaultImages?: string[];
}

export function ImageUpload({ onUploadComplete, defaultImages = [] }: ImageUploadProps) {
    const [images, setImages] = useState<string[]>(defaultImages);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (const file of Array.from(files)) {
                const fileExt = file.name.split(".").pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("vehicles")
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from("vehicles")
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            }

            const updatedImages = [...images, ...newUrls];
            setImages(updatedImages);
            onUploadComplete(updatedImages);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);
        onUploadComplete(updatedImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((url, index) => (
                    <div key={url} className="relative w-32 h-24 border rounded-md overflow-hidden group">
                        <Image
                            src={url}
                            alt="Vehicle"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                <div
                    className="w-32 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    ) : (
                        <>
                            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground">Upload</span>
                        </>
                    )}
                </div>
            </div>
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
                multiple
            />
            {/* Hidden input to ensure form submission includes images if needed, though usually handled by parent state */}
            <input type="hidden" name="images" value={JSON.stringify(images)} />
        </div>
    );
}
