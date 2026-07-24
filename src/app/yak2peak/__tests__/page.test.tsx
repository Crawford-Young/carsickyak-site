import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Yak2PeakPage, { metadata } from '@/app/yak2peak/page'
import { copy } from '@/lib/copy'

describe('Yak2PeakPage', () => {
  it('renders the page title as the top-level heading', () => {
    render(<Yak2PeakPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: copy.yak2peakLadder.pageTitle }),
    ).toBeInTheDocument()
  })

  it('renders the gated intro line', () => {
    render(<Yak2PeakPage />)

    expect(screen.getByText(copy.yak2peak.intro)).toBeInTheDocument()
  })

  it('renders the ladder of real games from the ranks data', () => {
    render(<Yak2PeakPage />)

    expect(screen.getByText('Rocket League')).toBeInTheDocument()
    expect(screen.getByText('Valorant')).toBeInTheDocument()
  })

  it('renders the motto', () => {
    render(<Yak2PeakPage />)

    expect(screen.getByText(copy.yak2peak.motto)).toBeInTheDocument()
  })

  it('exposes page metadata from the gated copy source', () => {
    expect(metadata.title).toBe(copy.yak2peakLadder.pageTitle)
    expect(metadata.description).toBe(copy.meta.yak2peak)
  })
})
