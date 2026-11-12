import type { Metadata } from 'next'
import ProfileClient from '@/components/ProfileClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Profile & Settings',
  description: 'Manage your learning profile, daily goal, voice speed, and view quiz activity.',
}

export default function ProfilePage() {
  return <ProfileClient />
}
