import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

interface FallbackProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
  readonly homeHref?: string
}

// Mock the library fallback so the test asserts the DATA props the root boundary
// wires in (error message, reset, homeHref="/"), not just component identity.
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

import GlobalError from '@/app/global-error'

describe('global error boundary', () => {
  it('renders the route error fallback wired to the boundary error', () => {
    render(<GlobalError error={new Error('root kaboom')} reset={vi.fn()} />)

    expect(screen.getByTestId('error-message')).toHaveTextContent('root kaboom')
  })

  it('offers a home link so the stranded user can escape the root boundary', () => {
    render(<GlobalError error={new Error('root kaboom')} reset={vi.fn()} />)

    expect(screen.getByTestId('home-href')).toHaveAttribute('href', '/')
  })

  it('wires reset so retry re-attempts the render', async () => {
    const reset = vi.fn()
    render(<GlobalError error={new Error('root kaboom')} reset={reset} />)

    await userEvent.click(screen.getByRole('button', { name: 'retry' }))

    expect(reset).toHaveBeenCalledOnce()
  })
})
