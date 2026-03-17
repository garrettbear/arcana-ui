import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  snapshotDir: './tests/visual/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}-{projectName}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 60_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,
    },
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        viewport: { width: 320, height: 568 },
      },
    },
    {
      name: 'mobile-lg',
      use: {
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'wide',
      use: {
        viewport: { width: 1536, height: 864 },
      },
    },
  ],
  webServer: {
    command: 'pnpm --filter playground dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
