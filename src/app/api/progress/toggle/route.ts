import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { computeStreakUpdate } from '@/lib/streaks'

const toggleSchema = z.object({
  lessonId: z.string().min(1),
})

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = toggleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid lessonId.' }, { status: 400 })
    }

    const { lessonId } = parsed.data
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 })
    }

    const now = new Date()

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId } },
      })

      const nextCompleted = !existing?.completed
      const awardXp = nextCompleted && !existing?.xpAwarded

      await tx.lessonProgress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        update: {
          completed: nextCompleted,
          xpAwarded: Boolean(existing?.xpAwarded) || nextCompleted,
          completedAt: nextCompleted ? existing?.completedAt ?? now : null,
          lastVisitedAt: now,
        },
        create: {
          userId: user.id,
          lessonId,
          completed: true,
          xpAwarded: true,
          completedAt: now,
          lastVisitedAt: now,
        },
      })

      let updatedStats = {
        xp: user.xp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActivityDate: user.lastActivityDate,
      }

      if (nextCompleted) {
        const streak = computeStreakUpdate(
          user.lastActivityDate,
          user.currentStreak,
          user.longestStreak,
          now,
        )
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            xp: user.xp + (awardXp ? 50 : 0),
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastActivityDate: streak.lastActivityDate,
          },
          select: {
            xp: true,
            currentStreak: true,
            longestStreak: true,
            lastActivityDate: true,
          },
        })
        updatedStats = {
          ...updatedUser,
          lastActivityDate: updatedUser.lastActivityDate
            ? updatedUser.lastActivityDate.toISOString()
            : null,
        }
      }

      return { completed: nextCompleted, stats: updatedStats }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Toggle progress error:', error)
    return NextResponse.json({ error: 'Failed to update progress.' }, { status: 500 })
  }
}
