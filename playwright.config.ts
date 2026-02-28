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
    ['junit', { outputFile: 'results.xml' }]
  ],

  use: {
    baseURL: appConfig.baseUrl,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Default launch options (Chromium & Firefox override below)
    launchOptions: {},

    viewport: { width: 1440, height: 900 },

    navigationTimeout: 30000,
    actionTimeout: 15000,

    expect: {
      timeout: 10000
    },

    ignoreHTTPSErrors: true,
    testIdAttribute: 'data-testid'
  },

  // Cross-browser matrix
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-notifications']   // Supported
        }
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: ['--disable-notifications']   // Supported
        }
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    }
  ],

  outputDir: 'test-results/'
});