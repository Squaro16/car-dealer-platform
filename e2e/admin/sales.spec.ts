
import { test, expect } from '@playwright/test';

test.describe('Admin Sales Flow', () => {
    test.setTimeout(90000); // 90s timeout for complex flow

    test('should create customer, vehicle, and record sale', async ({ page }) => {
        // --- PRE-REQUISITES: Unique Data ---
        const timestamp = Date.now();
        const customerName = `Test Customer ${timestamp}`;
        const customerEmail = `customer${timestamp}@test.com`;
        const customerPhone = `9000${timestamp.toString().slice(-4)}`;
        const modelName = `SaleModel${timestamp}`;
        const vin = `VIN${timestamp}`;
        const salePrice = '50000';

        // --- STEP 1: CREATE CUSTOMER ---
        await page.goto('/dashboard/customers/new');

        await page.getByLabel('Name (Required)').fill(customerName);
        await page.getByLabel('Email').fill(customerEmail);
        await page.getByLabel('Phone').fill(customerPhone);
        await page.getByPlaceholder('S1234567A').fill(`S${timestamp}A`); // ID Number

        await page.getByRole('button', { name: 'Create Customer' }).click();

        // Verify redirection to customer list
        await page.waitForURL('/dashboard/customers');
        // Verify customer exists in list
        await expect(page.getByRole('cell', { name: customerName })).toBeVisible();

        // --- STEP 2: CREATE VEHICLE ---
        await page.goto('/dashboard/inventory/new');

        await page.getByLabel('Year').fill('2024');
        await page.getByLabel('Make').fill('TestMake');
        await page.getByLabel('Model').fill(modelName);
        await page.getByLabel('Selling Price').fill(salePrice);
        await page.getByLabel('VIN').fill(vin);
        // Assuming other fields are optional or have defaults.
        // Based on vehicle-form.tsx, required fields are Year, Make, Model, Price, VIN, Type, Status, Color.
        // Wait, need to check required fields in VehicleForm if this fails.
        // Assuming defaults or just filling minimal required.
        // Checking vehicle-form.tsx...
        // Status defaults to 'in_stock'. Fill basic fields for consistency.
        await page.getByLabel('Body Type').fill('Sedan');
        await page.getByLabel('Color').fill('Black');
        await page.getByLabel('Mileage').fill('0');
        await page.getByLabel('Cost Price').fill('40000');

        // Wait for status select to be visible just in case
        // await page.getByLabel('Status').selectOption('in_stock'); // Default is usually in_stock

        await page.getByRole('button', { name: 'Create Vehicle' }).click();

        // Verify redirection to inventory (and toast, but we skip toast check to be safe as per inventory.spec.ts)
        await page.waitForURL('/dashboard/inventory');
        // Verify vehicle exists
        await expect(page.getByRole('cell', { name: modelName })).toBeVisible();

        // --- STEP 3: CREATE SALE ---
        await page.goto('/dashboard/sales/new');

        // Select Customer
        // The Select component in Shadcn is tricky with Playwright.
        // We trigger the select, then click the option.

        // Customer Select
        // The label is "Customer", usually associated with a button (SelectTrigger)
        // We can click the trigger directly.
        // Finding the trigger: it usually has role 'combobox' or we click the label.
        // Let's try locating by label.
        // The label points to the hidden select? No, Shadcn uses a button.
        // Let's verify CustomerForm again... no, NewSalePage uses standard Select.
        // <Select name="customerId"> <SelectTrigger>...</SelectTrigger> ...
        // <Label htmlFor="customerId">Customer</Label>

        await page.getByText('Select customer', { exact: true }).click();
        // Wait for dropdown content
        // Filter by the text we want
        await page.getByRole('option', { name: customerName }).click();

        // Vehicle Select
        await page.getByText('Select vehicle', { exact: true }).click();
        // The option format: "{v.year} {v.make} {v.model} - ${price}"
        // We match partial text "2024 TestMake SaleModel..."
        await page.getByRole('option', { name: modelName }).click();

        // Sale Price
        await page.getByLabel('Sale Price').fill(salePrice);

        // Payment Method (default is bank_transfer, but let's ensure it's selected)
        await page.getByText('Select payment method').click();
        await page.getByRole('option', { name: 'Bank Transfer' }).click();

        // Date (default is today, leave it)

        // Submit
        await page.getByRole('button', { name: 'Complete Sale' }).click();

        // --- STEP 4: VERIFY SALE ---
        await page.waitForURL('/dashboard/sales');

        // Verify sale row appears
        // Row should contain Date, Vehicle, Customer, Price
        // Vehicle cell has: "2024 TestMake SaleModel..."
        // Customer cell has: customerName

        const customerCell = page.getByRole('cell', { name: customerName });
        await expect(customerCell).toBeVisible();

        const vehicleCell = page.getByRole('cell', { name: modelName });
        await expect(vehicleCell).toBeVisible();

        // Ensure status is Sold in inventory?
        // Optional validation: check inventory page
        await page.goto('/dashboard/inventory');
        // Vehicle should define status.
        // Ideally we filter or check the status badge.
        // Let's just trust the sale record for now.
    });
});
