import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Every user-facing page is scanned in both themes. Both themes are seeded
// explicitly via next-themes' localStorage key before load, so this spec
// stays correct regardless of the app's default theme. RSC content is
// state-dependent (dummy-cred fallbacks under the Playwright web server) —
// the scan covers whatever renders, which is the correct surface.
const PAGE_PATHS = ['/', '/yak2peak', '/about', '/covers'] as const

for (const path of PAGE_PATHS) {
  test(`has no axe violations on ${path} in light theme`, async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('theme', 'light'))
    await page.goto(path)
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })

  test(`has no axe violations on ${path} in dark theme`, async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('theme', 'dark'))
    await page.goto(path)
    await expect(page.locator('html')).toHaveClass(/dark/)

    const results = await new AxeBuilder({ page }).analyze()

    expect(results.violations).toEqual([])
  })
}
