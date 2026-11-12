import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserProgressData } from '@/lib/progress-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ user: null, progress: null, recentAttempts: [] })
  }

  try {
    const { progress, recentAttempts } = await getUserProgressData(user.id)
    return NextResponse.json({ user, progress, recentAttempts })
  } catch {
    return NextResponse.json({ user, progress: null, recentAttempts: [] })
  }
}
