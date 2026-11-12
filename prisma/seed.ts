import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { Prisma, PrismaClient } from '../generated/prisma/client'
import { curriculumSeed } from '../src/data/curriculum'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
})

const prisma = new PrismaClient({ adapter })

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

async function main() {
  let globalLessonOrder = 0

  for (let mIdx = 0; mIdx < curriculumSeed.length; mIdx += 1) {
    const mod = curriculumSeed[mIdx]
    await prisma.module.upsert({
      where: { id: mod.id },
      update: {
        order: mIdx + 1,
        title: mod.title,
        titleHi: mod.titleHi,
        desc: mod.desc,
        emoji: mod.emoji,
        accent: mod.accent,
      },
      create: {
        id: mod.id,
        order: mIdx + 1,
        title: mod.title,
        titleHi: mod.titleHi,
        desc: mod.desc,
        emoji: mod.emoji,
        accent: mod.accent,
      },
    })

    for (const lesson of mod.lessons) {
      globalLessonOrder += 1
      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: {
          moduleId: mod.id,
          order: globalLessonOrder,
          title: lesson.title,
          titleHi: lesson.titleHi,
          summary: lesson.summary,
          concept: toJson(lesson.concept),
          formula: toJson(lesson.formula),
          examples: toJson(lesson.examples),
          signals: toJson(lesson.signals),
          rules: toJson(lesson.rules),
          mistakes: toJson(lesson.mistakes),
        },
        create: {
          id: lesson.id,
          moduleId: mod.id,
          order: globalLessonOrder,
          title: lesson.title,
          titleHi: lesson.titleHi,
          summary: lesson.summary,
          concept: toJson(lesson.concept),
          formula: toJson(lesson.formula),
          examples: toJson(lesson.examples),
          signals: toJson(lesson.signals),
          rules: toJson(lesson.rules),
          mistakes: toJson(lesson.mistakes),
        },
      })

      for (let qIdx = 0; qIdx < lesson.quiz.length; qIdx += 1) {
        const q = lesson.quiz[qIdx]
        await prisma.quizQuestion.upsert({
          where: {
            lessonId_order: {
              lessonId: lesson.id,
              order: qIdx + 1,
            },
          },
          update: {
            question: q.q,
            options: toJson(q.options),
            answer: q.answer,
            explain: q.explain,
          },
          create: {
            lessonId: lesson.id,
            order: qIdx + 1,
            question: q.q,
            options: toJson(q.options),
            answer: q.answer,
            explain: q.explain,
          },
        })
      }
    }
  }

  // Seed a demo learner profile only if no users exist yet
  const userCount = await prisma.user.count()
  if (userCount === 0) {
    const passwordHash = await bcrypt.hash('Demo@1234', 10)
    const now = new Date()
    const demoUser = await prisma.user.create({
      data: {
        name: 'Aarav Learner',
        email: 'demo@englishsikho.app',
        passwordHash,
        dailyGoalMinutes: 15,
        speechRate: 0.9,
        currentStreak: 3,
        longestStreak: 3,
        lastActivityDate: now,
        xp: 170,
      },
    })

    await prisma.lessonProgress.createMany({
      data: [
        {
          userId: demoUser.id,
          lessonId: 'sentence-ka-dhancha',
          completed: true,
          xpAwarded: true,
          bestScore: 4,
          totalQuestions: 4,
          lastVisitedAt: now,
          completedAt: now,
        },
        {
          userId: demoUser.id,
          lessonId: 'verb-ke-5-roop',
          completed: true,
          xpAwarded: true,
          bestScore: 4,
          totalQuestions: 4,
          lastVisitedAt: now,
          completedAt: now,
        },
      ],
    })
  }

  console.log(`Seeded ${curriculumSeed.length} modules and ${globalLessonOrder} lessons into PostgreSQL.`)
}

main()
  .catch((err) => {
    console.error('Seed error:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
