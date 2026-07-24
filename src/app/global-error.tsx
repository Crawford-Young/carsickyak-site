'use client'

import { RouteErrorFallback } from '@/lib/ui'

interface GlobalErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

// global-error replaces the root layout when the layout itself throws, so it must
// render its own <html>/<body> (Next.js contract). It is a root boundary — the
// nav is gone, so it passes homeHref to give the stranded user a way out.
export default function GlobalError({ error, reset }: GlobalErrorProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <RouteErrorFallback error={error} reset={reset} homeHref="/" />
      </body>
    </html>
  )
}
