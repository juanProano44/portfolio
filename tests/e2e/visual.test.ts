import { test, expect } from '@playwright/test';

test.describe('Visual regression', () => {
  test('EN page - light theme - desktop', async ({ page }) => {
    await page.goto('/en/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      sessionStorage.setItem('intro-seen', '1');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('en-light-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('EN page - dark theme - desktop', async ({ page }) => {
    await page.goto('/en/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      sessionStorage.setItem('intro-seen', '1');
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('en-dark-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('ES page - light theme - desktop', async ({ page }) => {
    await page.goto('/es/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      sessionStorage.setItem('intro-seen', '1');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('es-light-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
