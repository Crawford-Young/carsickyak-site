import type { Metadata } from 'next'

import { CoverGrid } from '@/components/covers/cover-grid'
import { copy } from '@/lib/copy'
import { getCoverVideos } from '@/lib/youtube'

export const metadata: Metadata = {
  title: copy.covers.pageTitle,
  description: copy.meta.covers,
}

export default async function CoversPage(): Promise<React.JSX.Element> {
  const videos = await getCoverVideos()
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {copy.covers.pageTitle}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{copy.covers.intro}</p>
      <CoverGrid videos={videos} />
    </main>
  )
}
