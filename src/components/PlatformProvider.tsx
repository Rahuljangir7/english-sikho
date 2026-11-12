'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { CurriculumSource } from '@/lib/curriculum-service'
import { computeQuizXp, computeStreakUpdate, PASS_THRESHOLD } from '@/lib/streaks'
import type {
  Lesson,
  ProgressSnapshot,
  QuizAnswerReview,
  RecentAttemptItem,
  UserProfile,
  UserStats,
} from '@/types/curriculum'

const GUEST_STORAGE_KEY = 'english-sikho-guest-v2'
const LEGACY_STORAGE_KEY = 'english-sikho-progress-v1'

interface GuestStorageState {
  progress: ProgressSnapshot
  stats: UserStats
  speechRate: number
  recentAttempts: RecentAttemptItem[]
}

const emptyGuestState = (): GuestStorageState => ({
  progress: {
    completed: {},
    scores: {},
    last: null,
    xpAwardedLessons: {},
  },
  stats: {
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
  },
  speechRate: 0.9,
  recentAttempts: [],
})

const SERVER_GUEST_SNAPSHOT: GuestStorageState = emptyGuestState()
let guestMemoryState: GuestStorageState | null = null
const guestListeners = new Set<() => void>()

function loadGuestState(): GuestStorageState {
  if (typeof window === 'undefined') return SERVER_GUEST_SNAPSHOT
  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GuestStorageState>
      return {
        progress: {
          completed: parsed.progress?.completed ?? {},
          scores: parsed.progress?.scores ?? {},
          last: parsed.progress?.last ?? null,
          xpAwardedLessons: parsed.progress?.xpAwardedLessons ?? {},
        },
        stats: parsed.stats ?? emptyGuestState().stats,
        speechRate: typeof parsed.speechRate === 'number' ? parsed.speechRate : 0.9,
        recentAttempts: Array.isArray(parsed.recentAttempts) ? parsed.recentAttempts : [],
      }
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as {
        completed?: Record<string, boolean>
        scores?: Record<string, { score: number; total: number }>
        last?: string | null
      }
      const completed = legacy.completed ?? {}
      const completedCount = Object.values(completed).filter(Boolean).length
      const migrated: GuestStorageState = {
        progress: {
          completed,
          scores: legacy.scores ?? {},
          last: legacy.last ?? null,
          xpAwardedLessons: { ...completed },
        },
        stats: {
          xp: completedCount * 50,
          currentStreak: completedCount > 0 ? 1 : 0,
          longestStreak: completedCount > 0 ? 1 : 0,
          lastActivityDate: completedCount > 0 ? new Date().toISOString() : null,
        },
        speechRate: 0.9,
        recentAttempts: [],
      }
      window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(migrated))
      return migrated
    }
  } catch {
    /* ignore storage errors */
  }
  return emptyGuestState()
}

function getGuestSnapshot(): GuestStorageState {
  if (typeof window === 'undefined') return SERVER_GUEST_SNAPSHOT
  if (!guestMemoryState) {
    guestMemoryState = loadGuestState()
  }
  return guestMemoryState
}

function getServerGuestSnapshot(): GuestStorageState {
  return SERVER_GUEST_SNAPSHOT
}

function updateGuestStore(updater: (prev: GuestStorageState) => GuestStorageState) {
  const current = getGuestSnapshot()
  const next = updater(current)
  if (next === current) return
  guestMemoryState = next
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }
  for (const listener of guestListeners) listener()
}

function clearGuestStore() {
  guestMemoryState = emptyGuestState()
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(GUEST_STORAGE_KEY)
      window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }
  for (const listener of guestListeners) listener()
}

