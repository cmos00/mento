"use client"

import Link from 'next/link'
import { Home, MessageSquare, Users, BookOpen, User, Coffee } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: '홈' },
    { href: '/questions', icon: MessageSquare, label: '질문' },
    { href: '/mentors', icon: Users, label: '멘토' },
    { href: '/journal', icon: BookOpen, label: '저널' },
    { href: '/coffee', icon: Coffee, label: '커피쿠폰' },
    { href: '/profile', icon: User, label: '프로필' }
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-purple-600' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
