import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'
import { SiteFooter } from '@/components/chrome/site-footer'
import { SiteNav } from '@/components/chrome/site-nav'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { copy } from '@/lib/copy'
import { env } from '@/env'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-serif',
  subsets: ['latin'],
})

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: 'CarsickYak',
    template: '%s · CarsickYak',
  },
  description: copy.meta.home,
  openGraph: {
    title: 'CarsickYak',
    description: copy.meta.home,
    url: '/',
    siteName: 'CarsickYak',
    images: ['/og.png'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetBrainsMono.variable} theme-carsickyak h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SiteNav />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
