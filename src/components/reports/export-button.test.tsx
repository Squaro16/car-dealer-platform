// Ensures ExportButton builds CSV correctly and escapes commas.
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportButton } from "./export-button";

// Mock URL and anchor to avoid real downloads
const mockCreateObjectURL = vi.fn(() => "blob:mock");
const mockRevokeObjectURL = vi.fn();
const mockAnchorClick = vi.fn();
let capturedBlobText = "";
const RealBlob = globalThis.Blob;

describe("ExportButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        capturedBlobText = "";
        // Stub Blob to capture payload
        // @ts-expect-error
        globalThis.Blob = class {
            constructor(parts: unknown[]) {
                capturedBlobText = parts.map((p) => (typeof p === "string" ? p : String(p))).join("");
            }
        };
        vi.spyOn(URL, "createObjectURL").mockImplementation(mockCreateObjectURL);
        vi.spyOn(URL, "revokeObjectURL").mockImplementation(mockRevokeObjectURL);
        vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(mockAnchorClick);
    });

    afterEach(() => {
        // @ts-expect-error
        globalThis.Blob = RealBlob;
    });

    it("generates CSV with escaped commas", () => {
        const data = [
            { Name: "John Doe", Note: "Hello, world", Amount: 10 },
            { Name: "Jane", Note: "No comma", Amount: 20 },
        ];

        render(<ExportButton data={data} filename="test-export" />);
        fireEvent.click(screen.getByRole("button", { name: /export csv/i }));

        expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
        expect(capturedBlobText).toContain("Name,Note,Amount");
        expect(capturedBlobText).toContain('"Hello, world"'); // Comma escaped
        expect(capturedBlobText).toContain('John Doe,"Hello, world",10');
        expect(capturedBlobText).toContain("Jane,No comma,20");
    });
});

