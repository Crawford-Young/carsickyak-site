# carsickyak-site

The CarsickYak hub site — live Twitch status, YouTube feeds, and Yak2Peak ranks —
deployed at `carsickyak.crawfordyoung.dev`. Next.js App Router, server-first RSC,
built on the `@crawfordyoung/ui` carsickyak theme preset.

## Stack

- **Framework:** Next.js (App Router) — Server Components by default
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (`@config` pattern) + `@crawfordyoung/ui` carsickyak theme
- **Theme:** dark-first (`next-themes`, `defaultTheme="dark"`), full light mode without `.dark`
- **Fonts:** `next/font` — Inter (sans), Fraunces (serif)
- **Validation:** Zod at all boundaries; `t3-env` validates env at startup
- **Testing:** Vitest (100% coverage) + MSW · Playwright e2e · Storybook
- **Observability:** Pino logging · Sentry error monitoring · Vercel Analytics + Speed Insights
- **Deploy:** Vercel

There is **no database, no auth, and no rate limiting** in v1 — the site reads
external APIs (Twitch, YouTube) through cached, Zod-validated adapters with typed
fallbacks. No mutation endpoints.

## Setup

```sh
pnpm install
cp .env.example .env.local   # then fill in real values (see below)
just dev                     # http://localhost:3000
```

### Environment variables

All server vars are validated at startup by `src/env.ts`. See `.env.example` for the
full list with obtain-instructions. Summary:

| Var                                         | Purpose                    | Where to get it                                                  |
| ------------------------------------------- | -------------------------- | ---------------------------------------------------------------- |
| `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | live-status app token      | https://dev.twitch.tv/console/apps                               |
| `YOUTUBE_API_KEY`                           | video feeds                | Google Cloud console, YouTube Data API v3 enabled                |
| `YOUTUBE_CHANNEL_ID`                        | the @CarsickYak channel id | `GET youtube/v3/channels?forHandle=CarsickYak&part=id&key=<key>` |
| `YOUTUBE_COVERS_PLAYLIST_ID`                | optional covers playlist   | YouTube Studio (optional)                                        |
| `SENTRY_DSN`                                | error monitoring           | Sentry project settings (optional locally)                       |
| `NEXT_PUBLIC_APP_URL`                       | base URL for metadata/OG   | `http://localhost:3000` locally                                  |

`.env.local` is gitignored and never committed.

## Commands

All commands run through `just` (see `justfile`):

| Command                | Does                                          |
| ---------------------- | --------------------------------------------- |
| `just dev`             | dev server                                    |
| `just build`           | production build                              |
| `just check`           | lint + typecheck + test + e2e (the full gate) |
| `just test`            | Vitest with coverage                          |
| `just e2e`             | Playwright end-to-end                         |
| `just lint`            | ESLint + Prettier check                       |
| `just typecheck`       | `tsc --noEmit`                                |
| `just storybook`       | Storybook dev server (port 6006)              |
| `just storybook-build` | static Storybook build                        |

## Updating Yak2Peak ranks

Rank data ships as committed JSON — no CMS, no database.

1. Edit the source of truth in the docs repo:
   `~/code/docs/web/carsickyak/assets/yak2peak/ranks.json`
2. Copy it byte-identical into the site: `src/data/ranks.json`
   (both sides stay prettier-formatted — format the docs source, then copy).
3. Run `just test` — `src/lib/ranks.ts` Zod-validates the JSON at import, so a bad
   shape fails the suite immediately.
4. Commit on a branch (`chore: update yak2peak ranks`), PR, merge — Vercel redeploys
   with the new data.

Entry shape: `{ game, status: "done" | "doing" | "queued", currentRank (nullable), peakGoal }`.

## Conventions

- Conventional Commits, enforced by commitlint. Husky runs lint-staged (pre-commit),
  commitlint (commit-msg), and `tsc --noEmit` (pre-push).
- Rebase-only git; never commit to `main`.
- Vitest thresholds are 100% across statements, branches, functions, and lines.
