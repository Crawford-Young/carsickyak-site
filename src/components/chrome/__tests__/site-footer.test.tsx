import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { SiteFooter } from '@/components/chrome/site-footer'
import { copy } from '@/lib/copy'

const SOCIALS: readonly (readonly [string, string])[] = [
  ['twitch', 'https://twitch.tv/carsickyak'],
  ['youtube', 'https://www.youtube.com/@CarsickYak'],
  ['instagram', 'https://www.instagram.com/carsickyak/'],
  ['tiktok', 'https://www.tiktok.com/@carsick_yak'],
  ['threads', 'https://www.threads.net/@carsickyak'],
  ['x', 'https://x.com/CarsickYak'],
]

describe('SiteFooter', () => {
  it('renders all six social links with accessible names and correct hrefs', () => {
    render(<SiteFooter />)

    for (const [name, href] of SOCIALS) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('opens social links safely in a new tab', () => {
    render(<SiteFooter />)

    const twitch = screen.getByRole('link', { name: 'twitch' })
    expect(twitch).toHaveAttribute('target', '_blank')
    expect(twitch).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('labels the socials row with the gated heading copy', () => {
    render(<SiteFooter />)

    expect(screen.getByText(copy.sections.socials)).toBeInTheDocument()
  })

  it('renders the persona attribution link to the portfolio', () => {
    render(<SiteFooter />)

    const persona = screen.getByRole('link', { name: copy.footer.attribution })
    expect(persona).toHaveAttribute('href', 'https://crawfordyoung.dev')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<SiteFooter />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
