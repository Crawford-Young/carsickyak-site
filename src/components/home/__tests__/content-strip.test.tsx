import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { ContentStrip } from '@/components/home/content-strip'
import { copy } from '@/lib/copy'
import type { VideoSummary } from '@/lib/youtube'

function makeVideos(count: number): VideoSummary[] {
  return Array.from({ length: count }, (_, i) => ({
    videoId: `id${i}`,
    title: `Video ${i}`,
    publishedAt: '2026-07-20T00:00:00Z',
    thumbnailUrl: `https://i.ytimg.com/vi/id${i}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=id${i}`,
  }))
}

describe('ContentStrip', () => {
  it('renders nothing when the feed is empty', () => {
    const { container } = render(<ContentStrip videos={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the gated section heading', () => {
    render(<ContentStrip videos={makeVideos(3)} />)

    expect(screen.getByRole('heading', { name: copy.sections.latestVideos })).toBeInTheDocument()
  })

  it('renders one external card per video with its title', () => {
    render(<ContentStrip videos={makeVideos(3)} />)

    expect(screen.getAllByRole('link')).toHaveLength(3)

    const first = screen.getByRole('link', { name: /Video 0/ })
    expect(first).toHaveAttribute('href', 'https://www.youtube.com/watch?v=id0')
    expect(first).toHaveAttribute('target', '_blank')
    expect(first).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders each card thumbnail unoptimized straight from YouTube', () => {
    render(<ContentStrip videos={makeVideos(1)} />)

    const card = screen.getByRole('link', { name: /Video 0/ })
    const thumb = within(card).getByAltText('')
    expect(thumb.getAttribute('src')).toMatch(/^https:\/\/i\.ytimg\.com/)
  })

  it('caps the grid at six cards even when given more', () => {
    render(<ContentStrip videos={makeVideos(9)} />)

    expect(screen.getAllByRole('link')).toHaveLength(6)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ContentStrip videos={makeVideos(3)} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
