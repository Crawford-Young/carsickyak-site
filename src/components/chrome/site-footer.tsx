import Image from 'next/image'
import Link from 'next/link'

import { copy } from '@/lib/copy'
import { TWITCH_CHANNEL_URL, YOUTUBE_CHANNEL_URL } from '@/lib/links'
import { Separator } from '@/lib/ui'

const WATERMARK_SIZE_PX = 64
const PORTFOLIO_URL = 'https://crawfordyoung.dev'

interface SocialLink {
  readonly label: string
  readonly href: string
}

const SOCIALS: readonly SocialLink[] = [
  { label: 'twitch', href: TWITCH_CHANNEL_URL },
  { label: 'youtube', href: YOUTUBE_CHANNEL_URL },
  { label: 'instagram', href: 'https://www.instagram.com/carsickyak/' },
  { label: 'tiktok', href: 'https://www.tiktok.com/@carsick_yak' },
  { label: 'threads', href: 'https://www.threads.net/@carsickyak' },
  { label: 'x', href: 'https://x.com/CarsickYak' },
]

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-border/60 mt-24 border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-14 text-center">
        <nav aria-label={copy.sections.socials} className="flex flex-col items-center gap-3">
          <h2 className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
            {copy.sections.socials}
          </h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  {social.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Image
          src="/brand/cy-mark-mono-dark.svg"
          alt=""
          width={WATERMARK_SIZE_PX}
          height={WATERMARK_SIZE_PX}
          className="opacity-10 dark:hidden"
        />
        <Image
          src="/brand/cy-mark-mono-light.svg"
          alt=""
          width={WATERMARK_SIZE_PX}
          height={WATERMARK_SIZE_PX}
          className="hidden opacity-10 dark:block"
        />

        <Separator className="max-w-xs" />

        {/*
          The privacy link sits in this paragraph rather than its own <nav>: a
          second navigation landmark in one footer is an axe smell and breaks
          strict-mode getByRole('navigation') in the e2e suite.
        */}
        <p className="text-muted-foreground flex items-center gap-4 text-sm">
          <Link
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {copy.footer.attribution}
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground underline-offset-4 transition-colors hover:underline"
          >
            {copy.footer.privacyLabel}
          </Link>
        </p>
      </div>
    </footer>
  )
}
