import { NextResponse } from 'next/server'
import { z } from 'zod'
import { setSessionCookie, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserProgressData, mergeGuestProgress } from '@/lib/progress-service'

const guestProgressSchema = z
  .object({
    completed: z.record(z.string(), z.boolean()).default({}),
    scores: z
      .record(
        z.string(),
        z.object({
          score: z.number().int().min(0),
          total: z.number().int().min(1),
        }),
      )
      .default({}),
    last: z.string().nullable().default(null),
  })
  .optional()
  .nullable()

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Sahi email address daalein.')),
  password: z.string().min(1, 'Password daalein.'),
  guestProgress: guestProgressSchema,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid credentials.' },
        { status: 400 },
      )
    }

    const { email, password, guestProgress } = parsed.data
    const found = await prisma.user.findUnique({ where: { email } })

    if (!found || !(await verifyPassword(password, found.passwordHash))) {
      return NextResponse.json(
        { error: 'Email ya password galat hai.' },
        { status: 401 },
      )
    }

    if (guestProgress) {
      await prisma.$transaction(async (tx) => {
        await mergeGuestProgress(tx, found.id, guestProgress)
      })
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: found.id },
      select: {
        id: true,
        name: true,
        email: true,
        dailyGoalMinutes: true,
        speechRate: true,
        currentStreak: true,
        longestStreak: true,
        xp: true,
        lastActivityDate: true,
      },
    })

    await setSessionCookie(user.id)
    const { progress, recentAttempts } = await getUserProgressData(user.id)

    return NextResponse.json({
      user: {
        ...user,
        lastActivityDate: user.lastActivityDate ? user.lastActivityDate.toISOString() : null,
      },
      progress,
      recentAttempts,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Database connection check karein.' },
      { status: 500 },
    )
  }
}
