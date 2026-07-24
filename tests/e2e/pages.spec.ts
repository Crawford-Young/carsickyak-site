import { expect, test } from '@playwright/test'

import { copy } from '@/lib/copy'

interface PageCase {
  readonly path: string
  readonly heading: string
}

// User-facing strings are imported from the gated copy source — never hardcoded
// in the spec — so a copy rerun updates the assertion in one place.
const PAGES: readonly PageCase[] = [
  { path: '/', heading: copy.hero.headline },
  { path: '/yak2peak', heading: copy.yak2peakLadder.pageTitle },
  { path: '/about', heading: copy.about.bio.name },
  { path: '/covers', heading: copy.covers.pageTitle },
]

for (const { path, heading } of PAGES) {
  test(`renders the level-1 heading on ${path}`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
  })
}

interface NavStep {
  readonly label: string
  readonly path: string
  readonly heading: string
}

const NAV_ROUNDTRIP: readonly NavStep[] = [
  { label: 'yak2peak', path: '/yak2peak', heading: copy.yak2peakLadder.pageTitle },
  { label: 'about', path: '/about', heading: copy.about.bio.name },
  { label: 'covers', path: '/covers', heading: copy.covers.pageTitle },
  { label: 'home', path: '/', heading: copy.hero.headline },
]

test('roundtrips through every primary nav link', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation')

  for (const { label, path, heading } of NAV_ROUNDTRIP) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(path)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
  }
})
