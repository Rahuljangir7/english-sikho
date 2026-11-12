'use client'

import Link from 'next/link'
import { usePlatform } from './PlatformProvider'

export default function Footer() {
  const { totalLessons } = usePlatform()

  return (
    <footer className="print:hidden mt-16 border-t border-ink-50 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-sm text-ink-600 sm:flex-row sm:px-6 sm:text-left">
        <p>
          <strong className="text-ink-900">English Sikho</strong> — {totalLessons} lessons, ek
          aasan safar sabke liye.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/cheatsheet" className="hover:text-ink-900">
            Cheat Sheet
          </Link>
          <Link href="/leaderboard" className="hover:text-ink-900">
            Leaderboard
          </Link>
          <span>Roz sirf 15 minute — bas itna kaafi hai.</span>
        </div>
      </div>
    </footer>
  )
}
