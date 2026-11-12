'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import type { ProgressSnapshot, RecentAttemptItem, UserProfile } from '@/types/curriculum'
import { Icon } from './Icons'
import { usePlatform } from './PlatformProvider'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const { getGuestProgressForSync, applyAuthSession } = usePlatform()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const guestProgress = getGuestProgressForSync()
  const guestDoneCount = guestProgress
    ? Object.values(guestProgress.completed).filter(Boolean).length
    : 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload =
        mode === 'login'
          ? { email, password, guestProgress }
          : { name, email, password, guestProgress }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Kuch galat ho gaya. Dobara try karein.')
        setLoading(false)
        return
      }

      applyAuthSession(
        data as {
          user: UserProfile
          progress: ProgressSnapshot
          recentAttempts: RecentAttemptItem[]
        },
      )
      router.push('/')
      router.refresh()
    } catch {
      setError('Server se connect nahi ho paya.')
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail('demo@englishsikho.app')
    setPassword('Demo@1234')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ink-600 to-ink-900 font-display text-2xl font-bold text-white">
            E
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
            {mode === 'login' ? 'Wapas Swagat Hai 👋' : 'Free Account Banao 🚀'}
          </h1>
          <p className="mt-1.5 text-sm text-ink-600">
            {mode === 'login'
              ? 'Apni progress, streaks aur quiz history access karo.'
              : 'Har device par progress save karo aur leaderboard join karo.'}
          </p>
        </div>

        {guestDoneCount > 0 && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
            Guest Mode ke tumhare <strong>{guestDoneCount} completed lessons</strong> aur quiz scores
            automatically is account me sync ho jayenge!
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                Tumhara Naam
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={60}
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
              Password
            </label>
            <input
              type="password"
              required
              minLength={mode === 'register' ? 6 : 1}
              placeholder={mode === 'register' ? 'Kam se kam 6 characters' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-600"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Login karo'
                : 'Account Create karo'}
            {!loading && <Icon name="arrowRight" className="h-4 w-4" />}
          </button>
        </form>

        {mode === 'login' && (
          <div className="mt-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-3 text-center">
            <p className="text-xs text-ink-700">
              Seeded demo account test karna hai?{' '}
              <button
                type="button"
                onClick={fillDemo}
                className="font-semibold text-ink-900 underline hover:text-ink-600"
              >
                Fill Demo Credentials
              </button>
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-ink-600">
          {mode === 'login' ? (
            <>
              Naye ho yahan?{' '}
              <Link href="/register" className="font-semibold text-ink-900 hover:underline">
                Free account banao
              </Link>
            </>
          ) : (
            <>
              Pehle se account hai?{' '}
              <Link href="/login" className="font-semibold text-ink-900 hover:underline">
                Login karo
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
