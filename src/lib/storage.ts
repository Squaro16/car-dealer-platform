import { createClient } from "@/lib/supabase/server";

export async function deleteImages(imageUrls: string[]) {
    if (!imageUrls || imageUrls.length === 0) return;

    const supabase = await createClient();

    // Extract file paths from URLs
    // URL format: .../storage/v1/object/public/vehicles/filename.ext
    const filePaths = imageUrls.map(url => {
        const parts = url.split("/vehicles/");
        return parts.length > 1 ? parts[1] : null;
    }).filter(path => path !== null) as string[];

    if (filePaths.length === 0) return;

    const { error } = await supabase.storage
        .from("vehicles")
        .remove(filePaths);

    if (error) {
        console.error("Error deleting images from storage:", error);
        // We don't throw here to allow the DB record deletion to proceed
    } else {
        console.log(`Successfully deleted ${filePaths.length} images from storage.`);
    }
}
