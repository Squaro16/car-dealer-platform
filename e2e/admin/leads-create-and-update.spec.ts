// Creates a lead from inventory detail and updates status on Leads page.
import { test, expect } from "@playwright/test";

test.describe("Leads flow", () => {
    test("create lead from inventory and update status", async ({ page }) => {
        // Go to public inventory detail (marketing route)
        await page.goto("/inventory/11111111-1111-4111-8111-111111111111");

        await expect(page.getByRole("heading", { name: /Corolla/i })).toBeVisible({ timeout: 15000 });

        // Lead form is on the marketing detail page
        await expect(page.getByLabel("Full Name")).toBeVisible({ timeout: 10000 });

        const leadName = `E2E Lead ${Date.now()}`;
        await page.getByLabel("Full Name").fill(leadName);
        await page.getByLabel("Phone Number").fill("90009999");
        await page.getByLabel("Email (Optional)").fill("lead-e2e@example.com");
        await page.getByLabel("Message").fill("Interested in this vehicle.");
        await page.evaluate(() => {
            const form = document.querySelector("form");
            if (form && !form.querySelector('input[name="captchaToken"]')) {
                const hidden = document.createElement("input");
                hidden.type = "hidden";
                hidden.name = "captchaToken";
                hidden.value = "";
                form.appendChild(hidden);
            }
        });
        await page.getByRole("button", { name: "Send Inquiry" }).click();

        await expect(page.getByText("Inquiry Sent!", { exact: false })).toBeVisible({ timeout: 15000 });

        // Navigate to Leads page to update status
        await page.goto("/dashboard/leads");
        const row = page.getByRole("row", { name: new RegExp(leadName, "i") });
        await expect(row).toBeVisible({ timeout: 15000 });

        const select = row.getByRole("combobox");
        await select.click();
        await page.getByRole("option", { name: "Contacted" }).click();
        await expect(row.getByText("contacted")).toBeVisible({ timeout: 10000 });
    });
});

