import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Hero } from '@/components/home/hero'
import { copy } from '@/lib/copy'

describe('Hero', () => {
  it('renders the gated headline as the page heading', () => {
    render(<Hero />)

    expect(screen.getByRole('heading', { level: 1, name: copy.hero.headline })).toBeInTheDocument()
  })

  it('renders the gated subline beneath the hero', () => {
    render(<Hero />)

    expect(screen.getByText(copy.hero.subline)).toBeInTheDocument()
  })

  it('renders the ridgeline hero photo eagerly (priority, never lazy)', () => {
    const { container } = render(<Hero />)

    const photo = container.querySelector('img[src*="cy-photo-ridgeline-sunrise"]')
    expect(photo).not.toBeNull()
    expect(photo).not.toHaveAttribute('loading', 'lazy')
  })

  it('overlays a scrim between the photo and the foreground text', () => {
    const { container } = render(<Hero />)

    expect(container.querySelector('.bg-black\\/60')).not.toBeNull()
  })

  it('renders the light brand lockup', () => {
    render(<Hero />)

    expect(screen.getByAltText('CarsickYak')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Hero />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
