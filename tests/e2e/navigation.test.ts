import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('EN page renders all frames', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.locator('#identity')).toBeVisible();
    await expect(page.locator('#work')).toBeAttached();
    await expect(page.locator('#stack')).toBeAttached();
    await expect(page.locator('#experience')).toBeAttached();
    await expect(page.locator('#lab')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('ES page renders all frames', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.locator('#identity')).toBeVisible();
    await expect(page.locator('#work')).toBeAttached();
  });

  test('language switch works', async ({ page }) => {
    await page.goto('/en/');
    await page.click('.lang-switch');
    await expect(page).toHaveURL(/\/es\//);
  });

  test('root redirects to English', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\//);
  });

  test('contact email copy button exists', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('[data-copy-email]')).toBeAttached();
  });

  test('header navigation links exist', async ({ page }) => {
    await page.goto('/en/');
    const navLinks = page.locator('.nav-link');
    await expect(navLinks).toHaveCount(6);
  });
});
