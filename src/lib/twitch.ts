import 'server-only'

import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'

import { env } from '@/env'
import { logger } from '@/lib/logger'

const TWITCH_LOGIN = 'carsickyak'
const TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
const STREAMS_URL = 'https://api.twitch.tv/helix/streams'
const LIVE_REVALIDATE_SECONDS = 60
const TOKEN_EXPIRY_MARGIN_MS = 60_000
const MS_PER_SECOND = 1000

const tokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
})

const streamsSchema = z.object({
  data: z.array(
    z.object({
      title: z.string(),
      game_name: z.string(),
      started_at: z.string(),
    }),
  ),
})

export interface LiveStatus {
  readonly live: boolean
  readonly title?: string
  readonly gameName?: string
  readonly startedAt?: string
}

interface CachedToken {
  readonly value: string
  readonly expiresAt: number
}

let cachedToken: CachedToken | null = null

async function getAppToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - TOKEN_EXPIRY_MARGIN_MS) {
    return cachedToken.value
  }
  const params = new URLSearchParams({
    client_id: env.TWITCH_CLIENT_ID,
    client_secret: env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials',
  })
  const res = await fetch(TOKEN_URL, { method: 'POST', body: params, cache: 'no-store' })
  if (!res.ok) throw new Error(`twitch token request failed: ${res.status}`)
  const parsed = tokenSchema.parse(await res.json())
  cachedToken = {
    value: parsed.access_token,
    expiresAt: Date.now() + parsed.expires_in * MS_PER_SECOND,
  }
  return parsed.access_token
}

export async function getLiveStatus(): Promise<LiveStatus> {
  try {
    const token = await getAppToken()
    const res = await fetch(`${STREAMS_URL}?user_login=${TWITCH_LOGIN}`, {
      headers: { 'Client-Id': env.TWITCH_CLIENT_ID, Authorization: `Bearer ${token}` },
      next: { revalidate: LIVE_REVALIDATE_SECONDS },
    })
    if (!res.ok) throw new Error(`twitch streams request failed: ${res.status}`)
    const parsed = streamsSchema.parse(await res.json())
    const stream = parsed.data[0]
    if (!stream) return { live: false }
    return {
      live: true,
      title: stream.title,
      gameName: stream.game_name,
      startedAt: stream.started_at,
    }
  } catch (error) {
    logger.error({ error }, 'getLiveStatus failed')
    Sentry.captureException(error)
    return { live: false }
  }
}
