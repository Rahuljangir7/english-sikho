import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    const [modules, lessons, users] = await Promise.all([
      prisma.module.count(),
      prisma.lesson.count(),
      prisma.user.count(),
    ])
    return NextResponse.json({
      ok: true,
      database: 'connected',
      seeded: modules > 0 && lessons > 0,
      counts: { modules, lessons, users },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        ok: false,
        database: 'disconnected',
        error: 'Unable to reach PostgreSQL database.',
      },
      { status: 503 },
    )
  }
}
