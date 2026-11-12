'use client'

import Link from 'next/link'
import type { LeaderboardEntry } from '@/types/curriculum'
import { Icon } from './Icons'
import { usePlatform } from './PlatformProvider'

export default function LeaderboardClient({
  entries,
  totalLearners,
  currentUserRank,
}: {
  entries: LeaderboardEntry[]
  totalLearners: number
  currentUserRank: number | null
}) {
  const { user, stats, totalLessons } = usePlatform()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-700">
            <Icon name="trophy" className="h-3.5 w-3.5 text-sun-500" /> Community Rankings
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
            Learners Leaderboard 🏆
          </h1>
          <p className="mt-2 text-ink-700">
            Roz practice karo, quiz pass karo, aur XP + Streak badhao! Total registered learners:{' '}
            <strong className="text-ink-900">{totalLearners}</strong>
          </p>
        </div>

        {user && currentUserRank && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-ink-900">
            Tumhari Rank: <span className="text-ink-600">#{currentUserRank}</span> · {stats.xp} XP
          </div>
        )}
      </div>

      {!user && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p>
            Abhi tum <strong>Guest Mode</strong> me ho ({stats.xp} local XP). Account banao taaki
            tumhara naam bhi leaderboard par dikhe!
          </p>
          <Link
            href="/register"
            className="rounded-full bg-ink-900 px-5 py-2 text-xs font-semibold text-white hover:bg-ink-800"
          >
            Account Banao
          </Link>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
        {entries.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-600">
            Abhi leaderboard par koi learner nahi hai — ya PostgreSQL abhi connected nahi hai. Pehle
            signup karke #1 bano!
          </div>
        ) : (
          <div className="divide-y divide-ink-50">
            {entries.map((entry) => {
              const medal =
                entry.rank === 1
                  ? '🥇'
                  : entry.rank === 2
                    ? '🥈'
                    : entry.rank === 3
                      ? '🥉'
                      : `#${entry.rank}`
              return (
                <div
                  key={entry.id}
                  className={`flex flex-wrap items-center justify-between gap-4 px-5 py-4 ${
                    entry.isCurrentUser ? 'bg-indigo-50/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-50 font-display text-sm font-extrabold text-ink-900">
                      {medal}
                    </span>
                    <div>
                      <p className="font-semibold text-ink-900">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="ml-2 rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-ink-600">
                        {entry.completedCount}/{totalLessons} lessons complete
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                      <Icon name="flame" className="h-3.5 w-3.5 text-amber-500" />
                      {entry.currentStreak}d
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink-50 px-3 py-1 text-xs font-bold text-ink-900">
                      <Icon name="star" className="h-3.5 w-3.5 text-sun-500" />
                      {entry.xp} XP
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
