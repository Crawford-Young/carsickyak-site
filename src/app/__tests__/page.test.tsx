import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { copy } from '@/lib/copy'
import type { LiveStatus } from '@/lib/twitch'
import type { VideoSummary } from '@/lib/youtube'

// Mock both adapters at the module boundary: page.tsx value-imports them, and
// their real modules transitively reach src/env.ts, which throws under
// happy-dom (the isServer trap). Mocking here keeps the render env-free.
const { getLiveStatusMock, getLatestVideosMock } = vi.hoisted(() => ({
  getLiveStatusMock: vi.fn<() => Promise<LiveStatus>>(),
  getLatestVideosMock: vi.fn<() => Promise<VideoSummary[]>>(),
}))

vi.mock('@/lib/twitch', () => ({ getLiveStatus: getLiveStatusMock }))
vi.mock('@/lib/youtube', () => ({ getLatestVideos: getLatestVideosMock }))

import HomePage from '@/app/page'

const VIDEO: VideoSummary = {
  videoId: 'abc',
  title: 'Latest upload',
  publishedAt: '2026-07-20T00:00:00Z',
  thumbnailUrl: 'https://i.ytimg.com/vi/abc/hqdefault.jpg',
  url: 'https://www.youtube.com/watch?v=abc',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HomePage', () => {
  it('renders the hero, content strip, and teaser from adapter data', async () => {
    getLiveStatusMock.mockResolvedValue({ live: false })
    getLatestVideosMock.mockResolvedValue([VIDEO])

    render(await HomePage())

    expect(screen.getByRole('heading', { level: 1, name: copy.hero.headline })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: copy.sections.latestVideos })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: copy.sections.yak2peakTeaser })).toBeInTheDocument()
  })

  it('omits the content strip entirely when the feed is empty', async () => {
    getLiveStatusMock.mockResolvedValue({ live: false })
    getLatestVideosMock.mockResolvedValue([])

    render(await HomePage())

    expect(
      screen.queryByRole('heading', { name: copy.sections.latestVideos }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: copy.sections.yak2peakTeaser })).toBeInTheDocument()
  })

  it('fetches live status and the latest videos', async () => {
    getLiveStatusMock.mockResolvedValue({ live: true })
    getLatestVideosMock.mockResolvedValue([VIDEO])

    await HomePage()

    expect(getLiveStatusMock).toHaveBeenCalledOnce()
    expect(getLatestVideosMock).toHaveBeenCalledOnce()
  })
})
