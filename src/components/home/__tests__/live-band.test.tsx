import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import { LiveBand } from '@/components/home/live-band'
import { copy } from '@/lib/copy'
import { TWITCH_CHANNEL_URL } from '@/lib/links'
import type { LiveStatus } from '@/lib/twitch'
import type { VideoSummary } from '@/lib/youtube'

// Mock the client island so these tests stay a pure server-component render and
// assert the SSR status prop that gets threaded into the island.
vi.mock('@/components/live/live-badge', () => ({
  LiveBadge: ({ initialStatus }: { initialStatus: LiveStatus }): React.JSX.Element => (
    <span data-testid="live-badge">{initialStatus.live ? 'badge-live' : 'badge-offline'}</span>
  ),
}))

const VIDEO: VideoSummary = {
  videoId: 'abc123',
  title: 'Ranked grind, day 4',
  publishedAt: '2026-07-20T00:00:00Z',
  thumbnailUrl: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
  url: 'https://www.youtube.com/watch?v=abc123',
}

describe('LiveBand', () => {
  it('mounts the live-badge island with the server-rendered status', () => {
    render(<LiveBand status={{ live: false }} latestVideo={VIDEO} />)

    expect(screen.getByTestId('live-badge')).toHaveTextContent('badge-offline')
  })

  it('when live, gives a prominent watch-now link to Twitch and shows the stream title', () => {
    const status: LiveStatus = {
      live: true,
      title: 'Rocket League ranked to Champ',
      gameName: 'Rocket League',
      startedAt: '2026-07-24T10:00:00Z',
    }

    render(<LiveBand status={status} latestVideo={VIDEO} />)

    const cta = screen.getByRole('link', { name: copy.live.watchCta })
    expect(cta).toHaveAttribute('href', TWITCH_CHANNEL_URL)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('Rocket League ranked to Champ')).toBeInTheDocument()
  })

  it('when live without a title, still renders the watch-now link', () => {
    render(<LiveBand status={{ live: true }} latestVideo={VIDEO} />)

    expect(screen.getByRole('link', { name: copy.live.watchCta })).toHaveAttribute(
      'href',
      TWITCH_CHANNEL_URL,
    )
    expect(screen.queryByRole('link', { name: VIDEO.title })).not.toBeInTheDocument()
  })

  it('when offline, offers the latest video as a fallback link', () => {
    render(<LiveBand status={{ live: false }} latestVideo={VIDEO} />)

    const link = screen.getByRole('link', { name: VIDEO.title })
    expect(link).toHaveAttribute('href', VIDEO.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('when offline with no videos, shows the quiet state without any link', () => {
    render(<LiveBand status={{ live: false }} latestVideo={undefined} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('has no accessibility violations while live', async () => {
    const { container } = render(
      <LiveBand
        status={{ live: true, title: 'live now', gameName: 'Rocket League', startedAt: 's' }}
        latestVideo={VIDEO}
      />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no accessibility violations while offline', async () => {
    const { container } = render(<LiveBand status={{ live: false }} latestVideo={VIDEO} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
