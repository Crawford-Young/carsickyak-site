import { LiveBadge } from '@/components/live/live-badge'
import { copy } from '@/lib/copy'
import { TWITCH_CHANNEL_URL } from '@/lib/links'
import type { LiveStatus } from '@/lib/twitch'
import type { VideoSummary } from '@/lib/youtube'

interface LiveBandProps {
  readonly status: LiveStatus
  readonly latestVideo: VideoSummary | undefined
}

export function LiveBand({ status, latestVideo }: LiveBandProps): React.JSX.Element {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-12 text-center">
      <LiveBadge initialStatus={status} />
      {status.live ? (
        <>
          {status.title ? (
            <p className="text-muted-foreground max-w-xl text-balance">{status.title}</p>
          ) : null}
          <a
            href={TWITCH_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ember rounded-full px-6 py-3 text-base font-semibold text-neutral-950 transition-transform hover:scale-105"
          >
            {copy.live.watchCta}
          </a>
        </>
      ) : latestVideo ? (
        <a
          href={latestVideo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 transition-colors hover:underline"
        >
          {latestVideo.title}
        </a>
      ) : null}
    </section>
  )
}
