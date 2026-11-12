'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { accent } from '@/lib/theme'
import type { Lesson, Module } from '@/types/curriculum'
import { Icon } from './Icons'
import { usePlatform } from './PlatformProvider'
import Quiz from './Quiz'
import { RichText } from './RichText'
import SpeakButton from './SpeakButton'

export default function LessonClient({
  lesson,
  mod,
  prev,
  next,
}: {
  lesson: Lesson
  mod: Module
  prev: Lesson | null
  next: Lesson | null
}) {
  const { progress, recordVisit, toggleComplete } = usePlatform()
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    void recordVisit(lesson.id)
  }, [lesson.id, recordVisit])

  const a = accent(mod.accent)
  const done = Boolean(progress.completed[lesson.id])
  const score = progress.scores[lesson.id]

  const handleToggle = async () => {
    setToggling(true)
    try {
      await toggleComplete(lesson.id)
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
      >
        <Icon name="arrowLeft" className="h-4 w-4" /> Sab lessons
      </Link>

      <div
        className={`mt-6 inline-flex items-center gap-2 rounded-full ${a.chip} px-3.5 py-1.5 text-xs font-semibold`}
      >
        <span>{mod.emoji}</span>
        {mod.title} · Lesson {lesson.order}
      </div>

      <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
        {lesson.title}
      </h1>
      <p className="mt-1 text-lg font-medium text-ink-600">{lesson.titleHi}</p>
      <p className="mt-4 text-ink-700">{lesson.summary}</p>

      {done && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <Icon name="checkCircle" className="h-4 w-4" />
          Ye lesson complete hai{score ? ` · Best: ${score.score}/${score.total}` : ''}
        </div>
      )}

      {/* Concept */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Icon name="bulb" className="h-5 w-5 text-sun-500" /> Concept samjho
        </h2>
        <div className="mt-3 space-y-3">
          {lesson.concept.map((p, i) => (
            <p
              key={i}
              className="rounded-2xl border border-ink-50 bg-white p-4 leading-relaxed text-ink-700"
            >
              <RichText text={p} />
            </p>
          ))}
        </div>
      </section>

      {/* Formula */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Icon name="target" className="h-5 w-5 text-sun-500" /> Formula (yaad rakho)
        </h2>
        <div className="mt-3 grid gap-3">
          <FormulaRow label="Positive (+)" value={lesson.formula.positive} tone="emerald" />
          <FormulaRow label="Negative (−)" value={lesson.formula.negative} tone="rose" />
          <FormulaRow label="Question (?)" value={lesson.formula.question} tone="indigo" />
        </div>
      </section>

      {/* Signals */}
      {lesson.signals.length > 0 && (
        <section className="mt-9">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
            <Icon name="sparkle" className="h-5 w-5 text-sun-500" /> Signal Words (pehchan)
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Ye words dikhein to samjho yehi tense lagana hai.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {lesson.signals.map((s) => (
              <span
                key={s}
                className="rounded-full border border-ink-100 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Examples */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Icon name="book" className="h-5 w-5 text-sun-500" /> Examples (sun kar bhi seekho)
        </h2>
        <div className="mt-3 divide-y divide-ink-50 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          {lesson.examples.map((ex, i) => (
            <div key={i} className="flex items-start gap-3 p-4">
              <SpeakButton text={ex.en} />
              <div>
                <p className="font-medium text-ink-900">{ex.en}</p>
                <p className="text-sm text-ink-600">{ex.hi}</p>
                {ex.note && <p className="mt-1 text-xs font-medium text-ink-600">📝 {ex.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Icon name="check" className="h-5 w-5 text-sun-500" /> Rules
        </h2>
        <ul className="mt-3 space-y-2">
          {lesson.rules.map((r, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-ink-50 bg-white p-4 text-ink-700"
            >
              <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${a.dot}`} />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Mistakes */}
      <section className="mt-9">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Icon name="warning" className="h-5 w-5 text-rose-500" /> Common Mistakes (inka dhyan
          rakho)
        </h2>
        <div className="mt-3 grid gap-3">
          {lesson.mistakes.map((m, i) => (
            <div key={i} className="rounded-2xl border border-ink-100 bg-white p-4">
              <p className="flex items-center gap-2 text-sm text-rose-600">
                <Icon name="close" className="h-4 w-4 flex-none" />
                <span className="line-through">{m.wrong}</span>
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-emerald-700">
                <Icon name="check" className="h-4 w-4 flex-none" />
                {m.right}
              </p>
              <p className="mt-2 text-xs text-ink-600">Kyun? {m.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz — keyed by lesson.id so state always resets across lesson changes */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <Icon name="target" className="h-5 w-5 text-sun-500" /> Practice Quiz
        </h2>
        <p className="mt-2 mb-4 text-sm text-ink-600">
          {lesson.quiz.length} sawaal — 60%+ sahi karo aur lesson complete + XP pao.
        </p>
        <Quiz key={lesson.id} lesson={lesson} />
      </section>

      {/* Manual complete */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-4">
        <p className="text-sm text-ink-700">
          {done
            ? 'Ye lesson ho gaya. Agle par jao! 🚀'
            : 'Quiz ke bina bhi complete mark kar sakte ho.'}
        </p>
        <button
          type="button"
          disabled={toggling}
          onClick={handleToggle}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            done
              ? 'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <Icon name={done ? 'refresh' : 'checkCircle'} className="h-4 w-4" />
          {done ? 'Mark as not done' : 'Mark as complete'}
        </button>
      </div>

      {/* Prev / Next */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/lessons/${prev.id}`}
            className="group flex max-w-[45%] flex-col rounded-2xl border border-ink-100 bg-white p-4 transition-colors hover:bg-ink-50"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-600">
              <Icon name="arrowLeft" className="h-3.5 w-3.5" /> Pichla
            </span>
            <span className="mt-1 truncate text-sm font-medium text-ink-900">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/lessons/${next.id}`}
            className="group ml-auto flex max-w-[45%] flex-col items-end rounded-2xl border border-ink-100 bg-white p-4 transition-colors hover:bg-ink-50"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-600">
              Agla <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 truncate text-sm font-medium text-ink-900">{next.title}</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="ml-auto flex flex-col items-end rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              Sab pura! <Icon name="trophy" className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 text-sm font-medium text-emerald-900">Home par jao</span>
          </Link>
        )}
      </div>
    </div>
  )
}

function FormulaRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'emerald' | 'rose' | 'indigo'
}) {
  const tones = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    rose: 'border-rose-200 bg-rose-50 text-rose-900',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-900',
  }
  const badge = {
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-600',
  }
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-2xl border p-4 sm:flex-row sm:items-center sm:gap-4 ${tones[tone]}`}
    >
      <span
        className={`inline-flex w-fit flex-none items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${badge[tone]}`}
      >
        {label}
      </span>
      <code className="font-mono text-sm font-medium">{value}</code>
    </div>
  )
}
