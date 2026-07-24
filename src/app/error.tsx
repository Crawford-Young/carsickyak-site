'use client'

import { RouteErrorFallback } from '@/lib/ui'

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

export default function AppError({ error, reset }: ErrorProps): React.JSX.Element {
  return <RouteErrorFallback error={error} reset={reset} />
}
