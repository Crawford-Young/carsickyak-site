import { expect, test } from '@playwright/test'

import { copy } from '@/lib/copy'

const POLL_INTERVAL_MS = 60_000
const POLL_ADVANCE_MS = POLL_INTERVAL_MS + 1_000

test('GET /api/live responds 200 with a LiveStatus payload', async ({ request }) => {
  const res = await request.get('/api/live')

  expect(res.status()).toBe(200)
  const body: unknown = await res.json()
  expect(body).toMatchObject({ live: expect.any(Boolean) })
})

test('the badge renders a live-or-offline state on first paint', async ({ page }) => {
  await page.goto('/')

  // State-agnostic: the server-rendered badge shows one of the two labels
  // depending on real live status, which the spec cannot control.
  await expect(
    page.getByText(copy.live.liveLabel).or(page.getByText(copy.live.offlineLabel)),
  ).toBeVisible()
})

// /api/live is the client polling island's endpoint — the only route this suite
// mocks. Server-side RSC fetches are unreachable by page.route, so the initial
// paint stays un-mocked; only the poll-driven flip is driven here.
test('polls /api/live and flips to the live label', async ({ page }) => {
  await page.clock.install()
  await page.route('**/api/live', async (route) => {
    await route.fulfill({
      json: {
        live: true,
        title: 'Live now',
        gameName: 'Just Chatting',
        startedAt: '2026-07-24T10:00:00Z',
      },
    })
  })

  await page.goto('/')
  // Wait for the island to hydrate (offline is the deterministic dummy-cred
  // initial state) so its poll interval is registered before the clock advances.
  await expect(page.getByText(copy.live.offlineLabel)).toBeVisible()
  await page.clock.runFor(POLL_ADVANCE_MS)

  await expect(page.getByText(copy.live.liveLabel).first()).toBeVisible()
})
