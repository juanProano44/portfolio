import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('English page has no a11y violations', async ({ page }) => {
    await page.goto('/en/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Spanish page has no a11y violations', async ({ page }) => {
    await page.goto('/es/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('404 page has no a11y violations', async ({ page }) => {
    await page.goto('/nonexistent-page/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('skip link is first focusable element', async ({ page }) => {
    await page.goto('/en/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.className);
    expect(focused).toContain('skip');
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/en/');
    const initialTheme = await page.getAttribute('html', 'data-theme');
    await page.click('[data-theme-toggle]');
    const newTheme = await page.getAttribute('html', 'data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });
});
