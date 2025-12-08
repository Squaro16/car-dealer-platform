import { test, expect } from '@playwright/test';

test.describe('Admin Inventory', () => {
    test('should create a new vehicle', async ({ page }) => {
        await page.goto('/dashboard/inventory');
        await page.getByRole('button', { name: 'Add Vehicle' }).click();
        await page.waitForURL('/dashboard/inventory/new');

        // Fill form
        const randomVin = `TESTVIN${Date.now()}`;
        await page.getByLabel('VIN (Required)').fill(randomVin);
        // Labels might need exact match or partial. The component uses <Label htmlFor="vin">VIN (Required)</Label>

        await page.getByLabel('Make').fill('TestMake');
        await page.getByLabel('Model').fill('TestModel');
        await page.getByLabel('Year').fill('2024');
        await page.getByLabel('Selling Price').fill('50000');
        await page.getByLabel('Mileage (km)').fill('100');

        // Submit
        await page.getByRole('button', { name: 'Create Vehicle' }).click();

        // Verify redirection and success message
        await page.waitForURL('/dashboard/inventory');
        await expect(page.getByText('Vehicle created successfully')).toBeVisible();

        // Verify it appears in the table
        // The table shows "{vehicle.year} {vehicle.make} {vehicle.model}"
        await expect(page.getByRole('cell', { name: '2024 TestMake TestModel' })).toBeVisible();
    });
});
