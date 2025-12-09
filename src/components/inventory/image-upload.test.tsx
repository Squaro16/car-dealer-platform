// Tests ImageUpload to ensure uploads call Supabase storage and update callbacks.
// Also verifies default images render and can be removed.
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImageUpload } from "./image-upload";
import { createClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
    createClient: vi.fn(),
}));

const mockUpload = vi.fn().mockResolvedValue({});
const mockGetPublicUrl = vi.fn(() => ({
    data: { publicUrl: "https://example.com/image.png" },
}));
const mockFrom = vi.fn(() => ({
    upload: mockUpload,
    getPublicUrl: mockGetPublicUrl,
}));

describe("ImageUpload", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(createClient).mockReturnValue({
            storage: {
                from: mockFrom,
            },
        } as any);
    });

    it("renders default images and allows removal", () => {
        const onUploadComplete = vi.fn();
        render(<ImageUpload defaultImages={["https://img/one.png"]} onUploadComplete={onUploadComplete} />);

        expect(screen.getByAltText("Vehicle")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button"));
        expect(onUploadComplete).toHaveBeenCalledWith([]);
    });

    it("uploads files and propagates URLs", async () => {
        const onUploadComplete = vi.fn();
        const { container } = render(<ImageUpload onUploadComplete={onUploadComplete} />);

        const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => expect(mockUpload).toHaveBeenCalled());
        expect(mockFrom).toHaveBeenCalledWith("vehicles");
        await waitFor(() =>
            expect(onUploadComplete).toHaveBeenCalledWith(
                expect.arrayContaining(["https://example.com/image.png"])
            )
        );
    });
});

