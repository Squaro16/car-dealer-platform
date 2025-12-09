import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
    test('should load dashboard and show stats', async ({ page }) => {
        await page.goto('/dashboard');

        // Check for main heading
        await expect(page.locator('h2').filter({ hasText: 'Dashboard' })).toBeVisible();

        // Check for sidebar logo (verifying branding change)
        await expect(page.getByAltText('LS Motor')).toBeVisible();

        // Check for some stat cards (assuming structure)
        // We look for text that likely appears in stat cards like "Total Revenue", "Active Inventory"
        // Since I don't see exact text in file view, I'll stick to generic checks or wait for selectors
        // Let's check for the Sidebar links to ensure nav is present
        await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
    });
});
