import { defineConfig, devices } from '@playwright/test';

// Uses an installed browser channel so no extra browser download is needed.
// Windows: Microsoft Edge (default). Elsewhere set PW_CHANNEL=chrome, or run
// `npx playwright install chromium` and set PW_CHANNEL=chromium.
const channel = process.env.PW_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : 'chromium');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    ...(channel === 'chromium' ? {} : { channel }),
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, ...(channel === 'chromium' ? {} : { channel }) } }],
  webServer: {
    command: 'npx vite build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
