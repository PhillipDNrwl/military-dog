// e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset }           from '@nx/playwright/preset';
import { workspaceRoot }         from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

export default defineConfig({
  // relative to this file (e2e/), so it will scan e2e/src
  ...nxE2EPreset(__filename, { testDir: './src' }),

  use: {
    baseURL,
    trace: 'on-first-retry',
    headless: true,
  },

  webServer: {
    command: 'npx nx run military-dog:serve',
    url:     baseURL,
    reuseExistingServer: true,
    cwd:     workspaceRoot,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
