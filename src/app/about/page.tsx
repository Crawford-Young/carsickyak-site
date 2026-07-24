import type { Metadata } from 'next'
import Image from 'next/image'

import { copy } from '@/lib/copy'

export const metadata: Metadata = {
  title: copy.about.pageTitle,
  description: copy.meta.about,
}

interface Photo {
  readonly src: string
  readonly alt: string
}

const PHOTOS: readonly Photo[] = [
  {
    src: '/photos/cy-photo-misty-forest.jpeg',
    alt: 'Mist drifting through a dense evergreen forest at first light',
  },
  {
    src: '/photos/cy-photo-tent-sunrise.jpeg',
    alt: 'A backpacking tent pitched on a ridge as the sun rises over the mountains',
  },
  {
    src: '/photos/cy-photo-storm-light.jpeg',
    alt: 'Golden storm light breaking over a dark mountain ridgeline',
  },
]

export default function AboutPage(): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <section className="flex flex-col items-center text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          {copy.about.bio.name}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl text-base">{copy.about.bio.tagline}</p>
        <p className="mt-6 text-lg">{copy.about.bio.line}</p>
        <p className="mt-8 font-serif text-2xl font-semibold tracking-tight">
          {copy.about.philosophy}
        </p>
      </section>

      <section className="mt-20 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            {copy.about.ranked.heading}
          </h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            {copy.about.ranked.body}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            {copy.about.folk.heading}
          </h2>
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            {copy.about.folk.body}
          </p>
        </div>
      </section>

      <figure className="mt-20 flex flex-col items-center text-center">
        <blockquote className="max-w-2xl font-serif text-2xl leading-snug font-medium text-balance sm:text-3xl">
          {copy.about.quote.text}
        </blockquote>
        <figcaption className="text-muted-foreground mt-5 text-sm tracking-[0.2em] uppercase">
          <cite className="not-italic">{copy.about.quote.attribution}</cite>
        </figcaption>
      </figure>

      <section className="mt-20 grid gap-4 sm:grid-cols-3">
        {PHOTOS.map((photo) => (
          <div key={photo.src} className="relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </section>
    </main>
  )
}
