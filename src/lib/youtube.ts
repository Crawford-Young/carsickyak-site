import 'server-only'

import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'

import { env } from '@/env'
import { logger } from '@/lib/logger'

const PLAYLIST_ITEMS_URL = 'https://www.googleapis.com/youtube/v3/playlistItems'
const FEED_REVALIDATE_SECONDS = 3600
const LATEST_VIDEO_COUNT = 6
const COVERS_SCAN_COUNT = 48
// YouTube playlistItems returns at most 50 items per page; the covers page is
// uncapped by design, so the dedicated-playlist branch requests the page max
// rather than the home strip's LATEST_VIDEO_COUNT cap (issue #5).
const COVERS_FETCH_COUNT = 50
const COVERS_TITLE_PATTERN = /cover/i
const UPLOADS_PLAYLIST_PREFIX = 'UU'
const CHANNEL_ID_PREFIX_LENGTH = 2

const playlistItemsSchema = z.object({
  items: z.array(
    z.object({
      snippet: z.object({
        title: z.string(),
        publishedAt: z.string(),
        resourceId: z.object({ videoId: z.string() }),
        thumbnails: z.object({
          medium: z.object({ url: z.string() }).optional(),
          high: z.object({ url: z.string() }).optional(),
        }),
      }),
    }),
  ),
})

export interface VideoSummary {
  readonly videoId: string
  readonly title: string
  readonly publishedAt: string
  readonly thumbnailUrl: string
  readonly url: string
}

function uploadsPlaylistId(channelId: string): string {
  return `${UPLOADS_PLAYLIST_PREFIX}${channelId.slice(CHANNEL_ID_PREFIX_LENGTH)}`
}

async function fetchPlaylist(playlistId: string, maxResults: number): Promise<VideoSummary[]> {
  const params = new URLSearchParams({
    part: 'snippet',
    playlistId,
    maxResults: String(maxResults),
    key: env.YOUTUBE_API_KEY,
  })
  const res = await fetch(`${PLAYLIST_ITEMS_URL}?${params}`, {
    next: { revalidate: FEED_REVALIDATE_SECONDS },
  })
  if (!res.ok) throw new Error(`youtube playlistItems failed: ${res.status}`)
  const parsed = playlistItemsSchema.parse(await res.json())
  return parsed.items.map((item) => ({
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
    thumbnailUrl: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url ?? '',
    url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
  }))
}

export async function getLatestVideos(): Promise<VideoSummary[]> {
  try {
    return await fetchPlaylist(uploadsPlaylistId(env.YOUTUBE_CHANNEL_ID), LATEST_VIDEO_COUNT)
  } catch (error) {
    logger.error({ error }, 'getLatestVideos failed')
    Sentry.captureException(error)
    return []
  }
}

export async function getCoverVideos(): Promise<VideoSummary[]> {
  try {
    if (env.YOUTUBE_COVERS_PLAYLIST_ID) {
      return await fetchPlaylist(env.YOUTUBE_COVERS_PLAYLIST_ID, COVERS_FETCH_COUNT)
    }
    const uploads = await fetchPlaylist(
      uploadsPlaylistId(env.YOUTUBE_CHANNEL_ID),
      COVERS_SCAN_COUNT,
    )
    return uploads.filter((video) => COVERS_TITLE_PATTERN.test(video.title))
  } catch (error) {
    logger.error({ error }, 'getCoverVideos failed')
    Sentry.captureException(error)
    return []
  }
}
