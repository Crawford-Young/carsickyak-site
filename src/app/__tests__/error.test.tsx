import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

interface FallbackProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
  readonly homeHref?: string
}

// Mock the library fallback so the test asserts the DATA props the boundary
// wires in (error message, reset, homeHref), not just component identity.
vi.mock('@/lib/ui', () => ({
  RouteErrorFallback: ({ error, reset, homeHref }: FallbackProps) => (
    <div>
      <p data-testid="error-message">{error.message}</p>
      {homeHref !== undefined ? (
        <a data-testid="home-href" href={homeHref}>
          home
        </a>
      ) : null}
      <button type="button" onClick={reset}>
        retry
      </button>
    </div>
  ),
}))

import AppError from '@/app/error'

describe('app error boundary', () => {
  it('renders the route error fallback wired to the boundary error', () => {
    render(<AppError error={new Error('kaboom')} reset={vi.fn()} />)

    expect(screen.getByTestId('error-message')).toHaveTextContent('kaboom')
  })

  it('wires reset so retry re-attempts the segment', async () => {
    const reset = vi.fn()
    render(<AppError error={new Error('kaboom')} reset={reset} />)

    await userEvent.click(screen.getByRole('button', { name: 'retry' }))

    expect(reset).toHaveBeenCalledOnce()
  })

  it('does not strand the user with a home link — the segment boundary keeps the nav', () => {
    render(<AppError error={new Error('kaboom')} reset={vi.fn()} />)

    expect(screen.queryByTestId('home-href')).not.toBeInTheDocument()
  })
})
