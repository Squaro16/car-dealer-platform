// Verifies non-admin users cannot access admin-only areas like User Management.
import { test, expect } from "@playwright/test";

test.describe("Permissions", () => {
    test.use({
        storageState: undefined, // fresh context
    });

    test("non-admin cannot see User Management in settings", async ({ page, context }) => {
        // Sign in as sales role using seeded credentials override
        await page.goto("/login");
        await page.getByLabel("Email Address").fill("sales@lsgroup.com.my");
        await page.getByLabel("Password").fill("LSGroup@123!");
        await page.getByRole("button", { name: "Sign In" }).click();

        await page.waitForURL("/dashboard");

        await page.goto("/dashboard/settings");

        await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
        await expect(page.getByText("User Management")).not.toBeVisible({ timeout: 1000 });

        // Save state for reuse if needed
        await context.storageState({ path: "playwright/.auth/sales.json" });
    });
});

