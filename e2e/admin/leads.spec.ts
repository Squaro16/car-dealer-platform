// Updates status for a seeded lead.
import { test, expect } from "@playwright/test";

test.describe("Admin Leads", () => {
    test("updates lead status", async ({ page }) => {
        await page.goto("/dashboard/leads");

        await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();

        const row = page.getByRole("row", { name: /Seed Lead/ });
        await expect(row).toBeVisible();

        await row.getByRole("combobox").click();
        await page.getByRole("option", { name: "Contacted" }).click();

        await expect(row.getByText("contacted")).toBeVisible({ timeout: 10000 });
    });
});

