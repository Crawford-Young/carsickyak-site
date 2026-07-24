import Image from 'next/image'

import { copy } from '@/lib/copy'

const HERO_PHOTO = '/photos/cy-photo-ridgeline-sunrise.jpeg'
const HERO_LOCKUP = '/brand/cy-lockup-horizontal-light.svg'
const LOCKUP_WIDTH_PX = 320
const LOCKUP_HEIGHT_PX = 72

export function Hero(): React.JSX.Element {
  return (
    <section className="flex flex-col">
      <div className="relative flex min-h-[68vh] flex-col items-center justify-center gap-8 overflow-hidden px-6 py-24 text-center">
        <Image
          src={HERO_PHOTO}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-black/60" />
        <div className="relative flex flex-col items-center gap-6">
          <Image
            src={HERO_LOCKUP}
            alt="CarsickYak"
            width={LOCKUP_WIDTH_PX}
            height={LOCKUP_HEIGHT_PX}
            priority
            className="w-56 max-w-[70vw] sm:w-72"
          />
          <h1 className="max-w-2xl font-serif text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {copy.hero.headline}
          </h1>
        </div>
      </div>
      <p className="text-muted-foreground mx-auto max-w-2xl px-6 py-10 text-center text-lg">
        {copy.hero.subline}
      </p>
    </section>
  )
}
