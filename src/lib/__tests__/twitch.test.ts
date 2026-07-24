// @vitest-environment node
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { getLiveStatus as GetLiveStatusFn } from '@/lib/twitch'
import { server } from '../../../tests/mocks/server'

const TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
const STREAMS_URL = 'https://api.twitch.tv/helix/streams'

// Hoisted mock fns so the SAME reference is returned by the factory on every
// `vi.resetModules()` re-import — a fresh object per factory call would make
// twitch.ts's internal import and the test's assertions target different
// instances.
const loggerErrorMock = vi.fn()
const captureExceptionMock = vi.fn()

vi.mock('@/lib/logger', () => ({
  logger: { error: loggerErrorMock },
}))

vi.mock('@sentry/nextjs', () => ({
  captureException: captureExceptionMock,
}))

function stubTwitchEnv(): void {
  vi.stubEnv('TWITCH_CLIENT_ID', 'test-client-id')
  vi.stubEnv('TWITCH_CLIENT_SECRET', 'test-client-secret')
  vi.stubEnv('YOUTUBE_API_KEY', 'test-youtube-key')
  vi.stubEnv('YOUTUBE_CHANNEL_ID', 'test-channel-id')
  vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com')
}

async function loadTwitch(): Promise<typeof GetLiveStatusFn> {
  vi.resetModules()
  const { getLiveStatus } = await import('@/lib/twitch')
  return getLiveStatus
}

beforeEach(() => {
  stubTwitchEnv()
  loggerErrorMock.mockClear()
  captureExceptionMock.mockClear()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getLiveStatus', () => {
  it('returns live status with title, game, and start time when a stream is live', async () => {
    server.use(
      http.post(TOKEN_URL, () =>
        HttpResponse.json({ access_token: 'tok', expires_in: 3600, token_type: 'bearer' }),
      ),
      http.get(STREAMS_URL, () =>
        HttpResponse.json({
          data: [
            {
              title: 'Chill kayak stream',
              game_name: 'Just Chatting',
              started_at: '2026-07-24T10:00:00Z',
            },
          ],
        }),
      ),
    )

    const getLiveStatus = await loadTwitch()

    await expect(getLiveStatus()).resolves.toEqual({
      live: true,
      title: 'Chill kayak stream',
      gameName: 'Just Chatting',
      startedAt: '2026-07-24T10:00:00Z',
    })
  })

  it('returns live: false when no stream is live', async () => {
    server.use(
      http.post(TOKEN_URL, () =>
        HttpResponse.json({ access_token: 'tok', expires_in: 3600, token_type: 'bearer' }),
      ),
      http.get(STREAMS_URL, () => HttpResponse.json({ data: [] })),
    )

    const getLiveStatus = await loadTwitch()

    await expect(getLiveStatus()).resolves.toEqual({ live: false })
  })

  it('returns live: false and logs when the streams request fails', async () => {
    server.use(
      http.post(TOKEN_URL, () =>
        HttpResponse.json({ access_token: 'tok', expires_in: 3600, token_type: 'bearer' }),
      ),
      http.get(STREAMS_URL, () => new HttpResponse(null, { status: 500 })),
    )

    const getLiveStatus = await loadTwitch()

    await expect(getLiveStatus()).resolves.toEqual({ live: false })
    expect(loggerErrorMock).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      'getLiveStatus failed',
    )
    expect(captureExceptionMock).toHaveBeenCalledWith(expect.any(Error))
  })

  it('returns live: false when the streams payload is malformed', async () => {
    server.use(
      http.post(TOKEN_URL, () =>
        HttpResponse.json({ access_token: 'tok', expires_in: 3600, token_type: 'bearer' }),
      ),
      http.get(STREAMS_URL, () => HttpResponse.json({})),
    )

    const getLiveStatus = await loadTwitch()

    await expect(getLiveStatus()).resolves.toEqual({ live: false })
    expect(loggerErrorMock).toHaveBeenCalled()
  })

  it('returns live: false and logs when the token request fails', async () => {
    server.use(http.post(TOKEN_URL, () => new HttpResponse(null, { status: 500 })))

    const getLiveStatus = await loadTwitch()

    await expect(getLiveStatus()).resolves.toEqual({ live: false })
    expect(loggerErrorMock).toHaveBeenCalled()
    expect(captureExceptionMock).toHaveBeenCalled()
  })

  it('caches the app token across multiple calls within the same module instance', async () => {
    let tokenCalls = 0
    server.use(
      http.post(TOKEN_URL, () => {
        tokenCalls += 1
        return HttpResponse.json({ access_token: 'tok', expires_in: 3600, token_type: 'bearer' })
      }),
      http.get(STREAMS_URL, () => HttpResponse.json({ data: [] })),
    )

    const getLiveStatus = await loadTwitch()

    await getLiveStatus()
    await getLiveStatus()

    expect(tokenCalls).toBe(1)
  })
})
