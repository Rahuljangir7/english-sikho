export type AccentColor = 'amber' | 'indigo' | 'rose' | 'emerald'

export interface LessonFormula {
  positive: string
  negative: string
  question: string
}

export interface LessonExample {
  en: string
  hi: string
  note?: string
}

export interface LessonMistake {
  wrong: string
  right: string
  why: string
}

export interface QuizQuestionItem {
  id?: string
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface LessonSeed {
  id: string
  title: string
  titleHi: string
  summary: string
  concept: string[]
  formula: LessonFormula
  examples: LessonExample[]
  signals: string[]
  rules: string[]
  mistakes: LessonMistake[]
  quiz: QuizQuestionItem[]
}

export interface ModuleSeed {
  id: string
  title: string
  titleHi: string
  desc: string
  emoji: string
  accent: AccentColor
  lessons: LessonSeed[]
}

export interface Lesson extends LessonSeed {
  moduleId: string
  moduleTitle: string
  order: number
}

export interface Module extends Omit<ModuleSeed, 'lessons'> {
  order: number
  lessons: Lesson[]
}

export interface QuizScoreRecord {
  score: number
  total: number
}

export interface QuizAnswerReview {
  questionIndex: number
  question: string
  options: string[]
  chosen: number
  correct: number
  isCorrect: boolean
  explain: string
}

export interface ProgressSnapshot {
  completed: Record<string, boolean>
  scores: Record<string, QuizScoreRecord>
  last: string | null
  xpAwardedLessons?: Record<string, boolean>
  reviews?: Record<string, QuizAnswerReview[]>
}

export interface UserStats {
  xp: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
}

export interface UserProfile extends UserStats {
  id: string
  name: string
  email: string
  dailyGoalMinutes: number
  speechRate: number
}

export interface RecentAttemptItem {
  id: string
  lessonId: string
  lessonTitle: string
  score: number
  total: number
  passed: boolean
  createdAt: string
}

export interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  xp: number
  currentStreak: number
  longestStreak: number
  completedCount: number
  isCurrentUser?: boolean
}
