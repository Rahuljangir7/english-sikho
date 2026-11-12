'use client'

import { useState } from 'react'
import type { Lesson } from '@/types/curriculum'
import { Icon } from './Icons'
import { usePlatform, type QuizSubmissionResult } from './PlatformProvider'

export default function Quiz({ lesson }: { lesson: Lesson }) {
  return <QuizSession key={lesson.id} lesson={lesson} />
}

function QuizSession({ lesson }: { lesson: Lesson }) {
  const { submitQuiz } = usePlatform()
  const quiz = lesson.quiz

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [chosenAnswers, setChosenAnswers] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<QuizSubmissionResult | null>(null)
  const [showReview, setShowReview] = useState(false)

  if (quiz.length === 0) {
    return null
  }

  const q = quiz[index]
  const total = quiz.length
  const isCorrect = answered && selected === q.answer

  const choose = (i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    setChosenAnswers((prev) => {
      const next = [...prev]
      next[index] = i
      return next
    })
    if (i === q.answer) setScore((s) => s + 1)
  }

  const finalizeQuiz = async (answersToSubmit: number[]) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await submitQuiz(lesson, answersToSubmit)
      setResult(res)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Quiz submit failed. Dobara try karein.')
    } finally {
      setSubmitting(false)
    }
  }

  const next = async () => {
    if (index + 1 < total) {
      setIndex((n) => n + 1)
      setSelected(null)
      setAnswered(false)
      return
    }
    await finalizeQuiz(chosenAnswers)
  }

  const retry = () => {
    setIndex(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setChosenAnswers([])
    setSubmitting(false)
    setSubmitError(null)
    setResult(null)
    setShowReview(false)
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-ink-100 bg-white p-6 text-center shadow-card sm:p-8">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
              result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <Icon name={result.passed ? 'trophy' : 'refresh'} className="h-8 w-8" />
          </span>
          <h3 className="mt-4 font-display text-2xl font-bold text-ink-900">
            {result.passed ? 'Shabash! 🎉' : 'Thoda aur practice!'}
          </h3>
          <p className="mt-2 text-ink-700">
            Tumne <strong className="text-ink-900">{result.score}</strong> / {result.total} sahi
            kiye.
            {result.passed
              ? ' Lesson samajh aa gaya!'
              : ' 60% chahiye pass ke liye — ek baar dobara try karo.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              <Icon name="star" className="h-3.5 w-3.5 text-amber-500" />
              +{result.xpGain} XP
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-ink-50 px-3 py-1 text-xs font-bold text-ink-700">
              Best Score: {result.bestScore}/{result.total}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowReview((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-50"
            >
              <Icon name="eye" className="h-4 w-4" />
              {showReview ? 'Review chhupao' : 'Answers Review karo'}
            </button>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
            >
              <Icon name="refresh" className="h-4 w-4" />
              Dobara practice karo
            </button>
          </div>
        </div>

        {showReview && (
          <div className="space-y-3">
            {result.results.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border bg-white p-4 ${
                  item.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink-900">
                    Q{idx + 1}. {item.question}
                  </p>
                  <span
                    className={`flex-none rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.isCorrect ? 'Sahi' : 'Galat'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink-600">
                  Tumhara jawab:{' '}
                  <strong className={item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                    {item.options[item.chosen] ?? 'N/A'}
                  </strong>
                  {!item.isCorrect && (
                    <>
                      {' '}
                      · Sahi jawab:{' '}
                      <strong className="text-emerald-700">
                        {item.options[item.correct] ?? 'N/A'}
                      </strong>
                    </>
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-700">{item.explain}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-card sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-600">
          Practice Question {index + 1} / {total}
        </span>
        <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">
          Score: {score}
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ink-600 to-ink-900 transition-all duration-300"
          style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-ink-900">{q.q}</h3>

      <div className="mt-4 grid gap-2.5">
        {q.options.map((opt, i) => {
          let style = 'border-ink-100 bg-white hover:border-ink-300 hover:bg-ink-50'
          if (answered) {
            if (i === q.answer) style = 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300'
            else if (i === selected) style = 'border-rose-400 bg-rose-50 ring-1 ring-rose-300'
            else style = 'border-ink-100 bg-white opacity-60'
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={answered}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium text-ink-900 transition-all ${style}`}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-current text-xs">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
              {answered && i === q.answer && (
                <Icon name="checkCircle" className="h-5 w-5 flex-none text-emerald-600" />
              )}
              {answered && i === selected && i !== q.answer && (
                <Icon name="close" className="h-5 w-5 flex-none text-rose-600" />
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          className={`animate-pop mt-4 rounded-2xl border p-4 text-sm ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? 'Sahi jawab! ✅' : `Sahi jawab: ${q.options[q.answer]}`}
          </p>
          <p className="mt-1">{q.explain}</p>
        </div>
      )}

      {submitError && (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {submitError}
        </p>
      )}

      {answered && (
        <button
          type="button"
          onClick={next}
          disabled={submitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-60 sm:w-auto"
        >
          {submitting
            ? 'Saving result...'
            : index + 1 < total
              ? 'Next Question'
              : 'Result dekho'}
          {!submitting && <Icon name="arrowRight" className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
