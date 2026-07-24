<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project notes (CarsickYak site)

- Workspace standards live in `~/code/CLAUDE.md` → `~/code/web/CLAUDE.md` — pnpm only, TDD, 100% coverage (statements/branches/functions/lines), Conventional Commits, rebase-only git.
- **No DB, no auth, no rate limiting (v1).** The site reads external APIs (Twitch live status, YouTube feeds) through cached, Zod-validated server adapters with typed fallbacks. There are no mutation endpoints and no Server Actions.
- **Adapter fallback contract:** adapter failures NEVER break a page — every adapter returns a typed fallback (`{ live: false }`, `[]`), logs via Pino (`@/lib/logger`), and captures to Sentry. Both adapters start with `import 'server-only'`; client components may `import type` from them but never value-import.
- **Theme:** built on `@crawfordyoung/ui`'s carsickyak preset (`@crawfordyoung/ui/themes/carsickyak.css`), applied via the `theme-carsickyak` class on `<html>`. The site is **dark-first** — `next-themes` `defaultTheme="dark"` (matches the web-domain dark default); full light mode ships via the absence of the `.dark` class. `tailwind.config.ts` is consumed by Tailwind v4 through the `@config` directive in `src/app/globals.css`.
- **Env:** `src/env.ts` (t3-env) is a frozen contract surface — adapters consume it, never edit it. All server vars validated at startup. `.env.local` holds real credentials locally (gitignored, never committed); `.env.example` documents every var.
- **Copy:** every site-authored user-facing string lives in `src/lib/copy.ts` (yak-voice gated) — pages and components consume from there, never inline literals. Exception: `@crawfordyoung/ui` built-in labels (e.g. `RouteErrorFallback` defaults) stay library copy.
- **Ranks data:** `src/data/ranks.json` is a byte-identical copy of `docs/web/carsickyak/assets/yak2peak/ranks.json` (docs repo = source of truth); Zod-parsed at import in `src/lib/ranks.ts`. Update workflow in `README.md`.
- **Fonts:** `next/font/google` — Inter (`--font-sans`), Fraunces (`--font-serif`). No external font CDN links.
- **Storybook:** `@storybook/nextjs-vite`. Dark mode is a toolbar Theme control (`.storybook/preview.tsx` decorator toggles `.dark` inside the `theme-carsickyak` scope). Vitest runs as a standalone node/happy-dom project — the Storybook browser-test vitest project was intentionally NOT wired (deterministic gate on Windows); `just storybook-build` builds Storybook on its own.
- **Vitest server-module trap:** happy-dom (the default test env) trips t3-env's `isServer` check — tests for server modules (adapters, anything importing `@/env`) need `// @vitest-environment node` at the top, stubs for all required env vars, and hoisted mock refs. Pattern: `src/lib/__tests__/twitch.test.ts`.
- **lucide-react has NO brand icons** (Twitch/YouTube/Instagram/X all undefined exports) — social links are text links (`site-footer.tsx`); an icon version means sourcing brand SVGs explicitly.
- **Coverage exclusions** (`vitest.config.ts`): `src/app/**`, `src/components/providers/**`, `src/env.ts`, `src/lib/logger.ts`, `src/stories/**` — infra/entry files without meaningful unit surface. Everything else must hit 100%.
