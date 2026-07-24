import { copy } from '@/lib/copy'
import type { RankEntry } from '@/lib/ranks'

const ARROW = '→'
const NO_RANK_PLACEHOLDER = '—'

interface RankLadderProps {
  readonly ranks: readonly RankEntry[]
}

interface GroupConfig {
  readonly status: RankEntry['status']
  readonly heading: string
  readonly glyph: string
  readonly glyphClass: string
}

// Rendered top to bottom, mirroring the shipped yak2peak asset: gold marks the
// climbs already finished, ember the ones in progress, muted the queue ahead.
const GROUPS: readonly GroupConfig[] = [
  {
    status: 'done',
    heading: copy.yak2peakLadder.doneHeading,
    glyph: '✓',
    glyphClass: 'text-gold-muted',
  },
  {
    status: 'doing',
    heading: copy.yak2peakLadder.doingHeading,
    glyph: '▲',
    glyphClass: 'text-ember',
  },
  {
    status: 'queued',
    heading: copy.yak2peakLadder.queuedHeading,
    glyph: '○',
    glyphClass: 'text-muted-foreground',
  },
]

function rankDisplay(entry: RankEntry): string {
  if (entry.status === 'done') {
    return entry.currentRank === entry.peakGoal
      ? entry.peakGoal
      : `${entry.peakGoal} ${ARROW} ${entry.currentRank}`
  }
  if (entry.status === 'doing') {
    return `${entry.currentRank ?? NO_RANK_PLACEHOLDER} ${ARROW} ${entry.peakGoal}`
  }
  return `${copy.yak2peakLadder.goalPrefix} ${entry.peakGoal}`
}

export function RankLadder({ ranks }: RankLadderProps): React.JSX.Element {
  return (
    <div className="mt-10 flex flex-col gap-12">
      {GROUPS.map((group) => {
        const entries = ranks.filter((entry) => entry.status === group.status)
        if (entries.length === 0) {
          return null
        }
        const headingId = `ladder-${group.status}`
        return (
          <section key={group.status} aria-labelledby={headingId}>
            <h2
              id={headingId}
              className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase"
            >
              {group.heading}
            </h2>
            <ul className="mt-4 flex flex-col gap-4">
              {entries.map((entry) => (
                <li key={entry.game} className="flex items-baseline gap-4">
                  <span aria-hidden className={`w-5 flex-none text-lg ${group.glyphClass}`}>
                    {group.glyph}
                  </span>
                  <span className="text-foreground font-serif text-xl font-semibold tracking-tight">
                    {entry.game}
                  </span>
                  <span className="text-muted-foreground ml-auto text-right text-sm">
                    {rankDisplay(entry)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
