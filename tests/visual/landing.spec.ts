import { type Page, expect, test } from '@playwright/test';
import { waitForPlaygroundReady } from './helpers';

/**
 * Inject a global stylesheet that neutralises CSS animations and
 * transitions so the landing page's reveal motion primitives
 * (FadeIn, Stagger, CountUp, GradientBorder) settle into their final
 * state before a snapshot is captured. The `-999s` delay forces any
 * in-flight animation past its keyframes; the `0.001ms` duration
 * keeps newly started animations from blocking the rAF loop.
 *
 * Kept in this spec — not the shared `helpers.ts` — because most
 * existing visual tests rely on transient styles being visible and
 * do not want them flattened.
 */
async function freezeAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: -999s !important;
        animation-duration: 0.001ms !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });
}

test.describe('Landing page — motion snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    await freezeAnimations(page);
    // Allow IntersectionObserver + rAF callbacks to resolve with the
    // neutralised timings applied.
    await page.waitForTimeout(150);
  });

  test('landing full page', async ({ page }) => {
    await expect(page).toHaveScreenshot('landing-full.png', { fullPage: true });
  });

  test('landing hero section', async ({ page }) => {
    const hero = page.locator('[class*="hero"]').first();
    await expect(hero).toHaveScreenshot('landing-hero.png');
  });
});
