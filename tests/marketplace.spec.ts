import { test, expect } from '@playwright/test';

test.describe('Marketplace E2E Tests - Portfolio', () => {

    test.describe('Login Flow', () => {
        test('successful login', async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            await page.getByPlaceholder('Username').fill('standard_user');
            await page.getByPlaceholder('Password').fill('secret_sauce');
            await page.getByRole('button', { name: 'Login' }).click();
            await expect(page.locator('.title')).toHaveText('Products');
        });

        test('locked user shows error', async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            await page.getByPlaceholder('Username').fill('locked_out_user');
            await page.getByPlaceholder('Password').fill('secret_sauce');
            await page.getByRole('button', { name: 'Login' }).click();
            await expect(page.locator('[data-test="error"]'))
                .toContainText('Sorry, this user has been locked out');
        });
    });

    test.describe('Product Browsing', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            await page.getByPlaceholder('Username').fill('standard_user');
            await page.getByPlaceholder('Password').fill('secret_sauce');
            await page.getByRole('button', { name: 'Login' }).click();
        });

        test('products list displays', async ({ page }) => {
            await expect(page.locator('.inventory_item')).toHaveCount(6);
        });

        test('sort by price low to high - solution 1', async ({ page }) => {
            await page.locator('[data-test="product-sort-container"]')
                .selectOption('lohi');

            const prices = await page.locator('.inventory_item_price')
                .allTextContents();
            console.log('Raw prices:', prices);
            // Attach data vào HTML report
            await test.info().attach('Raw Prices', {
                body: JSON.stringify(prices, null, 2),
                contentType: 'application/json'
            });

            const numPrices = prices.map(p => parseFloat(p.replace('$', '')));
            console.log('Numeric prices:', numPrices);

            for (let i = 1; i < numPrices.length; i++) {
                console.log(`Compare: ${numPrices[i]} >= ${numPrices[i - 1]} = ${numPrices[i] >= numPrices[i - 1]}`);
                expect(numPrices[i]).toBeGreaterThanOrEqual(numPrices[i - 1]);
            }
        });

        test('sort by price low to high - solution 2', async ({ page }) => {
            await page.locator('[data-test="product-sort-container"]')
                .selectOption('lohi');

            const prices = await page.locator('.inventory_item_price')
                .allTextContents();
            const numPrices = prices.map(p => parseFloat(p.replace('$', '')));

            // Clone rồi sort
            const sorted = [...numPrices].sort((a, b) => a - b);

            // So sánh 2 arrays
            expect(numPrices).toEqual(sorted);
        });

        test('add to cart and verify badge', async ({ page }) => {
            await page.locator('.inventory_item').first()
                .getByRole('button', { name: 'Add to cart' }).click();
            await expect(page.locator('.shopping_cart_badge'))
                .toHaveText('1');
        });
    });

    test.describe('Shopping Cart', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            await page.getByPlaceholder('Username').fill('standard_user');
            await page.getByPlaceholder('Password').fill('secret_sauce');
            await page.getByRole('button', { name: 'Login' }).click();
        });

        test('complete checkout flow', async ({ page }) => {
            await page.locator('.inventory_item').first()
                .getByRole('button', { name: 'Add to cart' }).click();
            await page.locator('.shopping_cart_link').click();
            await expect(page.locator('.cart_item')).toHaveCount(1);

            await page.getByRole('button', { name: 'Checkout' }).click();
            await page.getByPlaceholder('First Name').fill('Khuong');
            await page.getByPlaceholder('Last Name').fill('Tran');
            await page.getByPlaceholder('Zip/Postal Code').fill('700000');
            await page.getByRole('button', { name: 'Continue' }).click();

            await expect(page.locator('.summary_total_label')).toBeVisible();
            await page.getByRole('button', { name: 'Finish' }).click();
            await expect(page.getByText('Thank you for your order!'))
                .toBeVisible();
        });
    });

    test.describe('Responsive Testing', () => {
        test('desktop layout shows all products', async ({ page }) => {
            await page.goto('https://www.saucedemo.com/');
            await page.getByPlaceholder('Username').fill('standard_user');
            await page.getByPlaceholder('Password').fill('secret_sauce');
            await page.getByRole('button', { name: 'Login' }).click();
            await expect(page.locator('.inventory_item')).toHaveCount(6);
        });
    });
});