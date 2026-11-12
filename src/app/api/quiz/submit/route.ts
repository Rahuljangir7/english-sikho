import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { computeQuizXp, computeStreakUpdate, PASS_THRESHOLD } from '@/lib/streaks'
import type { QuizAnswerReview } from '@/types/curriculum'

const submitSchema = z.object({
  lessonId: z.string().min(1),
  answers: z.array(z.number().int().min(0)).min(1),
})

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = submitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid quiz submission.' }, { status: 400 })
    }

    const { lessonId, answers } = parsed.data

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 })
    }

    if (lesson.questions.length === 0) {
      return NextResponse.json(
        { error: 'Quiz questions are not seeded in the database yet.' },
        { status: 503 },
      )
    }

    if (answers.length !== lesson.questions.length) {
      return NextResponse.json(
        { error: 'Sabhi sawaalon ke jawab select karein.' },
        { status: 400 },
      )
    }

    const results: QuizAnswerReview[] = lesson.questions.map((q, idx) => {
      const chosen = answers[idx]
      const options = Array.isArray(q.options)
        ? q.options.filter((opt): opt is string => typeof opt === 'string')
        : []
      const isCorrect = chosen === q.answer
      return {
        questionIndex: idx,
        question: q.question,
        options,
        chosen,
        correct: q.answer,
        isCorrect,
        explain: q.explain,
      }
    })

    const score = results.filter((r) => r.isCorrect).length
    const total = lesson.questions.length
    const passed = score / total >= PASS_THRESHOLD
    const now = new Date()

    const saved = await prisma.$transaction(async (tx) => {
      await tx.quizAttempt.create({
        data: {
          userId: user.id,
          lessonId,
          score,
          total,
          passed,
          answers,
        },
      })

      const existing = await tx.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId } },
      })

      const bestScore = Math.max(existing?.bestScore ?? 0, score)
      const nextCompleted = Boolean(existing?.completed) || passed
      const firstCompletion = passed && !existing?.xpAwarded

      await tx.lessonProgress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        update: {
          completed: nextCompleted,
          xpAwarded: Boolean(existing?.xpAwarded) || passed,
          bestScore,
          totalQuestions: total,
          lastVisitedAt: now,
          completedAt: existing?.completedAt ?? (passed ? now : null),
        },
        create: {
          userId: user.id,
          lessonId,
          completed: passed,
          xpAwarded: passed,
          bestScore,
          totalQuestions: total,
          lastVisitedAt: now,
          completedAt: passed ? now : null,
        },
      })

      const xpGain = computeQuizXp({
        score,
        total,
        passed,
        firstCompletion,
      })

      const streak = computeStreakUpdate(
        user.lastActivityDate,
        user.currentStreak,
        user.longestStreak,
        now,
      )

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          xp: user.xp + xpGain,
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

      return {
        bestScore,
        completed: nextCompleted,
        xpGain,
        stats: {
          ...updatedUser,
          lastActivityDate: updatedUser.lastActivityDate
            ? updatedUser.lastActivityDate.toISOString()
            : null,
        },
      }
    })

    return NextResponse.json({
      score,
      total,
      passed,
      bestScore: saved.bestScore,
      completed: saved.completed,
      xpGain: saved.xpGain,
      results,
      stats: saved.stats,
    })
  } catch (error) {
    console.error('Quiz submit error:', error)
    return NextResponse.json({ error: 'Quiz submit nahi ho paya.' }, { status: 500 })
  }
}
