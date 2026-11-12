import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, setSessionCookie } from '@/lib/auth'
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

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Naam kam se kam 2 letters ka hona chahiye.').max(60),
  email: z.string().trim().toLowerCase().pipe(z.email('Sahi email address daalein.')),
  password: z.string().min(6, 'Password kam se kam 6 characters ka hona chahiye.').max(128),
  guestProgress: guestProgressSchema,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
        { status: 400 },
      )
    }

    const { name, email, password, guestProgress } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Is email se account pehle se bana hai. Login karke dekho.' },
        { status: 409 },
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
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

      if (guestProgress) {
        await mergeGuestProgress(tx, created.id, guestProgress)
      }

      return tx.user.findUniqueOrThrow({
        where: { id: created.id },
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
    })

    await setSessionCookie(user.id)
    const { progress, recentAttempts } = await getUserProgressData(user.id)

    return NextResponse.json(
      {
        user: {
          ...user,
          lastActivityDate: user.lastActivityDate ? user.lastActivityDate.toISOString() : null,
        },
        progress,
        recentAttempts,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Account create nahi ho paya. Database connection check karein.' },
      { status: 500 },
    )
  }
}
