import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LiveBadge } from '@/components/live/live-badge'
import type { LiveStatus } from '@/lib/twitch'

const TWITCH_CHANNEL_URL = 'https://twitch.tv/carsickyak'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('LiveBadge', () => {
  it('renders the live state with an ember dot, label, and Twitch link', () => {
    const status: LiveStatus = {
      live: true,
      title: 'Chill kayak stream',
      gameName: 'Just Chatting',
      startedAt: '2026-07-24T10:00:00Z',
    }

    render(<LiveBadge initialStatus={status} />)

    const link = screen.getByRole('link', { name: /live/i })
    expect(link).toHaveAttribute('href', TWITCH_CHANNEL_URL)
    expect(link).toHaveTextContent(/live/i)
    const dot = link.querySelector('[aria-hidden]')
    expect(dot).toHaveClass('bg-ember')
  })

  it('renders the offline state with a quiet label', () => {
    const status: LiveStatus = { live: false }

    render(<LiveBadge initialStatus={status} />)

    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('polls /api/live every 60s and flips to the live state when the fetch resolves', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })

    const nextStatus: LiveStatus = {
      live: true,
      title: 'Chill kayak stream',
      gameName: 'Just Chatting',
      startedAt: '2026-07-24T10:00:00Z',
    }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => nextStatus,
    })
    vi.stubGlobal('fetch', fetchMock)

    const initialStatus: LiveStatus = { live: false }
    render(<LiveBadge initialStatus={initialStatus} />)

    expect(screen.getByText('Offline')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/live')
    expect(screen.getByRole('link', { name: /live/i })).toBeInTheDocument()
  })

  it('stays offline when the poll response is not ok', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })

    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)

    const initialStatus: LiveStatus = { live: false }
    render(<LiveBadge initialStatus={initialStatus} />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/live')
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })

  it('stays offline when the poll fetch rejects', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })

    const fetchMock = vi.fn().mockRejectedValue(new Error('network error'))
    vi.stubGlobal('fetch', fetchMock)

    const initialStatus: LiveStatus = { live: false }
    render(<LiveBadge initialStatus={initialStatus} />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/live')
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })
})
