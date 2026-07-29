import { defineConfig, devices } from '@playwright/test'

// Port is configurable so concurrent sessions can run e2e on a fresh port without
// reusing another session's dev server. `next dev` reads PORT from the env itself.
// E2E_BASE_URL overrides both, so the compliance spec can run against the live
// deployment (W6 production sweep) instead of a local server.
const PORT = process.env.PORT ?? '3000'
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    timezoneId: 'America/New_York',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID ?? 'playwright-twitch-id',
      TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET ?? 'playwright-twitch-secret',
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ?? 'playwright-youtube-key',
      YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID ?? 'UCplaywrightplaywright00',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? BASE_URL,
    },
  },
})
