import { http, HttpResponse } from 'msw'

/**
 * MSW request handlers. Adapter-specific handlers (Twitch, YouTube) are added
 * per-test with `server.use(...)` as those adapters land (T5/T6). This baseline
 * keeps a health handler so the suite has at least one registered route.
 */
export const handlers = [
  http.get('https://example.com/health', () => HttpResponse.json({ ok: true })),
]