function subscribeGuestStore(listener: () => void): () => void {
  guestListeners.add(listener)
  if (typeof window === 'undefined') {
    return () => {
      guestListeners.delete(listener)
    }
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === GUEST_STORAGE_KEY) {
      guestMemoryState = loadGuestState()
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    guestListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export interface QuizSubmissionResult {
  score: number
  total: number
  passed: boolean
  bestScore: number
  xpGain: number
  results: QuizAnswerReview[]
}

interface PlatformContextValue {
  user: UserProfile | null
  progress: ProgressSnapshot
  stats: UserStats
  recentAttempts: RecentAttemptItem[]
  speechRate: number
  totalLessons: number
  curriculumSource: CurriculumSource
  isGuest: boolean
  recordVisit: (lessonId: string) => Promise<void>
  toggleComplete: (lessonId: string) => Promise<void>
  submitQuiz: (lesson: Lesson, answers: number[]) => Promise<QuizSubmissionResult>
  resetProgress: () => Promise<void>
  updateProfile: (payload: {
    name: string
    dailyGoalMinutes: number
    speechRate: number
  }) => Promise<{ ok: boolean; error?: string }>
  setGuestSpeechRate: (rate: number) => void
  applyAuthSession: (data: {
    user: UserProfile
    progress: ProgressSnapshot
    recentAttempts: RecentAttemptItem[]
  }) => void
  getGuestProgressForSync: () => ProgressSnapshot | null
  logout: () => Promise<void>
}

const PlatformContext = createContext<PlatformContextValue | null>(null)

export function PlatformProvider({
  children,
  initialUser,
  initialProgress,
  initialAttempts,
  totalLessons,
  curriculumSource,
}: {
  children: ReactNode
  initialUser: UserProfile | null
  initialProgress: ProgressSnapshot | null
  initialAttempts: RecentAttemptItem[]
  totalLessons: number
  curriculumSource: CurriculumSource
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser)
  const [dbProgress, setDbProgress] = useState<ProgressSnapshot>(
    initialProgress ?? { completed: {}, scores: {}, last: null },
  )
  const [dbAttempts, setDbAttempts] = useState<RecentAttemptItem[]>(initialAttempts)

  const guestState = useSyncExternalStore(
    subscribeGuestStore,
    getGuestSnapshot,
    getServerGuestSnapshot,
  )

  const progress = user ? dbProgress : guestState.progress

  const stats: UserStats = useMemo(
    () =>
      user
        ? {
            xp: user.xp,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastActivityDate: user.lastActivityDate,
          }
        : guestState.stats,
    [user, guestState.stats],
  )

  const recentAttempts = user ? dbAttempts : guestState.recentAttempts
  const speechRate = user ? user.speechRate : guestState.speechRate

  const recordVisit = useCallback(
    async (lessonId: string) => {
      if (user) {
        setDbProgress((prev) => (prev.last === lessonId ? prev : { ...prev, last: lessonId }))
        try {
          await fetch('/api/progress/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId }),
          })
        } catch {
          /* ignore network hiccups for visit tracking */
        }
        return
      }

      updateGuestStore((prev) => {
        if (prev.progress.last === lessonId) return prev
        return {
          ...prev,
          progress: { ...prev.progress, last: lessonId },
        }
      })
    },
    [user],
  )

  const toggleComplete = useCallback(
    async (lessonId: string) => {
      if (user) {
        const res = await fetch('/api/progress/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        })
        if (!res.ok) return
        const data = (await res.json()) as {
          completed: boolean
          stats: UserStats
        }
        setDbProgress((prev) => {
          const nextCompleted = { ...prev.completed }
          if (data.completed) nextCompleted[lessonId] = true
          else delete nextCompleted[lessonId]
          return { ...prev, completed: nextCompleted }
        })
        setUser((prev) => (prev ? { ...prev, ...data.stats } : prev))
        return
      }

      updateGuestStore((prev) => {
        const wasDone = Boolean(prev.progress.completed[lessonId])
        const nextDone = !wasDone
        const nextCompleted = { ...prev.progress.completed }
        if (nextDone) nextCompleted[lessonId] = true
        else delete nextCompleted[lessonId]

        const alreadyAwarded = Boolean(prev.progress.xpAwardedLessons?.[lessonId])
        const awardXp = nextDone && !alreadyAwarded ? 50 : 0
        const nextAwarded = {
          ...(prev.progress.xpAwardedLessons ?? {}),
          ...(nextDone ? { [lessonId]: true } : {}),
        }

        const nextStreak = nextDone
          ? computeStreakUpdate(
              prev.stats.lastActivityDate,
              prev.stats.currentStreak,
              prev.stats.longestStreak,
            )
          : null

        return {
          ...prev,
          progress: {
            ...prev.progress,
            completed: nextCompleted,
            xpAwardedLessons: nextAwarded,
          },
          stats: nextStreak
            ? {
                xp: prev.stats.xp + awardXp,
                currentStreak: nextStreak.currentStreak,
                longestStreak: nextStreak.longestStreak,
                lastActivityDate: nextStreak.lastActivityDate.toISOString(),
              }
            : prev.stats,
        }
      })
    },
    [user],
  )

  const submitQuiz = useCallback(
    async (lesson: Lesson, answers: number[]): Promise<QuizSubmissionResult> => {
      if (user) {
        const res = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: lesson.id, answers }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Quiz submit failed.')
        }

        const typed = data as QuizSubmissionResult & {
          completed: boolean
          stats: UserStats
        }

        setDbProgress((prev) => ({
          ...prev,
          completed: typed.completed
            ? { ...prev.completed, [lesson.id]: true }
            : prev.completed,
          scores: {
            ...prev.scores,
            [lesson.id]: { score: typed.bestScore, total: typed.total },
          },
          last: lesson.id,
        }))
        setUser((prev) => (prev ? { ...prev, ...typed.stats } : prev))
        setDbAttempts((prev) => [
          {
            id: `local-${Date.now()}`,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            score: typed.score,
            total: typed.total,
            passed: typed.passed,
            createdAt: new Date().toISOString(),
          },
          ...prev.slice(0, 9),
        ])

        return {
          score: typed.score,
          total: typed.total,
          passed: typed.passed,
          bestScore: typed.bestScore,
          xpGain: typed.xpGain,
          results: typed.results,
        }
      }

      // Guest local grading & persistence
      const results: QuizAnswerReview[] = lesson.quiz.map((q, idx) => {
        const chosen = answers[idx] ?? -1
        const isCorrect = chosen === q.answer
        return {
          questionIndex: idx,
          question: q.q,
          options: q.options,
          chosen,
          correct: q.answer,
          isCorrect,
          explain: q.explain,
        }
      })

      const score = results.filter((r) => r.isCorrect).length
      const total = lesson.quiz.length
      const passed = score / total >= PASS_THRESHOLD

      let computedBest = score
      let computedXpGain = 0

      updateGuestStore((prev) => {
        const existingScore = prev.progress.scores[lesson.id]?.score ?? 0
        computedBest = Math.max(existingScore, score)
        const alreadyAwarded = Boolean(prev.progress.xpAwardedLessons?.[lesson.id])
        const firstCompletion = passed && !alreadyAwarded
        computedXpGain = computeQuizXp({ score, total, passed, firstCompletion })

        const streak = computeStreakUpdate(
          prev.stats.lastActivityDate,
          prev.stats.currentStreak,
          prev.stats.longestStreak,
        )

        return {
          ...prev,
          progress: {
            ...prev.progress,
            completed: passed
              ? { ...prev.progress.completed, [lesson.id]: true }
              : prev.progress.completed,
            scores: {
              ...prev.progress.scores,
              [lesson.id]: { score: computedBest, total },
            },
            last: lesson.id,
            xpAwardedLessons: {
              ...(prev.progress.xpAwardedLessons ?? {}),
              ...(passed ? { [lesson.id]: true } : {}),
            },
          },
          stats: {
            xp: prev.stats.xp + computedXpGain,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastActivityDate: streak.lastActivityDate.toISOString(),
          },
          recentAttempts: [
            {
              id: `guest-${Date.now()}`,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              score,
              total,
              passed,
              createdAt: new Date().toISOString(),
            },
            ...prev.recentAttempts.slice(0, 9),
          ],
        }
      })

      return {
        score,
        total,
        passed,
        bestScore: computedBest,
        xpGain: computedXpGain,
        results,
      }
    },
    [user],
  )

  const resetProgress = useCallback(async () => {
    if (user) {
      const res = await fetch('/api/progress', { method: 'DELETE' })
      if (!res.ok) return
      setDbProgress({ completed: {}, scores: {}, last: null })
      setDbAttempts([])
      setUser((prev) =>
        prev ? { ...prev, xp: 0, currentStreak: 0, lastActivityDate: null } : prev,
      )
      return
    }

    updateGuestStore((prev) => ({
      ...emptyGuestState(),
      speechRate: prev.speechRate,
    }))
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [user])

  const updateProfile = useCallback(
    async (payload: { name: string; dailyGoalMinutes: number; speechRate: number }) => {
      if (!user) {
        updateGuestStore((prev) => ({ ...prev, speechRate: payload.speechRate }))
        return { ok: true }
      }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        return { ok: false, error: data.error || 'Update failed.' }
      }
      setUser(data.user as UserProfile)
      return { ok: true }
    },
    [user],
  )

  const setGuestSpeechRate = useCallback((rate: number) => {
    updateGuestStore((prev) => ({ ...prev, speechRate: rate }))
  }, [])

  const getGuestProgressForSync = useCallback((): ProgressSnapshot | null => {
    const hasCompleted = Object.keys(guestState.progress.completed).length > 0
    const hasScores = Object.keys(guestState.progress.scores).length > 0
    if (!hasCompleted && !hasScores && !guestState.progress.last) return null
    return {
      completed: guestState.progress.completed,
      scores: guestState.progress.scores,
      last: guestState.progress.last,
    }
  }, [guestState.progress])

  const applyAuthSession = useCallback(
    (data: {
      user: UserProfile
      progress: ProgressSnapshot
      recentAttempts: RecentAttemptItem[]
    }) => {
      setUser(data.user)
      setDbProgress(data.progress ?? { completed: {}, scores: {}, last: null })
      setDbAttempts(data.recentAttempts ?? [])
      clearGuestStore()
    },
    [],
  )

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setDbProgress({ completed: {}, scores: {}, last: null })
    setDbAttempts([])
  }, [])

  const value = useMemo<PlatformContextValue>(
    () => ({
      user,
      progress,
      stats,
      recentAttempts,
      speechRate,
      totalLessons,
      curriculumSource,
      isGuest: !user,
      recordVisit,
      toggleComplete,
      submitQuiz,
      resetProgress,
      updateProfile,
      setGuestSpeechRate,
      applyAuthSession,
      getGuestProgressForSync,
      logout,
    }),
    [
      user,
      progress,
      stats,
      recentAttempts,
      speechRate,
      totalLessons,
      curriculumSource,
      recordVisit,
      toggleComplete,
      submitQuiz,
      resetProgress,
      updateProfile,
      setGuestSpeechRate,
      applyAuthSession,
      getGuestProgressForSync,
      logout,
    ],
  )

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext)
  if (!ctx) {
    throw new Error('usePlatform must be used within a PlatformProvider')
  }
  return ctx
}
