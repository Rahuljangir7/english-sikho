import Link from 'next/link'
import { Icon } from '@/components/Icons'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-extrabold text-ink-900">Page nahi mila 😅</h1>
      <p className="mt-3 text-ink-600">
        Ye page exist nahi karta. Chalo home page par wapas chalte hain.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800"
      >
        <Icon name="arrowLeft" className="h-4 w-4" /> Home par jao
      </Link>
    </div>
  )
}
