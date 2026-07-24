/**
 * Re-export of the exact `@crawfordyoung/ui` primitives the site consumes.
 * Components import UI primitives from here (`@/lib/ui`) — never directly from
 * the package or as raw styled HTML — so the surface we depend on stays small
 * and swappable in one place.
 */
export { Button, Separator } from '@crawfordyoung/ui'
