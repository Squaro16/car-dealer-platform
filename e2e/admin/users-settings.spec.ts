// Admin can change another user's role; sales should not see user management.
import { test, expect } from "@playwright/test";

test.describe("User Management", () => {
    test("admin changes a user's role", async ({ page }) => {
        // Login as admin for fresh session
        await page.goto("/login");
        await page.getByLabel("Email Address").fill("admin@lsgroup.com.my");
        await page.getByLabel("Password").fill("LSGroup@123!");
        await page.getByRole("button", { name: "Sign In" }).click();
        await page.waitForURL("/dashboard");

        await page.goto("/dashboard/settings");

        await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
        await expect(page.getByText("User Management", { exact: true })).toBeVisible({ timeout: 15000 });

        // Find sales user row
        const row = page.getByRole("row", { name: /sales@lsgroup.com.my/i });
        await expect(row).toBeVisible();

        const selectTrigger = row.getByRole("combobox");
        await selectTrigger.click();
        await page.getByRole("option", { name: "Service" }).click();

        await expect(selectTrigger).toHaveText(/Service/);
    });

    test.use({ storageState: "playwright/.auth/sales.json" });
    test("sales user cannot access user management", async ({ page }) => {
        await page.goto("/dashboard/settings");
        await expect(page.getByText("User Management")).not.toBeVisible();
    });
});

