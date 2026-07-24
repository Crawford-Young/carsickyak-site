'use client'

/**
 * Re-export of the exact `@crawfordyoung/ui` primitives the site consumes.
 * Components import UI primitives from here (`@/lib/ui`) — never directly from
 * the package or as raw styled HTML — so the surface we depend on stays small
 * and swappable in one place.
 *
 * The `'use client'` boundary is required: the `@crawfordyoung/ui` barrel calls
 * `React.createContext` at module top-level without its own `'use client'`
 * directive, so importing any primitive into a Server Component (e.g. the
 * footer) otherwise throws "createContext only works in Client Components".
 * Marking this re-export as a client module evaluates that barrel in the client
 * graph, where `createContext` is legal.
 */
export { Button, RouteErrorFallback, Separator } from '@crawfordyoung/ui'
