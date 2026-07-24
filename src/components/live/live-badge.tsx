'use client'

import { useEffect, useState } from 'react'

import type { LiveStatus } from '@/lib/twitch'

const POLL_INTERVAL_MS = 60_000
const TWITCH_CHANNEL_URL = 'https://twitch.tv/carsickyak'

interface LiveBadgeProps {
  readonly initialStatus: LiveStatus
}

export function LiveBadge({ initialStatus }: LiveBadgeProps): React.JSX.Element {
  const [status, setStatus] = useState<LiveStatus>(initialStatus)

  useEffect(() => {
    const id = setInterval(() => {
      void fetch('/api/live')
        .then((res) => (res.ok ? (res.json() as Promise<LiveStatus>) : null))
        .then((next) => {
          if (next) setStatus(next)
        })
        .catch(() => undefined)
    }, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  if (!status.live) {
    return <span className="text-muted-foreground">Offline</span>
  }
  return (
    <a
      href={TWITCH_CHANNEL_URL}
      className="text-ember inline-flex items-center gap-2 font-medium"
      rel="noopener noreferrer"
      target="_blank"
    >
      <span aria-hidden className="bg-ember size-2 animate-pulse rounded-full" />
      LIVE — watch on Twitch
    </a>
  )
}
