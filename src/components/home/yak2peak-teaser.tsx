import Link from 'next/link'

import { copy } from '@/lib/copy'
import type { RankEntry } from '@/lib/ranks'

const YAK2PEAK_HREF = '/yak2peak'

interface Yak2PeakTeaserProps {
  readonly ranks: readonly RankEntry[]
}

function latestDoneEntry(ranks: readonly RankEntry[]): RankEntry | undefined {
  return ranks.findLast((entry) => entry.status === 'done')
}

function nextQueuedEntry(ranks: readonly RankEntry[]): RankEntry | undefined {
  return ranks.find((entry) => entry.status === 'queued')
}

export function Yak2PeakTeaser({ ranks }: Yak2PeakTeaserProps): React.JSX.Element {
  const latestDone = latestDoneEntry(ranks)
  const nextQueued = nextQueuedEntry(ranks)
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      <h2 className="font-serif text-2xl font-semibold tracking-tight">
        {copy.sections.yak2peakTeaser}
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {latestDone ? (
          <div className="border-border/60 rounded-lg border p-6">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
              {copy.yak2peakTeaser.latestDone}
            </p>
            <p className="mt-2 font-serif text-xl font-semibold">{latestDone.game}</p>
            <p className="text-accent-subtle-foreground mt-1 font-medium">
              {latestDone.currentRank}
            </p>
          </div>
        ) : null}
        {nextQueued ? (
          <div className="border-border/60 rounded-lg border p-6">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
              {copy.yak2peakTeaser.nextUp}
            </p>
            <p className="mt-2 font-serif text-xl font-semibold">{nextQueued.game}</p>
            <p className="text-muted-foreground mt-1">
              {copy.yak2peakTeaser.goalPrefix} {nextQueued.peakGoal}
            </p>
          </div>
        ) : null}
      </div>
      <Link
        href={YAK2PEAK_HREF}
        className="text-muted-foreground hover:text-foreground mt-6 inline-block text-sm font-medium underline-offset-4 transition-colors hover:underline"
      >
        {copy.yak2peak.motto}
      </Link>
    </section>
  )
}
