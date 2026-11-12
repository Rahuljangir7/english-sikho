import type { Metadata } from 'next'
import CheatSheetClient from '@/components/CheatSheetClient'
import { getCurriculum } from '@/lib/curriculum-service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tenses Cheat Sheet',
  description: 'Sabhi 12 English tenses ke Positive, Negative aur Question formulas ek jagah.',
}

export default async function CheatSheetPage() {
  const { modules } = await getCurriculum()
  return <CheatSheetClient modules={modules} />
}
