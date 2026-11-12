import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserProgressData } from '@/lib/progress-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await getUserProgressData(user.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json({ error: 'Failed to load progress.' }, { status: 500 })
  }
}

export async function DELETE() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.$transaction([
      prisma.lessonProgress.deleteMany({ where: { userId: user.id } }),
      prisma.quizAttempt.deleteMany({ where: { userId: user.id } }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          xp: 0,
          currentStreak: 0,
          lastActivityDate: null,
        },
      }),
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Reset progress error:', error)
    return NextResponse.json({ error: 'Failed to reset progress.' }, { status: 500 })
  }
}
