import { describe, expect, it } from 'vitest'

import { rankEntrySchema, ranks } from '@/lib/ranks'

describe('ranks', () => {
  it('parses the real ranks.json data at import time', () => {
    expect(ranks.length).toBeGreaterThan(0)
    for (const entry of ranks) {
      expect(rankEntrySchema.parse(entry)).toEqual(entry)
    }
  })

  it('rejects an entry with an invalid status enum value', () => {
    const invalidEntry = {
      game: 'Test Game',
      status: 'not-a-real-status',
      currentRank: null,
      peakGoal: 'Gold',
    }

    expect(() => rankEntrySchema.parse(invalidEntry)).toThrow()
  })
})
