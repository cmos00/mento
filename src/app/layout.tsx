import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import MobileWarning from '@/components/MobileWarning'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareerTalk - 커리어 멘토링 플랫폼',
  description: '경력 3~7년차 직장인들을 위한 맞춤형 커리어 피드백 플랫폼',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <MobileWarning />
          <div className="min-h-screen bg-gray-50 mobile-safe">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
