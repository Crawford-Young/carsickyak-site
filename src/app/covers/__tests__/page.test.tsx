import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { copy } from '@/lib/copy'
import { YOUTUBE_CHANNEL_URL } from '@/lib/links'
import type { VideoSummary } from '@/lib/youtube'

// Mock the adapter at the module boundary: page.tsx value-imports it, and its
// real module transitively reaches src/env.ts, which throws under happy-dom
// (the isServer trap). Mocking here keeps the render env-free.
const { getCoverVideosMock } = vi.hoisted(() => ({
  getCoverVideosMock: vi.fn<() => Promise<VideoSummary[]>>(),
}))

vi.mock('@/lib/youtube', () => ({ getCoverVideos: getCoverVideosMock }))

import CoversPage, { metadata } from '@/app/covers/page'

const VIDEO: VideoSummary = {
  videoId: 'cov1',
  title: 'Cover of a folk song',
  publishedAt: '2026-07-20T00:00:00Z',
  thumbnailUrl: 'https://i.ytimg.com/vi/cov1/hqdefault.jpg',
  url: 'https://www.youtube.com/watch?v=cov1',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CoversPage', () => {
  it('renders the page title and gated intro line', async () => {
    getCoverVideosMock.mockResolvedValue([VIDEO])

    render(await CoversPage())

    expect(
      screen.getByRole('heading', { level: 1, name: copy.covers.pageTitle }),
    ).toBeInTheDocument()
    expect(screen.getByText(copy.covers.intro)).toBeInTheDocument()
  })

  it('renders a card for each cover video from the adapter', async () => {
    getCoverVideosMock.mockResolvedValue([VIDEO])

    render(await CoversPage())

    expect(screen.getByRole('link', { name: /Cover of a folk song/ })).toHaveAttribute(
      'href',
      VIDEO.url,
    )
  })

  it('renders the quiet empty state with a channel link when the feed is empty', async () => {
    getCoverVideosMock.mockResolvedValue([])

    render(await CoversPage())

    expect(screen.getByText(copy.covers.empty)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: copy.covers.emptyCta })).toHaveAttribute(
      'href',
      YOUTUBE_CHANNEL_URL,
    )
  })

  it('fetches cover videos from the adapter', async () => {
    getCoverVideosMock.mockResolvedValue([VIDEO])

    await CoversPage()

    expect(getCoverVideosMock).toHaveBeenCalledOnce()
  })

  it('exposes page metadata from the gated copy source', () => {
    expect(metadata.title).toBe(copy.covers.pageTitle)
    expect(metadata.description).toBe(copy.meta.covers)
  })
})
