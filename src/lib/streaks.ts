export const PASS_THRESHOLD = 0.6

export function toUtcDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000)
}

export function computeStreakUpdate(
  lastActivityDate: Date | string | null | undefined,
  currentStreak: number,
  longestStreak: number,
  now = new Date(),
): {
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date
} {
  if (!lastActivityDate) {
    const nextCurrent = 1
    return {
      currentStreak: nextCurrent,
      longestStreak: Math.max(longestStreak, nextCurrent),
      lastActivityDate: now,
    }
  }

  const prev = typeof lastActivityDate === 'string' ? new Date(lastActivityDate) : lastActivityDate
  if (Number.isNaN(prev.getTime())) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(longestStreak, 1),
      lastActivityDate: now,
    }
  }

  const diffDays = toUtcDayNumber(now) - toUtcDayNumber(prev)

  let nextCurrent = 1
  if (diffDays <= 0) {
    nextCurrent = Math.max(1, currentStreak)
  } else if (diffDays === 1) {
    nextCurrent = currentStreak + 1
  } else {
    nextCurrent = 1
  }

  return {
    currentStreak: nextCurrent,
    longestStreak: Math.max(longestStreak, nextCurrent),
    lastActivityDate: now,
  }
}

export function computeQuizXp(params: {
  score: number
  total: number
  passed: boolean
  firstCompletion: boolean
}): number {
  const { score, total, passed, firstCompletion } = params
  let xp = 10 + score * 5
  if (passed && score === total) xp += 15
  if (firstCompletion) xp += 50
  return xp
}
