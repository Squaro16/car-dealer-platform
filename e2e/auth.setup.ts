import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    setup.setTimeout(90000);
    // 1. Go to login page
    await page.goto('/login');

    // 2. Fill credentials
    await page.getByLabel('Email Address').fill('admin@lsgroup.com.my');
    await page.getByLabel('Password').fill('LSGroup@123!');

    // 3. Submit
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 4. Wait for navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 60000 });
    await expect(page.locator('h2').filter({ hasText: 'Dashboard' }).first()).toBeVisible({ timeout: 15000 });

    // 5. Save state
    await page.context().storageState({ path: authFile });
});
