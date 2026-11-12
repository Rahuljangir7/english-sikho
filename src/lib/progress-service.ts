import type { Prisma } from '../../generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { computeStreakUpdate } from '@/lib/streaks'
import type { LeaderboardEntry, ProgressSnapshot, RecentAttemptItem } from '@/types/curriculum'

export async function getUserProgressData(userId: string): Promise<{
  progress: ProgressSnapshot
  recentAttempts: RecentAttemptItem[]
}> {
  const [rows, attempts] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId },
      orderBy: { lastVisitedAt: 'desc' },
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        lesson: {
          select: { title: true },
        },
      },
    }),
  ])

  const completed: Record<string, boolean> = {}
  const scores: Record<string, { score: number; total: number }> = {}

  for (const row of rows) {
    if (row.completed) {
      completed[row.lessonId] = true
    }
    if (row.bestScore !== null && row.totalQuestions !== null) {
      scores[row.lessonId] = {
        score: row.bestScore,
        total: row.totalQuestions,
      }
    }
  }

  return {
    progress: {
      completed,
      scores,
      last: rows[0]?.lessonId ?? null,
    },
    recentAttempts: attempts.map((a) => ({
      id: a.id,
      lessonId: a.lessonId,
      lessonTitle: a.lesson.title,
      score: a.score,
      total: a.total,
      passed: a.passed,
      createdAt: a.createdAt.toISOString(),
    })),
  }
}

export async function mergeGuestProgress(
  tx: Prisma.TransactionClient,
  userId: string,
  guestProgress?: ProgressSnapshot | null,
): Promise<void> {
  if (!guestProgress) return

  const completedIds = Object.keys(guestProgress.completed || {}).filter(
    (id) => guestProgress.completed[id],
  )
  const scoreIds = Object.keys(guestProgress.scores || {})
  const candidateIds = Array.from(
    new Set([
      ...completedIds,
      ...scoreIds,
      ...(guestProgress.last ? [guestProgress.last] : []),
    ]),
  )

  if (candidateIds.length === 0) return

  const validLessons = await tx.lesson.findMany({
    where: { id: { in: candidateIds } },
    select: { id: true },
  })
  const validSet = new Set(validLessons.map((l) => l.id))
  const now = new Date()

  let newCompletedCount = 0

  for (const lessonId of candidateIds) {
    if (!validSet.has(lessonId)) continue

    const isCompleted = Boolean(guestProgress.completed?.[lessonId])
    const guestScore = guestProgress.scores?.[lessonId]

    const existing = await tx.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    })

    const mergedBestScore =
      guestScore && typeof guestScore.score === 'number'
        ? Math.max(existing?.bestScore ?? 0, guestScore.score)
        : existing?.bestScore ?? null

    const mergedTotal =
      guestScore && typeof guestScore.total === 'number'
        ? guestScore.total
        : existing?.totalQuestions ?? null

    const shouldAwardXp = isCompleted && !existing?.xpAwarded
    if (shouldAwardXp) newCompletedCount += 1

    const visitedTime =
      guestProgress.last === lessonId ? new Date(now.getTime() + 1) : now

    await tx.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        completed: Boolean(existing?.completed) || isCompleted,
        xpAwarded: Boolean(existing?.xpAwarded) || isCompleted,
        bestScore: mergedBestScore,
        totalQuestions: mergedTotal,
        lastVisitedAt:
          guestProgress.last === lessonId ? visitedTime : existing?.lastVisitedAt ?? now,
        completedAt:
          existing?.completedAt ?? (isCompleted ? now : null),
      },
      create: {
        userId,
        lessonId,
        completed: isCompleted,
        xpAwarded: isCompleted,
        bestScore: mergedBestScore,
        totalQuestions: mergedTotal,
        lastVisitedAt: visitedTime,
        completedAt: isCompleted ? now : null,
      },
    })
  }

  if (newCompletedCount > 0) {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        xp: true,
        currentStreak: true,
        longestStreak: true,
        lastActivityDate: true,
      },
    })

    if (user) {
      const streak = computeStreakUpdate(
        user.lastActivityDate,
        user.currentStreak,
        user.longestStreak,
        now,
      )
      await tx.user.update({
        where: { id: userId },
        data: {
          xp: user.xp + newCompletedCount * 50,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActivityDate: streak.lastActivityDate,
        },
      })
    }
  }
}

export async function getLeaderboardData(currentUserId?: string | null): Promise<{
  entries: LeaderboardEntry[]
  totalLearners: number
  currentUserRank: number | null
}> {
  try {
    const [topUsers, totalLearners] = await Promise.all([
      prisma.user.findMany({
        take: 25,
        orderBy: [{ xp: 'desc' }, { currentStreak: 'desc' }, { createdAt: 'asc' }],
        select: {
          id: true,
          name: true,
          xp: true,
          currentStreak: true,
          longestStreak: true,
          _count: {
            select: {
              progress: {
                where: { completed: true },
              },
            },
          },
        },
      }),
      prisma.user.count(),
    ])

    const entries: LeaderboardEntry[] = topUsers.map((u, idx) => ({
      rank: idx + 1,
      id: u.id,
      name: u.name,
      xp: u.xp,
      currentStreak: u.currentStreak,
      longestStreak: u.longestStreak,
      completedCount: u._count.progress,
      isCurrentUser: currentUserId ? u.id === currentUserId : false,
    }))

    let currentUserRank: number | null = null
    if (currentUserId) {
      const found = entries.find((e) => e.id === currentUserId)
      if (found) {
        currentUserRank = found.rank
      } else {
        const me = await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { xp: true, currentStreak: true },
        })
        if (me) {
          const higherCount = await prisma.user.count({
            where: {
              OR: [
                { xp: { gt: me.xp } },
                { xp: me.xp, currentStreak: { gt: me.currentStreak } },
              ],
            },
          })
          currentUserRank = higherCount + 1
        }
      }
    }

    return { entries, totalLearners, currentUserRank }
  } catch {
    return { entries: [], totalLearners: 0, currentUserRank: null }
  }
}
