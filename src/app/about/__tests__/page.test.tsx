import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { copy } from '@/lib/copy'

import AboutPage, { metadata } from '@/app/about/page'

const MIN_MEANINGFUL_ALT_LENGTH = 10

describe('AboutPage', () => {
  it('renders the bio block with the canonical tagline and bio line', () => {
    render(<AboutPage />)

    expect(screen.getByRole('heading', { level: 1, name: copy.about.bio.name })).toBeInTheDocument()
    expect(screen.getByText(copy.about.bio.tagline)).toBeInTheDocument()
    expect(screen.getByText(copy.about.bio.line)).toBeInTheDocument()
  })

  it('renders the philosophy line', () => {
    render(<AboutPage />)

    expect(screen.getByText(copy.about.philosophy)).toBeInTheDocument()
  })

  it('renders the Camus pull-quote as a serif blockquote with attribution', () => {
    render(<AboutPage />)

    const quote = screen.getByText(copy.about.quote.text)
    const blockquote = quote.closest('blockquote')
    expect(blockquote).not.toBeNull()
    expect(blockquote).toHaveClass('font-serif')
    expect(screen.getByText(copy.about.quote.attribution)).toBeInTheDocument()
  })

  it('renders both halves of the split — ranked arc and folk outdoorsman', () => {
    render(<AboutPage />)

    expect(screen.getByRole('heading', { name: copy.about.ranked.heading })).toBeInTheDocument()
    expect(screen.getByText(copy.about.ranked.body)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: copy.about.folk.heading })).toBeInTheDocument()
    expect(screen.getByText(copy.about.folk.body)).toBeInTheDocument()
  })

  it('renders the photo band with meaningful, specific alt text', () => {
    render(<AboutPage />)

    const forest = screen.getByAltText(/forest/i)
    const tent = screen.getByAltText(/tent/i)
    const storm = screen.getByAltText(/storm/i)

    for (const image of [forest, tent, storm]) {
      expect(image).toBeInTheDocument()
      expect(image.getAttribute('alt')?.length ?? 0).toBeGreaterThan(MIN_MEANINGFUL_ALT_LENGTH)
    }
  })

  it('exposes page metadata from the gated copy source', () => {
    expect(metadata.title).toBe(copy.about.pageTitle)
    expect(metadata.description).toBe(copy.meta.about)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<AboutPage />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
