import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { Yak2PeakTeaser } from '@/components/home/yak2peak-teaser'
import { copy } from '@/lib/copy'
import type { RankEntry } from '@/lib/ranks'

const RANKS: readonly RankEntry[] = [
  { game: 'Rocket League', status: 'done', currentRank: 'Grand Champion', peakGoal: 'Champion' },
  { game: 'Overwatch', status: 'done', currentRank: 'Diamond', peakGoal: 'Platinum' },
  { game: 'Valorant', status: 'queued', currentRank: null, peakGoal: 'Ascendant' },
  { game: 'CS2', status: 'queued', currentRank: null, peakGoal: '15,000 Premier' },
]

describe('Yak2PeakTeaser', () => {
  it('renders the gated section heading', () => {
    render(<Yak2PeakTeaser ranks={RANKS} />)

    expect(screen.getByRole('heading', { name: copy.sections.yak2peakTeaser })).toBeInTheDocument()
  })

  it('features the latest completed game (last done entry) with its rank under the gated label', () => {
    render(<Yak2PeakTeaser ranks={RANKS} />)

    expect(screen.getByText(copy.yak2peakTeaser.latestDone)).toBeInTheDocument()
    expect(screen.getByText('Overwatch')).toBeInTheDocument()
    expect(screen.getByText(/Diamond/)).toBeInTheDocument()
  })

  it('features the next queued game (first queued entry) under the gated label with its goal', () => {
    render(<Yak2PeakTeaser ranks={RANKS} />)

    expect(screen.getByText(copy.yak2peakTeaser.nextUp)).toBeInTheDocument()
    expect(screen.getByText('Valorant')).toBeInTheDocument()
    expect(screen.getByText(`${copy.yak2peakTeaser.goalPrefix} Ascendant`)).toBeInTheDocument()
  })

  it('links through to the full yak2peak page', () => {
    render(<Yak2PeakTeaser ranks={RANKS} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/yak2peak')
  })

  it('omits the completed feature when nothing is done yet', () => {
    const queuedOnly: readonly RankEntry[] = [
      { game: 'Valorant', status: 'queued', currentRank: null, peakGoal: 'Ascendant' },
    ]

    render(<Yak2PeakTeaser ranks={queuedOnly} />)

    expect(screen.queryByText('Overwatch')).not.toBeInTheDocument()
    expect(screen.getByText('Valorant')).toBeInTheDocument()
  })

  it('omits the next-up feature when nothing is queued', () => {
    const doneOnly: readonly RankEntry[] = [
      {
        game: 'Rocket League',
        status: 'done',
        currentRank: 'Grand Champion',
        peakGoal: 'Champion',
      },
    ]

    render(<Yak2PeakTeaser ranks={doneOnly} />)

    expect(screen.getByText('Rocket League')).toBeInTheDocument()
    expect(screen.queryByText('Valorant')).not.toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Yak2PeakTeaser ranks={RANKS} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
