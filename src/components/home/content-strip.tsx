import Image from 'next/image'

import { copy } from '@/lib/copy'
import type { VideoSummary } from '@/lib/youtube'

const MAX_CARDS = 6

interface ContentStripProps {
  readonly videos: readonly VideoSummary[]
}

export function ContentStrip({ videos }: ContentStripProps): React.JSX.Element | null {
  if (videos.length === 0) {
    return null
  }
  const cards = videos.slice(0, MAX_CARDS)
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      <h2 className="font-serif text-2xl font-semibold tracking-tight">
        {copy.sections.latestVideos}
      </h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((video) => (
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
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="line-clamp-2 p-4 text-sm font-medium">{video.title}</p>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
