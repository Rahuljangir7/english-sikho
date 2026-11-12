import type { Metadata } from 'next'
import LeaderboardClient from '@/components/LeaderboardClient'
import { getCurrentUser } from '@/lib/auth'
import { getLeaderboardData } from '@/lib/progress-service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'English Sikho top learners ranked by XP and daily practice streaks.',
}

export default async function LeaderboardPage() {
  const user = await getCurrentUser()
  const { entries, totalLearners, currentUserRank } = await getLeaderboardData(user?.id)

  return (
    <LeaderboardClient
      entries={entries}
      totalLearners={totalLearners}
      currentUserRank={currentUserRank}
    />
  )
}
