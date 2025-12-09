// Adds an expense via the modal and verifies it appears in the table.
import { test, expect } from "@playwright/test";

test.describe("Admin Expenses", () => {
    test("creates a new expense entry", async ({ page }) => {
        await page.goto("/dashboard/expenses");

        await expect(page.getByRole("heading", { name: "Expenses" })).toBeVisible();
        await page.getByRole("button", { name: "Add Expense" }).click();

        await page.getByLabel("Amount").fill("123.45");

        await page.getByText("Select category").click();
        await page.getByRole("option", { name: "Repair" }).click();

        const desc = `E2E Expense ${Date.now()}`;
        await page.getByLabel("Description").fill(desc);

        // Date field defaults to today; keep it.
        // Keep general expense (no vehicle)
        await page.evaluate(() => {
            const node = document.querySelector('input[name="vehicleId"]') as HTMLInputElement | null;
            if (node) node.value = "";
        });

        await page.getByRole("button", { name: "Add Expense" }).click();

        await expect(page.getByText(desc)).toBeVisible({ timeout: 15000 });
    });
});

