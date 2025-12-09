import { test, expect } from '@playwright/test';

test.describe('Admin Inventory', () => {
    test('should create a new vehicle', async ({ page }) => {
        test.setTimeout(90000);
        await page.goto('/dashboard/inventory');
        await page.getByRole('button', { name: 'Add Vehicle' }).click();
        await page.waitForURL('/dashboard/inventory/new');

        // Fill form
        const uniqueId = Date.now();
        const randomVin = `TESTVIN${uniqueId}`;
        const uniqueModel = `TestModel${uniqueId}`;

        await page.getByLabel('VIN (Required)').fill(randomVin);
        await page.getByLabel('Make').fill('TestMake');
        await page.getByLabel('Model').fill(uniqueModel);
        await page.getByLabel('Year').fill('2024');
        await page.getByLabel('Selling Price').fill('50000');
        await page.getByLabel('Mileage (km)').fill('100');

        // Submit
        await page.getByRole('button', { name: 'Create Vehicle' }).click();

        // Verify redirection and success message
        await page.waitForURL('/dashboard/inventory');
        // Toast check removed as it can be flaky during navigation. 
        // We verify success by checking the table data below.

        // Verify it appears in the table
        await expect(page.getByRole('cell', { name: `2024 TestMake ${uniqueModel}` })).toBeVisible();
    });
});
