import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { pathnameMock } = vi.hoisted(() => ({ pathnameMock: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock(),
}))

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}))

import { SiteNav } from '@/components/chrome/site-nav'

beforeEach(() => {
  vi.clearAllMocks()
  pathnameMock.mockReturnValue('/')
})

describe('SiteNav', () => {
  it('renders all four primary nav links with their routes', () => {
    render(<SiteNav />)

    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'yak2peak' })).toHaveAttribute('href', '/yak2peak')
    expect(screen.getByRole('link', { name: 'about' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'covers' })).toHaveAttribute('href', '/covers')
  })

  it('marks the home link current when on the home route', () => {
    pathnameMock.mockReturnValue('/')

    render(<SiteNav />)

    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'yak2peak' })).not.toHaveAttribute('aria-current')
  })

  it('marks a section link current when on that section route', () => {
    pathnameMock.mockReturnValue('/yak2peak')

    render(<SiteNav />)

    expect(screen.getByRole('link', { name: 'yak2peak' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'home' })).not.toHaveAttribute('aria-current')
  })

  it('marks a section link current when on a nested route under it', () => {
    pathnameMock.mockReturnValue('/yak2peak/season-1')

    render(<SiteNav />)

    expect(screen.getByRole('link', { name: 'yak2peak' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders the brand lockup linking home and the theme toggle', () => {
    render(<SiteNav />)

    expect(screen.getByRole('link', { name: /carsickyak/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<SiteNav />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
