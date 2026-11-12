'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from './Icons'
import { usePlatform } from './PlatformProvider'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, progress, stats, totalLessons, logout } = usePlatform()
  const [menuOpen, setMenuOpen] = useState(false)

  const completedCount = Object.values(progress.completed).filter(Boolean).length

  const isHome = pathname === '/'
  const isCheat = pathname === '/cheatsheet'
  const isLeaderboard = pathname === '/leaderboard'
  const isProfile = pathname === '/profile'

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    router.refresh()
  }

  const navLinkClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-50'
    }`

  return (
    <header className="print:hidden sticky top-0 z-40 border-b border-ink-50 bg-cream/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-ink-600 to-ink-900 font-display text-lg font-bold text-white">
            E
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-ink-900">English Sikho</span>
            <span className="hidden text-[11px] font-medium uppercase tracking-wider text-ink-600 sm:block">
              Tenses, step by step
            </span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Link href="/" className={navLinkClass(isHome)}>
            <Icon name="home" className="h-4 w-4" />
            Home
          </Link>
          <Link href="/cheatsheet" className={navLinkClass(isCheat)}>
            <Icon name="map" className="h-4 w-4" />
            Cheat Sheet
          </Link>
          <Link href="/leaderboard" className={navLinkClass(isLeaderboard)}>
            <Icon name="trophy" className="h-4 w-4" />
            Leaderboard
          </Link>
        </div>

        {/* Right Badges & Auth */}
        <div className="flex items-center gap-2">
          <span
            title="Current daily streak"
            className="hidden items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 sm:inline-flex"
          >
            <Icon name="flame" className="h-3.5 w-3.5 text-amber-500" />
            {stats.currentStreak}d
          </span>
          <span
            title="Completed lessons"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 sm:text-sm"
          >
            <Icon name="trophy" className="h-4 w-4 text-sun-500" />
            {completedCount}/{totalLessons}
          </span>

          {user ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/profile"
                className={navLinkClass(isProfile)}
                title="Profile & Settings"
              >
                <Icon name="user" className="h-4 w-4" />
                <span className="max-w-[110px] truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="inline-grid h-9 w-9 place-items-center rounded-full border border-ink-100 bg-white text-ink-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
              >
                <Icon name="login" className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
              >
                Join Free
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="inline-grid h-9 w-9 place-items-center rounded-full border border-ink-100 bg-white text-ink-700 md:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="border-t border-ink-50 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass(isHome)}
            >
              <Icon name="home" className="h-4 w-4" /> Home
            </Link>
            <Link
              href="/cheatsheet"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass(isCheat)}
            >
              <Icon name="map" className="h-4 w-4" /> Cheat Sheet
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass(isLeaderboard)}
            >
              <Icon name="trophy" className="h-4 w-4" /> Leaderboard
            </Link>
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass(isProfile)}
            >
              <Icon name="user" className="h-4 w-4" /> {user ? `${user.name} (Profile)` : 'Guest Settings'}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <Icon name="logout" className="h-4 w-4" /> Logout
              </button>
            ) : (
              <div className="mt-1 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full border border-ink-200 px-4 py-2 text-center text-sm font-semibold text-ink-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full bg-ink-900 px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
