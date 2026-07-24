import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { copy } from '@/lib/copy'

import NotFound from '@/app/not-found'

describe('not-found page', () => {
  it('renders the gated 404 line', () => {
    render(<NotFound />)

    expect(screen.getByText(copy.notFound.line)).toBeInTheDocument()
  })

  it('offers a link back to the home page', () => {
    render(<NotFound />)

    const link = screen.getByRole('link', { name: copy.notFound.homeLabel })
    expect(link).toHaveAttribute('href', '/')
  })
})
