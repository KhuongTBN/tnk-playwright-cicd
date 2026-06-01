import { test, expect } from '@playwright/test';

test.describe('Playwright.dev - Portfolio Tests', () => {

  test('homepage loads correctly', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('documentation page accessible', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('API reference page loads', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/api/class-page');
    await expect(page).toHaveTitle(/Page/);
  });

});