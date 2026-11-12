'use client'

import Link from 'next/link'
import { accent } from '@/lib/theme'
import type { Module } from '@/types/curriculum'
import { Icon } from './Icons'

export default function CheatSheetClient({ modules }: { modules: Module[] }) {
  const tenseModules = modules.filter((m) => m.id !== 'foundation')
  const foundation = modules.find((m) => m.id === 'foundation')

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-700">
            <Icon name="map" className="h-3.5 w-3.5 text-sun-500" /> Quick Revision
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
            Tenses Cheat Sheet 📋
          </h1>
          <p className="mt-2 max-w-2xl text-ink-700">
            Sabhi 12 tenses ke formula ek jagah. Jab bhi bhool jao, yahan aake 1 minute me revise
            kar lo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="print:hidden inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-50"
        >
          <Icon name="print" className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>

      {/* Foundation */}
      {foundation && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-extrabold text-ink-900">
            {foundation.emoji} {foundation.title} — neev
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {foundation.lessons.map((l) => (
              <Link
                key={l.id}
                href={`/lessons/${l.id}`}
                className="rounded-2xl border border-ink-100 bg-white p-4 transition-colors hover:bg-ink-50"
              >
                <h3 className="font-semibold text-ink-900">{l.title}</h3>
                <p className="mt-1 text-sm text-ink-600">{l.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tense tables per module */}
      {tenseModules.map((m) => {
        const a = accent(m.accent)
        return (
          <section key={m.id} className="mt-12 break-inside-avoid">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink-900">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${a.soft} text-xl`}>
                {m.emoji}
              </span>
              {m.title}
            </h2>

            <div className="mt-4 overflow-hidden rounded-2xl border border-ink-100 bg-white">
              <div className="hidden grid-cols-[1.1fr_1.4fr_1.4fr_1.4fr] gap-3 border-b border-ink-100 bg-ink-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-700 sm:grid">
                <span>Tense</span>
                <span>Positive</span>
                <span>Negative</span>
                <span>Question</span>
              </div>
              <div className="divide-y divide-ink-50">
                {m.lessons.map((l) => (
                  <div
                    key={l.id}
                    className="grid gap-3 px-4 py-4 sm:grid-cols-[1.1fr_1.4fr_1.4fr_1.4fr] sm:items-center"
                  >
                    <Link
                      href={`/lessons/${l.id}`}
                      className="font-semibold text-ink-900 hover:text-ink-600"
                    >
                      <span
                        className={`mr-2 inline-block h-2 w-2 rounded-full ${a.dot} align-middle`}
                      />
                      {l.title}
                    </Link>
                    <Formula label="Positive" value={l.formula.positive} />
                    <Formula label="Negative" value={l.formula.negative} />
                    <Formula label="Question" value={l.formula.question} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      <p className="mt-12 rounded-3xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-600">
        Tip: Formula yaad karna aasan ho jata hai jab tum ek hi verb (jaise <strong>go</strong>) le
        kar sabhi 12 tenses me sentence bana lo. Ek baar karke dekho — hamesha yaad rahega! 💡
      </p>
    </div>
  )
}

function Formula({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-ink-600 sm:hidden">
        {label}
      </span>
      <code className="text-sm text-ink-800">{value}</code>
    </div>
  )
}
