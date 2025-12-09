// Creates and edits a customer, verifying list updates.
import { test, expect } from "@playwright/test";

test.describe("Admin Customers", () => {
    test("creates and edits a customer", async ({ page }) => {
        const name = `E2E Customer ${Date.now()}`;
        const updated = `${name} Updated`;

        await page.goto("/dashboard/customers");
        await page.getByRole("button", { name: "Add Customer" }).click();

        await page.waitForURL("/dashboard/customers/new");

        await page.getByLabel("Name (Required)").fill(name);
        await page.getByLabel("Email").fill("e2e@example.com");
        await page.getByLabel("Phone").fill("90001111");
        await page.getByLabel("ID Number (NRIC/Passport)").fill("S1234567A");
        await page.getByLabel("Address").fill("123 Test Street");
        await page.getByLabel("Notes").fill("Test notes");
        await page.getByRole("button", { name: "Create Customer" }).click();

        await page.waitForURL("/dashboard/customers");
        await expect(page.getByText(name)).toBeVisible({ timeout: 10000 });

        // Open edit page
        const editLink = page.getByRole("link", { name: "Edit" }).first();
        await editLink.click();
        await page.waitForURL(/\/dashboard\/customers\/.*\/edit/);

        await page.getByLabel("Name (Required)").fill(updated);
        await page.getByRole("button", { name: "Update Customer" }).click();

        await page.waitForURL("/dashboard/customers");
        await expect(page.getByText(updated)).toBeVisible({ timeout: 10000 });

        // Drill into detail (edit page again) to assert fields
        await page.getByRole("link", { name: "Edit" }).first().click();
        await page.waitForURL(/\/dashboard\/customers\/.*\/edit/);
        await expect(page.getByLabel("Name (Required)")).toHaveValue(updated);
        await expect(page.getByLabel("Email")).toHaveValue("e2e@example.com");
        await expect(page.getByLabel("Phone")).toHaveValue("90001111");
    });
});

