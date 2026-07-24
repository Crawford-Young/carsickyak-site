import { describe, expect, it } from 'vitest'

import { cn } from '@/lib/utils'

describe('cn', () => {
  it('joins class name strings', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy conditional classes', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c')
  })

  it('merges conflicting tailwind utilities, last wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
