import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const visitSchema = z.object({
  lessonId: z.string().min(1),
})

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = visitSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid lessonId.' }, { status: 400 })
    }

    const { lessonId } = parsed.data
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 })
    }

    const now = new Date()
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: { lastVisitedAt: now },
      create: {
        userId: user.id,
        lessonId,
        lastVisitedAt: now,
      },
    })

    return NextResponse.json({ ok: true, last: lessonId })
  } catch (error) {
    console.error('Visit tracking error:', error)
    return NextResponse.json({ error: 'Failed to track visit.' }, { status: 500 })
  }
}
