import { NextResponse } from 'next/server'

import { getLiveStatus } from '@/lib/twitch'

export async function GET(): Promise<NextResponse> {
  const status = await getLiveStatus()
  return NextResponse.json(status)
}
