import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { RankLadder } from '@/components/yak2peak/rank-ladder'
import { copy } from '@/lib/copy'
import type { RankEntry } from '@/lib/ranks'

// Fixtures exercise every rank-display branch:
// - done that exactly met its goal (current === peak) vs done that exceeded it
// - doing with a current rank vs doing with none yet (null placeholder)
// - queued (goal only)
const FULL: readonly RankEntry[] = [
  { game: 'Rocket League', status: 'done', currentRank: 'Champion', peakGoal: 'Champion' },
  { game: 'Overwatch', status: 'done', currentRank: 'Diamond', peakGoal: 'Platinum' },
  { game: 'Apex Legends', status: 'doing', currentRank: 'Gold', peakGoal: 'Diamond' },
  { game: 'Marvel Rivals', status: 'doing', currentRank: null, peakGoal: 'Diamond' },
  { game: 'Valorant', status: 'queued', currentRank: null, peakGoal: 'Ascendant' },
]

describe('RankLadder', () => {
  it('renders one row per game grouped into done, doing, then queued order', () => {
    render(<RankLadder ranks={FULL} />)

    for (const entry of FULL) {
      expect(screen.getByText(entry.game)).toBeInTheDocument()
    }

    const headings = screen.getAllByRole('heading').map((heading) => heading.textContent)
    expect(headings).toEqual([
      copy.yak2peakLadder.doneHeading,
      copy.yak2peakLadder.doingHeading,
      copy.yak2peakLadder.queuedHeading,
    ])
  })

  it('shows a goal-exceeded treatment for a done game whose current rank passed its goal', () => {
    render(<RankLadder ranks={FULL} />)

    expect(screen.getByText('Platinum → Diamond')).toBeInTheDocument()
  })

  it('shows only the achieved rank for a done game that exactly met its goal', () => {
    render(<RankLadder ranks={FULL} />)

    expect(screen.getByText('Champion')).toBeInTheDocument()
    expect(screen.queryByText('Champion → Champion')).not.toBeInTheDocument()
  })

  it('shows the in-progress rank and goal for a doing game with a current rank', () => {
    render(<RankLadder ranks={FULL} />)

    expect(screen.getByText('Gold → Diamond')).toBeInTheDocument()
  })

  it('shows a placeholder for a doing game with no current rank yet', () => {
    render(<RankLadder ranks={FULL} />)

    expect(screen.getByText('— → Diamond')).toBeInTheDocument()
  })

  it('shows the goal only for a queued game', () => {
    render(<RankLadder ranks={FULL} />)

    expect(screen.getByText(`${copy.yak2peakLadder.goalPrefix} Ascendant`)).toBeInTheDocument()
  })

  it('omits a group heading when that status has no entries', () => {
    const noDoing: readonly RankEntry[] = FULL.filter((entry) => entry.status !== 'doing')

    render(<RankLadder ranks={noDoing} />)

    expect(
      screen.queryByRole('heading', { name: copy.yak2peakLadder.doingHeading }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: copy.yak2peakLadder.doneHeading }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: copy.yak2peakLadder.queuedHeading }),
    ).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<RankLadder ranks={FULL} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
