// @vitest-environment node
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  getCoverVideos as GetCoverVideosFn,
  getLatestVideos as GetLatestVideosFn,
} from '@/lib/youtube'
import { server } from '../../../tests/mocks/server'

const PLAYLIST_ITEMS_URL = 'https://www.googleapis.com/youtube/v3/playlistItems'
const CHANNEL_ID = 'UCabcdefghijklmnop'
const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`
const COVERS_PLAYLIST_ID = 'PLcoversplaylist'

// Hoisted mock fns so the SAME reference is returned by the factory on every
// `vi.resetModules()` re-import — a fresh object per factory call would make
// youtube.ts's internal import and the test's assertions target different
// instances.
const loggerErrorMock = vi.fn()
const captureExceptionMock = vi.fn()

vi.mock('@/lib/logger', () => ({
  logger: { error: loggerErrorMock },
}))

vi.mock('@sentry/nextjs', () => ({
  captureException: captureExceptionMock,
}))

function stubYoutubeEnv(coversPlaylistId?: string): void {
  vi.stubEnv('TWITCH_CLIENT_ID', 'test-client-id')
  vi.stubEnv('TWITCH_CLIENT_SECRET', 'test-client-secret')
  vi.stubEnv('YOUTUBE_API_KEY', 'test-youtube-key')
  vi.stubEnv('YOUTUBE_CHANNEL_ID', CHANNEL_ID)
  vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com')
  if (coversPlaylistId) {
    vi.stubEnv('YOUTUBE_COVERS_PLAYLIST_ID', coversPlaylistId)
  }
}

async function loadYoutube(): Promise<{
  getLatestVideos: typeof GetLatestVideosFn
  getCoverVideos: typeof GetCoverVideosFn
}> {
  vi.resetModules()
  const { getLatestVideos, getCoverVideos } = await import('@/lib/youtube')
  return { getLatestVideos, getCoverVideos }
}

function snippetItem(overrides: {
  videoId: string
  title: string
  publishedAt: string
  high?: string
  medium?: string
}): unknown {
  return {
    snippet: {
      title: overrides.title,
      publishedAt: overrides.publishedAt,
      resourceId: { videoId: overrides.videoId },
      thumbnails: {
        ...(overrides.medium ? { medium: { url: overrides.medium } } : {}),
        ...(overrides.high ? { high: { url: overrides.high } } : {}),
      },
    },
  }
}

beforeEach(() => {
  loggerErrorMock.mockClear()
  captureExceptionMock.mockClear()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getLatestVideos', () => {
  it('maps snippet fields to VideoSummary, preferring high thumbnail and falling back to medium/empty', async () => {
    stubYoutubeEnv()
    let requestedPlaylistId: string | null = null
    server.use(
      http.get(PLAYLIST_ITEMS_URL, ({ request }) => {
        const url = new URL(request.url)
        requestedPlaylistId = url.searchParams.get('playlistId')
        return HttpResponse.json({
          items: [
            snippetItem({
              videoId: 'vid-1',
              title: 'A cover of a song',
              publishedAt: '2026-07-01T00:00:00Z',
              high: 'https://img.example.com/high.jpg',
              medium: 'https://img.example.com/medium.jpg',
            }),
            snippetItem({
              videoId: 'vid-2',
              title: 'No high thumb',
              publishedAt: '2026-07-02T00:00:00Z',
              medium: 'https://img.example.com/medium-only.jpg',
            }),
            snippetItem({
              videoId: 'vid-3',
              title: 'No thumbs at all',
              publishedAt: '2026-07-03T00:00:00Z',
            }),
          ],
        })
      }),
    )

    const { getLatestVideos } = await loadYoutube()

    await expect(getLatestVideos()).resolves.toEqual([
      {
        videoId: 'vid-1',
        title: 'A cover of a song',
        publishedAt: '2026-07-01T00:00:00Z',
        thumbnailUrl: 'https://img.example.com/high.jpg',
        url: 'https://www.youtube.com/watch?v=vid-1',
      },
      {
        videoId: 'vid-2',
        title: 'No high thumb',
        publishedAt: '2026-07-02T00:00:00Z',
        thumbnailUrl: 'https://img.example.com/medium-only.jpg',
        url: 'https://www.youtube.com/watch?v=vid-2',
      },
      {
        videoId: 'vid-3',
        title: 'No thumbs at all',
        publishedAt: '2026-07-03T00:00:00Z',
        thumbnailUrl: '',
        url: 'https://www.youtube.com/watch?v=vid-3',
      },
    ])
    expect(requestedPlaylistId).toBe(UPLOADS_PLAYLIST_ID)
  })

  it('returns [] and logs when the playlistItems request fails', async () => {
    stubYoutubeEnv()
    server.use(http.get(PLAYLIST_ITEMS_URL, () => new HttpResponse(null, { status: 500 })))

    const { getLatestVideos } = await loadYoutube()

    await expect(getLatestVideos()).resolves.toEqual([])
    expect(loggerErrorMock).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      'getLatestVideos failed',
    )
    expect(captureExceptionMock).toHaveBeenCalledWith(expect.any(Error))
  })

  it('returns [] when the playlistItems payload is malformed', async () => {
    stubYoutubeEnv()
    server.use(http.get(PLAYLIST_ITEMS_URL, () => HttpResponse.json({ nope: true })))

    const { getLatestVideos } = await loadYoutube()

    await expect(getLatestVideos()).resolves.toEqual([])
    expect(loggerErrorMock).toHaveBeenCalled()
    expect(captureExceptionMock).toHaveBeenCalled()
  })
})

describe('getCoverVideos', () => {
  it('fetches the configured covers playlist uncapped when YOUTUBE_COVERS_PLAYLIST_ID is set', async () => {
    stubYoutubeEnv(COVERS_PLAYLIST_ID)
    let requestedPlaylistId: string | null = null
    let requestedMaxResults: string | null = null
    server.use(
      http.get(PLAYLIST_ITEMS_URL, ({ request }) => {
        const url = new URL(request.url)
        requestedPlaylistId = url.searchParams.get('playlistId')
        requestedMaxResults = url.searchParams.get('maxResults')
        return HttpResponse.json({
          items: [
            snippetItem({
              videoId: 'cover-1',
              title: 'Cover Song Live',
              publishedAt: '2026-07-04T00:00:00Z',
              high: 'https://img.example.com/cover-1.jpg',
            }),
          ],
        })
      }),
    )

    const { getCoverVideos } = await loadYoutube()

    await expect(getCoverVideos()).resolves.toEqual([
      {
        videoId: 'cover-1',
        title: 'Cover Song Live',
        publishedAt: '2026-07-04T00:00:00Z',
        thumbnailUrl: 'https://img.example.com/cover-1.jpg',
        url: 'https://www.youtube.com/watch?v=cover-1',
      },
    ])
    expect(requestedPlaylistId).toBe(COVERS_PLAYLIST_ID)
    // The covers page is uncapped by design; the dedicated playlist branch must
    // request the YouTube page maximum, not the home strip's 6-item cap (issue #5).
    expect(requestedMaxResults).toBe('50')
  })

  it('falls back to scanning the uploads playlist and filtering by title when unset', async () => {
    stubYoutubeEnv()
    let requestedPlaylistId: string | null = null
    let requestedMaxResults: string | null = null
    server.use(
      http.get(PLAYLIST_ITEMS_URL, ({ request }) => {
        const url = new URL(request.url)
        requestedPlaylistId = url.searchParams.get('playlistId')
        requestedMaxResults = url.searchParams.get('maxResults')
        return HttpResponse.json({
          items: [
            snippetItem({
              videoId: 'vid-cover',
              title: 'My Cover of a song',
              publishedAt: '2026-07-05T00:00:00Z',
              high: 'https://img.example.com/vid-cover.jpg',
            }),
            snippetItem({
              videoId: 'vid-original',
              title: 'Original song',
              publishedAt: '2026-07-06T00:00:00Z',
              high: 'https://img.example.com/vid-original.jpg',
            }),
          ],
        })
      }),
    )

    const { getCoverVideos } = await loadYoutube()

    await expect(getCoverVideos()).resolves.toEqual([
      {
        videoId: 'vid-cover',
        title: 'My Cover of a song',
        publishedAt: '2026-07-05T00:00:00Z',
        thumbnailUrl: 'https://img.example.com/vid-cover.jpg',
        url: 'https://www.youtube.com/watch?v=vid-cover',
      },
    ])
    expect(requestedPlaylistId).toBe(UPLOADS_PLAYLIST_ID)
    expect(requestedMaxResults).toBe('48')
  })

  it('returns [] and logs when the playlistItems request fails', async () => {
    stubYoutubeEnv()
    server.use(http.get(PLAYLIST_ITEMS_URL, () => new HttpResponse(null, { status: 500 })))

    const { getCoverVideos } = await loadYoutube()

    await expect(getCoverVideos()).resolves.toEqual([])
    expect(loggerErrorMock).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      'getCoverVideos failed',
    )
    expect(captureExceptionMock).toHaveBeenCalledWith(expect.any(Error))
  })
})
