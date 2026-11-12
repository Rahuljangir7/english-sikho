import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/')
  return <AuthForm mode="login" />
}
