import { describe, it, expect } from 'vitest'
import { SITE_URL, siteRoutes, buildSitemap } from '@/lib/site-routes'

describe('site-routes', () => {
  it('points at the carsickyak subdomain', () => {
    expect(SITE_URL).toBe('https://carsickyak.crawfordyoung.dev')
  })

  it('lists every public route', () => {
    expect(siteRoutes()).toEqual(['/', '/about', '/covers', '/yak2peak', '/privacy'])
  })

  it('builds absolute urls with no trailing slash on the root', () => {
    const now = new Date('2026-07-28T00:00:00.000Z')
    const entries = buildSitemap(now)
    expect(entries[0]).toEqual({ url: 'https://carsickyak.crawfordyoung.dev', lastModified: now })
    expect(entries).toHaveLength(5)
    for (const entry of entries) {
      expect(entry.url.startsWith('https://carsickyak.crawfordyoung.dev')).toBe(true)
      expect(entry.url.endsWith('/')).toBe(false)
    }
  })
})
