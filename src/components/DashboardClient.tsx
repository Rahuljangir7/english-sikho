'use client'

import Link from 'next/link'
import { useState } from 'react'
import { accent } from '@/lib/theme'
import type { Lesson, Module } from '@/types/curriculum'
import { Icon } from './Icons'
import { usePlatform } from './PlatformProvider'

export default function DashboardClient({
  modules,
  allLessons,
}: {
  modules: Module[]
  allLessons: Lesson[]
}) {
  const { user, progress, stats, totalLessons, curriculumSource, isGuest, resetProgress } =
    usePlatform()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [resetting, setResetting] = useState(false)

  const completedIds = Object.keys(progress.completed).filter((id) => progress.completed[id])
  const completedCount = completedIds.length
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const firstIncomplete = allLessons.find((l) => !progress.completed[l.id])
  const continueLesson =
    progress.last && !progress.completed[progress.last]
      ? allLessons.find((l) => l.id === progress.last)
      : firstIncomplete
  const startLesson = continueLesson || firstIncomplete || allLessons[0]
  const allDone = totalLessons > 0 && completedCount === totalLessons

  const handleReset = async () => {
    setResetting(true)
    try {
      await resetProgress()
      setConfirmingReset(false)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Database notice only if DB isn't connected/seeded yet */}
      {curriculumSource !== 'database' && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p>
            <strong>Database Setup Note:</strong> Curriculum abhi local fallback se load ho raha hai
            ({curriculumSource === 'unseeded' ? 'PostgreSQL tables empty hain' : 'PostgreSQL offline hai'}).
            Run <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">npx prisma migrate dev && npm run db:seed</code> to enable accounts &amp; DB persistence.
          </p>
        </div>
      )}

      {/* Guest sync invitation banner */}
      {isGuest && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-indigo-50/70 px-5 py-3.5">
          <div className="flex items-center gap-3 text-sm text-ink-800">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-indigo-100 text-indigo-700">
              <Icon name="sparkle" className="h-4 w-4" />
            </span>
            <p>
              <strong>Guest Mode:</strong> Tumhari progress abhi is browser me save ho rahi hai.
              Free account banao taaki progress har device par sync ho aur Leaderboard me dikho!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold text-ink-900 hover:bg-indigo-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-ink-800"
            >
              Account Banao
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-700">
              <Icon name="sparkle" className="h-3.5 w-3.5 text-sun-500" />
              Beginner se shuru — {totalLessons} chhote lessons
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
              Namaste {user ? user.name : 'Learner'} 👋 <br />
              Aaj se <span className="text-ink-600">English tenses</span> clear!
            </h1>
            <p className="mt-4 max-w-xl text-ink-700">
              Ghabrane wali koi baat nahi. Hum sabse aasan cheez se shuru karte hain — sentence ka
              dhancha → verb forms → phir 12 tenses. Har lesson me Hindi explanation, examples
              (sun kar), aur practice quiz hai.
            </p>

            {startLesson && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={`/lessons/${startLesson.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-ink-800"
                >
                  {completedCount === 0
                    ? 'Yahan se shuru karo'
                    : allDone
                      ? 'Dobara revise karo'
                      : 'Wahin se jahan chhoda'}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link
                  href="/cheatsheet"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-7 py-3.5 text-sm font-semibold text-ink-900 transition-all hover:-translate-y-0.5 hover:bg-ink-50"
                >
                  <Icon name="map" className="h-4 w-4" />
                  Poora cheat sheet
                </Link>
              </div>
            )}
          </div>

          {/* Progress ring */}
          <div className="flex flex-col items-center justify-center">
            <ProgressRing percent={percent} />
            <p className="mt-4 text-center text-sm text-ink-600">
              <strong className="text-ink-900">{completedCount}</strong> / {totalLessons} lessons
              complete
            </p>
            {allDone && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                <Icon name="trophy" className="h-4 w-4" /> Sab complete! Legend 🎉
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Platform Live Stats */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon="flame"
          iconClass="text-amber-500"
          label="Current Streak"
          value={`${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}`}
          sub={`Best: ${stats.longestStreak}d`}
        />
        <StatCard
          icon="star"
          iconClass="text-sun-500"
          label="Total XP"
          value={`${stats.xp} XP`}
          sub="Quiz & lessons se"
        />
        <StatCard
          icon="checkCircle"
          iconClass="text-emerald-600"
          label="Completed"
          value={`${completedCount}/${totalLessons}`}
          sub={`${percent}% done`}
        />
        <StatCard
          icon="target"
          iconClass="text-indigo-600"
          label="Daily Goal"
          value={`${user?.dailyGoalMinutes ?? 15} min`}
          sub={user ? 'Saved in profile' : 'Default goal'}
        />
      </section>

      {/* How to use */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            n: '1',
            t: 'Padho',
            d: 'Concept, formula aur examples dhyan se dekho. Speaker button se suno.',
            i: 'book' as const,
          },
          {
            n: '2',
            t: 'Quiz do',
            d: 'Har lesson ke end me 4 sawaal — turant jawab, explanation aur review milega.',
            i: 'target' as const,
          },
          {
            n: '3',
            t: 'Complete karo',
            d: '60%+ sahi = lesson complete, XP & streak update. Sab kuch save hota hai.',
            i: 'checkCircle' as const,
          },
        ].map((s) => (
          <div key={s.n} className="rounded-3xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-ink-600 to-ink-900 font-display text-lg font-bold text-white">
                {s.n}
              </span>
              <Icon name={s.i} className="h-5 w-5 text-sun-500" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900">{s.t}</h3>
            <p className="mt-1 text-sm text-ink-700">{s.d}</p>
          </div>
        ))}
      </section>

      {/* Roadmap */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-ink-900">
              Tumhara Learning Path
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              Upar se neeche tak — isi order me padho. Koi lesson lock nahi hai, jaha chaaho jao.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900"
          >
            <Icon name="trophy" className="h-4 w-4 text-sun-500" />
            Leaderboard dekho
          </Link>
        </div>

        <div className="mt-6 space-y-8">
          {modules.map((m) => {
            const a = accent(m.accent)
            const modLessons = m.lessons
            const doneInModule = modLessons.filter((l) => progress.completed[l.id]).length
            return (
              <div key={m.id}>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl ${a.soft} text-2xl`}
                  >
                    {m.emoji}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-ink-900">{m.title}</h3>
                    <p className="text-sm text-ink-600">{m.titleHi}</p>
                  </div>
                  <span className={`rounded-full ${a.chip} px-3 py-1 text-xs font-semibold`}>
                    {doneInModule}/{modLessons.length}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-600">{m.desc}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {modLessons.map((l) => {
                    const done = Boolean(progress.completed[l.id])
                    const isNext = startLesson?.id === l.id
                    const best = progress.scores[l.id]
                    return (
                      <Link
                        key={l.id}
                        href={`/lessons/${l.id}`}
                        className={`group relative flex items-start gap-4 rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-card ${
                          done ? 'border-emerald-200' : 'border-ink-100'
                        }`}
                      >
                        <span
                          className={`grid h-10 w-10 flex-none place-items-center rounded-xl text-sm font-bold ${
                            done ? 'bg-emerald-100 text-emerald-700' : `${a.soft} ${a.softText}`
                          }`}
                        >
                          {done ? <Icon name="check" className="h-5 w-5" /> : l.order}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="truncate font-semibold text-ink-900">{l.title}</h4>
                            {isNext && !done && (
                              <span className="flex-none rounded-full bg-sun-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-900">
                                Start
                              </span>
                            )}
                            {best && (
                              <span className="flex-none rounded-full bg-ink-50 px-2 py-0.5 text-[10px] font-semibold text-ink-700">
                                Best: {best.score}/{best.total}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-sm text-ink-600">{l.summary}</p>
                        </div>
                        <Icon
                          name="arrowRight"
                          className="mt-2 h-4 w-4 flex-none text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-ink-700"
                        />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Reset */}
      {completedCount > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          {!confirmingReset ? (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50"
            >
              <Icon name="refresh" className="h-4 w-4" />
              Progress reset karo
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              <span>Poori progress aur XP reset kar dein? Ye wapas nahi aayegi.</span>
              <button
                type="button"
                disabled={resetting}
                onClick={handleReset}
                className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {resetting ? 'Resetting...' : 'Haan, Reset karo'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  iconClass,
  label,
  value,
  sub,
}: {
  icon: 'flame' | 'star' | 'checkCircle' | 'target'
  iconClass: string
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-600">{label}</span>
        <Icon name={icon} className={`h-4 w-4 ${iconClass}`} />
      </div>
      <p className="mt-2 font-display text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs text-ink-600">{sub}</p>
    </div>
  )
}

function ProgressRing({ percent }: { percent: number }) {
  const size = 168
  const stroke = 14
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (percent / 100) * circ
  return (
    <div className="relative grid place-items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e7ff"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4338ca" />
            <stop offset="1" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <span className="block font-display text-4xl font-extrabold text-ink-900">{percent}%</span>
        <span className="text-xs font-medium uppercase tracking-wider text-ink-600">complete</span>
      </div>
    </div>
  )
}
