"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Users, BookOpen, Bell, User } from 'lucide-react'

interface PCNavigationProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
}

export default function PCNavigation({ title, icon: Icon }: PCNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/questions', icon: MessageCircle, label: '홈' },
    { href: '/mentors', icon: Users, label: '멘토' },
    { href: '/journal', icon: BookOpen, label: '저널' },
    { href: '/notifications', icon: Bell, label: '알림' },
    { href: '/profile', icon: User, label: '프로필' }
  ]

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* 왼쪽: 아이콘 + 페이지명 */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">{title}</span>
        </div>
        
        {/* PC 네비게이션 (PC에서만 표시) */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const ItemIcon = item.icon
            const isActive = pathname === item.href || 
              (item.href === '/questions' && (pathname.startsWith('/questions') || pathname === '/'))
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ItemIcon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
