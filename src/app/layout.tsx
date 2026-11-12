import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { PlatformProvider } from '@/components/PlatformProvider'
import { getCurrentUser } from '@/lib/auth'
import { getCurriculum } from '@/lib/curriculum-service'
import { getUserProgressData } from '@/lib/progress-service'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'English Sikho — Tenses, Step by Step',
    template: '%s · English Sikho',
  },
  description:
    'English Sikho — 15 lessons me Tenses, step by step. Hindi + English me aasan explanation, audio examples, practice quizzes aur progress tracking.',
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e1b4b',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [curriculum, user] = await Promise.all([getCurriculum(), getCurrentUser()])

  let initialProgress = null
  let initialAttempts: Awaited<ReturnType<typeof getUserProgressData>>['recentAttempts'] = []

  if (user) {
    try {
      const data = await getUserProgressData(user.id)
      initialProgress = data.progress
      initialAttempts = data.recentAttempts
    } catch {
      initialProgress = null
    }
  }

  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PlatformProvider
          initialUser={user}
          initialProgress={initialProgress}
          initialAttempts={initialAttempts}
          totalLessons={curriculum.totalLessons}
          curriculumSource={curriculum.source}
        >
          <div className="min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </PlatformProvider>
      </body>
    </html>
  )
}
