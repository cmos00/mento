"use client"

import Link from 'next/link'
import { Home, Users, BookOpen, User, Coffee } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const navItems = [
    { href: '/questions', icon: Home, label: '홈', requireAuth: false },
    { href: '/mentors', icon: Users, label: '멘토', requireAuth: false },
    { href: '/journal', icon: BookOpen, label: '저널', requireAuth: false },
    { href: '/coffee', icon: Coffee, label: '커피쿠폰', requireAuth: true },
    { href: '/profile', icon: User, label: '프로필', requireAuth: true }
  ]

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requireAuth && status !== 'authenticated') {
      alert('로그인이 필요한 서비스입니다.')
      return false
    }
    return true
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href === '/questions' && (pathname.startsWith('/questions') || pathname === '/'))
          const isDisabled = item.requireAuth && status !== 'authenticated'
          
          if (isDisabled) {
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-gray-400 opacity-60`}
              >
                <Icon className="w-5 h-5 mb-1 text-gray-400" />
                <span className="text-xs font-medium text-gray-400">
                  {item.label}
                </span>
              </button>
            )
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-purple-600' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
