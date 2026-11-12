import { fallbackAllLessons, fallbackModules, TOTAL_LESSONS } from '@/data/curriculum'
import { prisma } from '@/lib/prisma'
import type {
  AccentColor,
  Lesson,
  LessonExample,
  LessonFormula,
  LessonMistake,
  Module,
  QuizQuestionItem,
} from '@/types/curriculum'

export type CurriculumSource = 'database' | 'unseeded' | 'offline'

export interface CurriculumResult {
  modules: Module[]
  allLessons: Lesson[]
  totalLessons: number
  source: CurriculumSource
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function asFormula(value: unknown): LessonFormula {
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    return {
      positive: typeof v.positive === 'string' ? v.positive : '',
      negative: typeof v.negative === 'string' ? v.negative : '',
      question: typeof v.question === 'string' ? v.question : '',
    }
  }
  return { positive: '', negative: '', question: '' }
}

function asExamples(value: unknown): LessonExample[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => ({
      en: typeof item.en === 'string' ? item.en : '',
      hi: typeof item.hi === 'string' ? item.hi : '',
      ...(typeof item.note === 'string' ? { note: item.note } : {}),
    }))
}

function asMistakes(value: unknown): LessonMistake[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => ({
      wrong: typeof item.wrong === 'string' ? item.wrong : '',
      right: typeof item.right === 'string' ? item.right : '',
      why: typeof item.why === 'string' ? item.why : '',
    }))
}

function toAccent(value: string): AccentColor {
  if (value === 'amber' || value === 'indigo' || value === 'rose' || value === 'emerald') {
    return value
  }
  return 'indigo'
}

export async function getCurriculum(): Promise<CurriculumResult> {
  try {
    const rows = await prisma.module.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (rows.length === 0) {
      return {
        modules: fallbackModules,
        allLessons: fallbackAllLessons,
        totalLessons: TOTAL_LESSONS,
        source: 'unseeded',
      }
    }

    const modules: Module[] = rows.map((mod) => ({
      id: mod.id,
      order: mod.order,
      title: mod.title,
      titleHi: mod.titleHi,
      desc: mod.desc,
      emoji: mod.emoji,
      accent: toAccent(mod.accent),
      lessons: mod.lessons.map((lesson) => ({
        id: lesson.id,
        moduleId: mod.id,
        moduleTitle: mod.title,
        order: lesson.order,
        title: lesson.title,
        titleHi: lesson.titleHi,
        summary: lesson.summary,
        concept: asStringArray(lesson.concept),
        formula: asFormula(lesson.formula),
        examples: asExamples(lesson.examples),
        signals: asStringArray(lesson.signals),
        rules: asStringArray(lesson.rules),
        mistakes: asMistakes(lesson.mistakes),
        quiz: lesson.questions.map(
          (q): QuizQuestionItem => ({
            id: q.id,
            q: q.question,
            options: asStringArray(q.options),
            answer: q.answer,
            explain: q.explain,
          }),
        ),
      })),
    }))

    const allLessons = modules.flatMap((m) => m.lessons)
    return {
      modules,
      allLessons,
      totalLessons: allLessons.length,
      source: 'database',
    }
  } catch {
    return {
      modules: fallbackModules,
      allLessons: fallbackAllLessons,
      totalLessons: TOTAL_LESSONS,
      source: 'offline',
    }
  }
}
