import { expect, test } from '@playwright/test'

import { copy } from '@/lib/copy'

test('home page renders the hero headline', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: copy.hero.headline })).toBeVisible()
})
