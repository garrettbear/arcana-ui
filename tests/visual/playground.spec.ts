import { expect, test } from '@playwright/test';
import { setDensity, switchTheme, waitForPlaygroundReady } from './helpers';

// ---------------------------------------------------------------------------
// Full-page captures — light & dark themes at all 5 breakpoints
// ---------------------------------------------------------------------------

test.describe('Full page — Light theme', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
  });

  test('light default', async ({ page }) => {
    await expect(page).toHaveScreenshot('playground-light-default.png');
  });
});

test.describe('Full page — Dark theme', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    await switchTheme(page, 'dark');
  });

  test('dark default', async ({ page }) => {
    await expect(page).toHaveScreenshot('playground-dark-default.png');
  });
});

// ---------------------------------------------------------------------------
// Component section captures — light & dark at all breakpoints
// ---------------------------------------------------------------------------

test.describe('Components section — Light', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    // Navigate to Components section
    const navBtn = page.locator('button', { hasText: 'Components' });
    if (await navBtn.isVisible()) {
      await navBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('buttons', async ({ page }) => {
    const heading = page.locator('text=Buttons').first();
    if (await heading.isVisible()) {
      await heading.scrollIntoViewIfNeeded();
    }
    await expect(page).toHaveScreenshot('components-buttons-light.png');
  });

  test('tabs', async ({ page }) => {
    const heading = page.locator('text=Tabs').first();
    if (await heading.isVisible()) {
      await heading.scrollIntoViewIfNeeded();
    }
    await expect(page).toHaveScreenshot('components-tabs-light.png');
  });

  test('modal area', async ({ page }) => {
    const heading = page.locator('text=Modal').first();
    if (await heading.isVisible()) {
      await heading.scrollIntoViewIfNeeded();
    }
    await expect(page).toHaveScreenshot('components-modal-light.png');
  });
});

test.describe('Components section — Dark', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    await switchTheme(page, 'dark');
    const navBtn = page.locator('button', { hasText: 'Components' });
    if (await navBtn.isVisible()) {
      await navBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('buttons', async ({ page }) => {
    const heading = page.locator('text=Buttons').first();
    if (await heading.isVisible()) {
      await heading.scrollIntoViewIfNeeded();
    }
    await expect(page).toHaveScreenshot('components-buttons-dark.png');
  });

  test('tabs', async ({ page }) => {
    const heading = page.locator('text=Tabs').first();
    if (await heading.isVisible()) {
      await heading.scrollIntoViewIfNeeded();
    }
    await expect(page).toHaveScreenshot('components-tabs-dark.png');
  });
});

// ---------------------------------------------------------------------------
// Data & Tables section — responsive table layout
// ---------------------------------------------------------------------------

test.describe('Data section — Light', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    const navBtn = page.locator('button', { hasText: 'Data' });
    if (await navBtn.isVisible()) {
      await navBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('table', async ({ page }) => {
    await expect(page).toHaveScreenshot('data-table-light.png');
  });
});

test.describe('Data section — Dark', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    await switchTheme(page, 'dark');
    const navBtn = page.locator('button', { hasText: 'Data' });
    if (await navBtn.isVisible()) {
      await navBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('table', async ({ page }) => {
    await expect(page).toHaveScreenshot('data-table-dark.png');
  });
});

// ---------------------------------------------------------------------------
// Forms section — responsive form layout
// ---------------------------------------------------------------------------

test.describe('Forms section — Light', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    const navBtn = page.locator('button', { hasText: 'Forms' });
    if (await navBtn.isVisible()) {
      await navBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('forms and cards', async ({ page }) => {
    await expect(page).toHaveScreenshot('forms-cards-light.png');
  });
});

// ---------------------------------------------------------------------------
// Layout section — grid responsive behavior
// ---------------------------------------------------------------------------

test.describe('Layout section — Light', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    const navBtn = page.locator('button', { hasText: 'Layout' });
    if (await navBtn.isVisible()) {
      await navBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('grid layout', async ({ page }) => {
    await expect(page).toHaveScreenshot('layout-grid-light.png');
  });
});

// ---------------------------------------------------------------------------
// Density modes — desktop only (where density differences are most visible)
// ---------------------------------------------------------------------------

test.describe('Density modes — Desktop', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.name.includes('desktop'),
      'Density tests run only at desktop viewport',
    );
    await waitForPlaygroundReady(page);
  });

  test('compact density', async ({ page }) => {
    await setDensity(page, 'compact');
    await expect(page).toHaveScreenshot('density-compact-desktop.png');
  });

  test('comfortable density', async ({ page }) => {
    await setDensity(page, 'comfortable');
    await expect(page).toHaveScreenshot('density-comfortable-desktop.png');
  });
});
