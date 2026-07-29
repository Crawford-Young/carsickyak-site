import { expect, test } from '@playwright/test'

import { SITE_URL } from '@/lib/site-routes'

const PUBLISHER_LINE = 'google.com, pub-4628379278051632, DIRECT, f08c47fec0942fa0'

test('ads.txt serves the publisher line as plain text', async ({ request }) => {
  const response = await request.get('/ads.txt')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  expect(await response.text()).toContain(PUBLISHER_LINE)
})

test('robots.txt is served and references the sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('Sitemap:')
})

test('sitemap.xml is served and lists the privacy page', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('/privacy')
})

test('privacy page is reachable', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { name: /privacy policy/i, level: 1 })).toBeVisible()
})

test('the privacy page is reachable from the footer, not just by url', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('contentinfo').getByRole('link', { name: 'privacy', exact: true }).click()
  await expect(page).toHaveURL('/privacy')
})

// Vercel held NEXT_PUBLIC_APP_URL=http://localhost:3000 in production, so every
// deployed page advertised og:url http://localhost:3000 — invisible to every
// gate, since locally that value is correct. metadataBase is pinned to SITE_URL
// for the same reason the sitemap is; this asserts it can never regress to a
// localhost origin.
test('canonical metadata advertises the production origin, not localhost', async ({ page }) => {
  await page.goto('/')
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
  expect(ogUrl).toBe(SITE_URL)
})

test('unknown paths return a real 404 status', async ({ request }) => {
  expect((await request.get('/definitely-not-a-real-page')).status()).toBe(404)
})
