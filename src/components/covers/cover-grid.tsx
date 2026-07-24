import Image from 'next/image'

import { copy } from '@/lib/copy'
import { YOUTUBE_CHANNEL_URL } from '@/lib/links'
import type { VideoSummary } from '@/lib/youtube'

interface CoverGridProps {
  readonly videos: readonly VideoSummary[]
}

const ABOVE_FOLD_THUMBNAIL_COUNT = 4

/**
 * This page's whole content IS the feed (unlike the home teaser strip), so
 * an empty feed renders a quiet empty state with a channel link instead of
 * disappearing — and a populated feed renders every video with no cap.
 */
export function CoverGrid({ videos }: CoverGridProps): React.JSX.Element {
  if (videos.length === 0) {
    return (
      <p className="text-muted-foreground mt-16 text-center text-base">
        {copy.covers.empty}{' '}
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4"
        >
          {copy.covers.emptyCta}
        </a>
      </p>
    )
  }

  return (
    <ul className="mt-12 grid gap-8 sm:grid-cols-2">
      {videos.map((video, index) => (
        <li key={video.videoId}>
          <article className="border-border/60 group overflow-hidden rounded-lg border transition-colors">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus-visible:outline-none"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={video.thumbnailUrl}
                  alt=""
                  fill
                  unoptimized
                  priority={index < ABOVE_FOLD_THUMBNAIL_COUNT}
                  sizes="(min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <p className="line-clamp-2 p-4 text-base font-medium">{video.title}</p>
            </a>
          </article>
        </li>
      ))}
    </ul>
  )
}
