import type { MetadataRoute } from 'next'

export const SITE_URL = 'https://carsickyak.crawfordyoung.dev'

export const STATIC_ROUTES: readonly string[] = ['/', '/about', '/covers', '/yak2peak', '/privacy']

export function siteRoutes(): readonly string[] {
  return STATIC_ROUTES
}

export function buildSitemap(lastModified: Date): MetadataRoute.Sitemap {
  return siteRoutes().map((route) => ({
    url: route === '/' ? SITE_URL : `${SITE_URL}${route}`,
    lastModified,
  }))
}
