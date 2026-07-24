import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { CoverGrid } from '@/components/covers/cover-grid'
import { copy } from '@/lib/copy'
import { YOUTUBE_CHANNEL_URL } from '@/lib/links'
import type { VideoSummary } from '@/lib/youtube'

function makeVideos(count: number): VideoSummary[] {
  return Array.from({ length: count }, (_, i) => ({
    videoId: `id${i}`,
    title: `Cover ${i}`,
    publishedAt: '2026-07-20T00:00:00Z',
    thumbnailUrl: `https://i.ytimg.com/vi/id${i}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=id${i}`,
  }))
}

describe('CoverGrid', () => {
  it('renders a quiet empty state with a channel link when the feed is empty', () => {
    render(<CoverGrid videos={[]} />)

    expect(screen.getByText(copy.covers.empty)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: copy.covers.emptyCta })
    expect(link).toHaveAttribute('href', YOUTUBE_CHANNEL_URL)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders one external card per video with its title', () => {
    render(<CoverGrid videos={makeVideos(3)} />)

    expect(screen.getAllByRole('link')).toHaveLength(3)

    const first = screen.getByRole('link', { name: /Cover 0/ })
    expect(first).toHaveAttribute('href', 'https://www.youtube.com/watch?v=id0')
    expect(first).toHaveAttribute('target', '_blank')
    expect(first).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders every video with no cap, unlike the home teaser strip', () => {
    render(<CoverGrid videos={makeVideos(9)} />)

    expect(screen.getAllByRole('link')).toHaveLength(9)
  })

  it('renders each card thumbnail unoptimized straight from YouTube', () => {
    render(<CoverGrid videos={makeVideos(1)} />)

    const card = screen.getByRole('link', { name: /Cover 0/ })
    const thumb = within(card).getByAltText('')
    expect(thumb.getAttribute('src')).toMatch(/^https:\/\/i\.ytimg\.com/)
  })

  it('eagerly loads the first 4 above-fold thumbnails and lazy-loads the rest', () => {
    render(<CoverGrid videos={makeVideos(5)} />)

    const links = screen.getAllByRole('link')
    const thumbs = links.map((link) => within(link).getByAltText(''))

    thumbs.slice(0, 4).forEach((thumb) => {
      expect(thumb).not.toHaveAttribute('loading', 'lazy')
    })
    expect(thumbs[4]).toHaveAttribute('loading', 'lazy')
  })

  it('has no accessibility violations when populated', async () => {
    const { container } = render(<CoverGrid videos={makeVideos(3)} />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations when empty', async () => {
    const { container } = render(<CoverGrid videos={[]} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
