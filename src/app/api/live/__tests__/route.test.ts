import { describe, expect, it, vi } from 'vitest'

import { GET } from '@/app/api/live/route'
import { getLiveStatus } from '@/lib/twitch'
import type { LiveStatus } from '@/lib/twitch'

vi.mock('@/lib/twitch', () => ({
  getLiveStatus: vi.fn(),
}))

describe('GET /api/live', () => {
  it('returns the live status from the twitch adapter as JSON', async () => {
    const status: LiveStatus = {
      live: true,
      title: 'Chill kayak stream',
      gameName: 'Just Chatting',
      startedAt: '2026-07-24T10:00:00Z',
    }
    vi.mocked(getLiveStatus).mockResolvedValue(status)

    const response = await GET()

    await expect(response.json()).resolves.toEqual(status)
  })

  it('returns the offline fallback as JSON', async () => {
    const status: LiveStatus = { live: false }
    vi.mocked(getLiveStatus).mockResolvedValue(status)

    const response = await GET()

    await expect(response.json()).resolves.toEqual(status)
  })
})
