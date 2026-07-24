import type { Metadata } from 'next'

import { RankLadder } from '@/components/yak2peak/rank-ladder'
import { copy } from '@/lib/copy'
import { ranks } from '@/lib/ranks'

export const metadata: Metadata = {
  title: copy.yak2peakLadder.pageTitle,
  description: copy.meta.yak2peak,
}

export default function Yak2PeakPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">
        {copy.yak2peakLadder.pageTitle}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{copy.yak2peak.intro}</p>
      <RankLadder ranks={ranks} />
      <p className="text-muted-foreground mt-16 text-center text-xs font-medium tracking-[0.2em] uppercase">
        {copy.yak2peak.motto}
      </p>
    </main>
  )
}
