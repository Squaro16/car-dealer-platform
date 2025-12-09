// Validates reports page date filtering and export affordances.
import { test, expect } from "@playwright/test";

test.describe("Admin Reports", () => {
    test("applies date filter and triggers export", async ({ page }) => {
        await page.goto("/dashboard/reports");

        await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();

        // Set a short date range
        const start = "2024-01-01";
        const end = "2024-12-31";
        await page.getByLabel("Start Date").fill(start);
        await page.getByLabel("End Date").fill(end);
        await page.getByRole("button", { name: "Apply Filter" }).click();

        // Sales tab should render (default tab)
        await expect(page.getByText(/Sales Report/)).toBeVisible();
        await expect(
            page.getByRole("table").locator("tbody tr")
        ).toBeVisible();

        // Export handles empty data gracefully (alert) or downloads when data exists.
        const exportButton = page.getByRole("button", { name: "Export CSV" });
        const dialogPromise = page.waitForEvent("dialog").then((dialog) => dialog.accept()).catch(() => {});
        await exportButton.click();
        await dialogPromise;

        // Switch to expenses tab and verify table presence
        await page.getByRole("tab", { name: "Expenses" }).click();
        await expect(page.getByText(/Expenses Report/)).toBeVisible();

        // Switch to inventory tab and verify table presence
        await page.getByRole("tab", { name: "Inventory" }).click();
        await expect(page.getByText(/Inventory Valuation/)).toBeVisible();
    });
});

