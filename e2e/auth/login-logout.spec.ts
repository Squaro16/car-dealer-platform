// Covers login failure messaging and logout flow.
import { test, expect } from "@playwright/test";

test.describe("Auth flows", () => {
    test("shows error on invalid login", async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel("Email Address").fill("wrong@example.com");
        await page.getByLabel("Password").fill("BadPassword1!");
        await page.getByRole("button", { name: "Sign In" }).click();

        const error = page.getByText(/invalid login credentials|invalid credentials/i).first();
        await expect(error).toBeVisible({ timeout: 10000 });
    });

    test("logs out successfully", async ({ page }) => {
        // Use admin to ensure dashboard loads
        await page.goto("/login");
        await page.getByLabel("Email Address").fill("admin@lsgroup.com.my");
        await page.getByLabel("Password").fill("LSGroup@123!");
        await page.getByRole("button", { name: "Sign In" }).click();

        await page.waitForURL("/dashboard");

        await page.getByRole("button", { name: "Sign Out" }).click();

        await expect(page).toHaveURL(/login/);
    });
});

