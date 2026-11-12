import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@/components/Icons'
import LessonClient from '@/components/LessonClient'
import { getCurriculum } from '@/lib/curriculum-service'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { allLessons } = await getCurriculum()
  const lesson = allLessons.find((l) => l.id === id)
  if (!lesson) {
    return { title: 'Lesson Not Found' }
  }
  return {
    title: lesson.title,
    description: lesson.summary,
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { modules, allLessons } = await getCurriculum()

  const index = allLessons.findIndex((l) => l.id === id)
  const lesson = allLessons[index]

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900">Lesson nahi mila 😅</h1>
        <p className="mt-2 text-ink-600">Ye lesson link sahi nahi lag raha. Home se choose karo.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
        >
          <Icon name="arrowLeft" className="h-4 w-4" /> Home par jao
        </Link>
      </div>
    )
  }

  const mod = modules.find((m) => m.id === lesson.moduleId) ?? modules[0]
  const prev = index > 0 ? allLessons[index - 1] : null
  const next = index < allLessons.length - 1 ? allLessons[index + 1] : null

  return <LessonClient lesson={lesson} mod={mod} prev={prev} next={next} />
}
