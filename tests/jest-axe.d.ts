import 'vitest'
import type { axe } from 'jest-axe'

type AxeRunResults = Awaited<ReturnType<typeof axe>>

// vitest 5 no longer folds the global `jest.Matchers` namespace into its own
// assertion type, so the augmentation @types/jest-axe ships (jest-only) stopped
// reaching `expect()`. Custom matchers are now typed by augmenting vitest's
// `Matchers` interface; the runtime half is `expect.extend` in tests/setup.ts.
// The type parameters must repeat vitest's declaration exactly to merge with it.
declare module 'vitest' {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    /** Asserts that an axe run reported no violations. Only offered on axe results. */
    toHaveNoViolations: T extends AxeRunResults ? () => R : never
  }
}
