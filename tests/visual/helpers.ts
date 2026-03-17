import type { Page } from '@playwright/test';

/**
 * Switch the playground theme by setting the data-theme attribute.
 */
export async function switchTheme(page: Page, theme: string): Promise<void> {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  // Allow CSS transitions to settle
  await page.waitForTimeout(300);
}

/**
 * Set the density mode by setting the data-density attribute.
 */
export async function setDensity(page: Page, density: string): Promise<void> {
  await page.evaluate((d) => {
    document.documentElement.setAttribute('data-density', d);
  }, density);
  await page.waitForTimeout(200);
}

/**
 * Navigate to a specific playground section by clicking the nav link.
 */
export async function navigateToSection(page: Page, sectionId: string): Promise<void> {
  const navButton = page.locator(`button[class*="navLink"]`, { hasText: sectionId });
  if (await navButton.isVisible()) {
    await navButton.click();
    await page.waitForTimeout(200);
  }
}

/**
 * Wait for the playground to fully load (fonts, images, etc.)
 */
export async function waitForPlaygroundReady(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
}
