// jest-axe's types only augment jest's global `Matchers` and `@jest/expect`.
// vitest 5's `Assertion` no longer inherits jest's global namespace, so the
// matcher registered in tests/setup.ts needs its own declaration here.
import 'vitest'

declare module 'vitest' {
  // T must stay: augmentations need vitest's exact type parameters.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    toHaveNoViolations(): R
  }
}
