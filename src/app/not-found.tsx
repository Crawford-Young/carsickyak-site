import Link from 'next/link'

import { copy } from '@/lib/copy'

export default function NotFound(): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {copy.notFound.line}
      </h1>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 transition-colors hover:underline"
      >
        {copy.notFound.homeLabel}
      </Link>
    </main>
  )
}
