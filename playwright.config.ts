import { defineConfig, devices } from '@playwright/test';
import { appConfig } from './config/app.config';

export default defineConfig({
  testDir: './tests',

  // Global test timeout (per test)
  timeout: 45_000,

  // Parallel execution for speed
  fullyParallel: true,

  // Retries for stability (more in CI)
  retries: process.env.CI ? 2 : 1,

  // Workers (more in CI, fewer locally)
  workers: process.env.CI ? 4 : 2,

  // Reporting
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['line'],
    ['junit', { outputFile: 'results.xml' }] // CI-friendly
  ],

  use: {
    // Base URL from config
    baseURL: appConfig.baseUrl,

    // Stability tools
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Disable browser notifications
    launchOptions: {
      args: ['--disable-notifications']
    },

    // Consistent viewport
    viewport: { width: 1440, height: 900 },

    // Timeouts
    navigationTimeout: 30000,
    actionTimeout: 15000,

    // Web-first assertion timeout
    expect: {
      timeout: 10000
    },

    // Test isolation
    ignoreHTTPSErrors: true,

    // Optional: consistent testId usage
    testIdAttribute: 'data-testid'
  },

  // Cross-browser matrix
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],

  // Where to store traces, screenshots, videos
  outputDir: 'test-results/'
});