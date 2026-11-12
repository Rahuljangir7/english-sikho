import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Naam kam se kam 2 letters ka rakho.').max(60),
  dailyGoalMinutes: z.number().int().min(5).max(120),
  speechRate: z.number().min(0.6).max(1.3),
})

export async function PATCH(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid profile values.' },
        { status: 400 },
      )
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        dailyGoalMinutes: parsed.data.dailyGoalMinutes,
        speechRate: parsed.data.speechRate,
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

    return NextResponse.json({
      user: {
        ...updated,
        lastActivityDate: updated.lastActivityDate ? updated.lastActivityDate.toISOString() : null,
      },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Profile update failed.' }, { status: 500 })
  }
}
