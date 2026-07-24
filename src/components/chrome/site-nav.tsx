'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ThemeToggle } from '@/components/chrome/theme-toggle'

const MARK_SIZE_PX = 28

interface NavLink {
  readonly href: string
  readonly label: string
}

// Structural route labels (not gated yak-voice copy) — every page reachable
// from the nav per the new-page-surface rule.
const NAV_LINKS: readonly NavLink[] = [
  { href: '/', label: 'home' },
  { href: '/yak2peak', label: 'yak2peak' },
  { href: '/about', label: 'about' },
  { href: '/covers', label: 'covers' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav(): React.JSX.Element {
  const pathname = usePathname()

  return (
    <header className="bg-background/70 border-border/60 sticky top-0 z-40 border-b backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/cy-mark-mono-dark.svg"
            alt=""
            width={MARK_SIZE_PX}
            height={MARK_SIZE_PX}
            className="dark:hidden"
          />
          <Image
            src="/brand/cy-mark-mono-light.svg"
            alt=""
            width={MARK_SIZE_PX}
            height={MARK_SIZE_PX}
            className="hidden dark:block"
          />
          <span className="font-serif text-lg font-semibold tracking-tight">CarsickYak</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'text-foreground rounded-md px-3 py-2 text-sm font-medium'
                        : 'text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors'
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
