// Adds an expense from a vehicle detail page and verifies it appears.
import { test, expect } from "@playwright/test";

test.describe("Vehicle Expenses", () => {
    test("adds expense on vehicle detail page", async ({ page }) => {
        await page.goto("/dashboard/inventory/11111111-1111-4111-8111-111111111111");
        await expect(page.getByRole("heading")).toBeVisible();

        const amount = "321.50";
        const desc = `Vehicle Expense ${Date.now()}`;

        await page.getByRole("button", { name: "Add Expense" }).click({ timeout: 15000 });
        await page.getByLabel("Amount").fill(amount);
        await page.getByText("Select category").click();
        await page.getByRole("option", { name: "Maintenance" }).click();
        await page.getByLabel("Description").fill(desc);
        await page.getByRole("button", { name: "Add Expense" }).click();

        // Refresh to see server-rendered expenses
        await page.reload();

        await expect(page.getByText(desc)).toBeVisible({ timeout: 15000 });
    });
});

