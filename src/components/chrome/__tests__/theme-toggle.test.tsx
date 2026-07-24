import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { useThemeMock, setThemeMock } = vi.hoisted(() => ({
  useThemeMock: vi.fn(),
  setThemeMock: vi.fn(),
}))

vi.mock('next-themes', () => ({
  useTheme: () => useThemeMock(),
}))

import { ThemeToggle } from '@/components/chrome/theme-toggle'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ThemeToggle', () => {
  it('switches to dark when the resolved theme is light', async () => {
    useThemeMock.mockReturnValue({ resolvedTheme: 'light', setTheme: setThemeMock })
    const user = userEvent.setup()

    render(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: /theme/i }))

    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })

  it('switches to light when the resolved theme is dark', async () => {
    useThemeMock.mockReturnValue({ resolvedTheme: 'dark', setTheme: setThemeMock })
    const user = userEvent.setup()

    render(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: /theme/i }))

    expect(setThemeMock).toHaveBeenCalledWith('light')
  })

  it('has no accessibility violations', async () => {
    useThemeMock.mockReturnValue({ resolvedTheme: 'light', setTheme: setThemeMock })

    const { container } = render(<ThemeToggle />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
