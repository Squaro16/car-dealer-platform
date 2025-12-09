// Verifies the admin settings page renders core sections for profile and users.
// Confirms dealer profile form fields and user management table are visible for admins.
import { test, expect } from "@playwright/test";

test.describe("Admin Settings", () => {
    test("shows dealer profile form and user management table", async ({ page }) => {
        await page.goto("/dashboard/settings");

        await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
        await expect(page.getByText("Dealer Profile")).toBeVisible();
        await expect(page.getByLabel("Dealership Name")).toBeVisible();
        await expect(page.getByLabel("Contact Email")).toBeVisible();
        await expect(page.getByRole("button", { name: "Save Changes" })).toBeVisible();

        await expect(page.getByText("User Management")).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Role" })).toBeVisible();
    });
});

