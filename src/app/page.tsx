import DashboardClient from '@/components/DashboardClient'
import { getCurriculum } from '@/lib/curriculum-service'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { modules, allLessons } = await getCurriculum()
  return <DashboardClient modules={modules} allLessons={allLessons} />
}
