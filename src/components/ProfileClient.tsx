'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Icon } from './Icons'
import { usePlatform } from './PlatformProvider'

const SPEECH_RATES = [
  { label: '0.75x (Slow)', value: 0.75 },
  { label: '0.9x (Natural)', value: 0.9 },
  { label: '1.0x (Normal)', value: 1.0 },
  { label: '1.15x (Fast)', value: 1.15 },
]

export default function ProfileClient() {
  const { user } = usePlatform()
  return <ProfileView key={user?.id ?? 'guest'} />
}

function ProfileView() {
  const {
    user,
    progress,
    stats,
    recentAttempts,
    speechRate,
    totalLessons,
    updateProfile,
    setGuestSpeechRate,
    resetProgress,
  } = usePlatform()

  const [name, setName] = useState(user?.name ?? 'Guest Learner')
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes ?? 15)
  const [rate, setRate] = useState(speechRate)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const completedCount = Object.values(progress.completed).filter(Boolean).length

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    if (!user) {
      setGuestSpeechRate(rate)
      setSaving(false)
      setMessage({ type: 'ok', text: 'Voice speed browser me save ho gayi!' })
      return
    }
    const res = await updateProfile({ name, dailyGoalMinutes, speechRate: rate })
    setSaving(false)
    if (res.ok) {
      setMessage({ type: 'ok', text: 'Profile settings PostgreSQL me save ho gayi!' })
    } else {
      setMessage({ type: 'err', text: res.error ?? 'Save failed.' })
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
        {user ? `${user.name} ka Profile` : 'Learner Settings'} ⚙️
      </h1>
      <p className="mt-2 text-ink-700">
        {user
          ? `Signed in as ${user.email}`
          : 'Abhi tum Guest Mode me ho. Account bana kar apni streak & quiz history hamesha save rakho.'}
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-ink-100 bg-white p-4">
          <span className="text-xs font-semibold uppercase text-ink-600">Total XP</span>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink-900">{stats.xp}</p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4">
          <span className="text-xs font-semibold uppercase text-ink-600">Current Streak</span>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink-900">
            {stats.currentStreak}d 🔥
          </p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4">
          <span className="text-xs font-semibold uppercase text-ink-600">Best Streak</span>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink-900">
            {stats.longestStreak}d
          </p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4">
          <span className="text-xs font-semibold uppercase text-ink-600">Lessons Done</span>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink-900">
            {completedCount}/{totalLessons}
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8"
      >
        <h2 className="font-display text-xl font-bold text-ink-900">Learning Preferences</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {user && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={60}
                className="mt-1.5 w-full rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-600"
              />
            </div>
          )}

          {user && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Daily Goal (Minutes)
              </label>
              <input
                type="number"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                min={5}
                max={120}
                className="mt-1.5 w-full rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-600"
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
              Pronunciation Speed (Speaker Button)
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SPEECH_RATES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRate(opt.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    Math.abs(rate - opt.value) < 0.01
                      ? 'border-ink-900 bg-ink-900 text-white'
                      : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {message && (
          <p
            className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-medium ${
              message.type === 'ok'
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Settings Save karo'}
          </button>
          {!user && (
            <Link
              href="/register"
              className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-900 hover:bg-ink-50"
            >
              Free Account Banao →
            </Link>
          )}
        </div>
      </form>

      {/* Recent Quiz Attempts */}
      <section className="mt-8 rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl font-bold text-ink-900">Recent Quiz Activity</h2>
        {recentAttempts.length === 0 ? (
          <p className="mt-3 text-sm text-ink-600">
            Abhi koi quiz attempt record nahi hai. Kisi lesson me jaake quiz try karo!
          </p>
        ) : (
          <div className="mt-4 divide-y divide-ink-50">
            {recentAttempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <Link
                    href={`/lessons/${a.lessonId}`}
                    className="font-semibold text-ink-900 hover:text-ink-600"
                  >
                    {a.lessonTitle}
                  </Link>
                  <p className="text-xs text-ink-600">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    a.passed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {a.score}/{a.total} {a.passed ? 'Passed' : 'Retry'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Danger zone */}
      <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-white p-5">
        <div>
          <p className="font-semibold text-ink-900">Reset Progress</p>
          <p className="text-xs text-ink-600">Sabhi completed lessons, scores aur XP 0 kar do.</p>
        </div>
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            <Icon name="refresh" className="h-3.5 w-3.5" /> Reset
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                await resetProgress()
                setConfirmReset(false)
              }}
              className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-full border border-ink-200 px-4 py-2 text-xs font-semibold text-ink-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
