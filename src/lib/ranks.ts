import { z } from 'zod'

import ranksJson from '@/data/ranks.json'

export const rankEntrySchema = z.object({
  game: z.string(),
  status: z.enum(['done', 'doing', 'queued']),
  currentRank: z.string().nullable(),
  peakGoal: z.string(),
})

export type RankEntry = z.infer<typeof rankEntrySchema>

export const ranks: readonly RankEntry[] = z.array(rankEntrySchema).parse(ranksJson)
