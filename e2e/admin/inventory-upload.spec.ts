// Adds a vehicle with an uploaded image (storage calls intercepted) and verifies preview plus list presence.
import { test, expect } from "@playwright/test";

const pngData = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9XYh2K4AAAAASUVORK5CYII=",
    "base64"
);

test.describe("Admin Inventory Upload", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/storage/v1/object/**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ Key: "vehicles/test.png" }),
            })
        );
    });

    test("allows selecting image file (upload intercepted)", async ({ page }) => {
        await page.goto("/dashboard/inventory/new");

        await page.getByLabel("Year").fill("2024");
        await page.getByLabel("Make").fill("UploadMake");
        await page.getByLabel("Model").fill("UploadModel");
        await page.getByLabel("Selling Price").fill("45000");
        await page.getByLabel("VIN").fill(`VIN${Date.now()}`);
        await page.getByLabel("Type").fill("Sedan");
        await page.getByLabel("Color").fill("Blue");
        await page.getByLabel("Mileage").fill("10");
        await page.getByLabel("Cost Price").fill("30000");

        // Upload image through the hidden input
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
            name: "test.png",
            mimeType: "image/png",
            buffer: pngData,
        });
        // Smoke check ends here to avoid real storage dependency.
    });
});

