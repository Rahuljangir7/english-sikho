import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getLeaderboardData } from '@/lib/progress-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  const data = await getLeaderboardData(user?.id)
  return NextResponse.json(data)
}
