import { ContentStrip } from '@/components/home/content-strip'
import { Hero } from '@/components/home/hero'
import { LiveBand } from '@/components/home/live-band'
import { Yak2PeakTeaser } from '@/components/home/yak2peak-teaser'
import { ranks } from '@/lib/ranks'
import { getLiveStatus } from '@/lib/twitch'
import { getLatestVideos } from '@/lib/youtube'

export default async function HomePage(): Promise<React.JSX.Element> {
  const [status, videos] = await Promise.all([getLiveStatus(), getLatestVideos()])
  return (
    <main className="flex flex-col pb-12">
      <Hero />
      <LiveBand status={status} latestVideo={videos[0]} />
      <ContentStrip videos={videos} />
      <Yak2PeakTeaser ranks={ranks} />
    </main>
  )
}
