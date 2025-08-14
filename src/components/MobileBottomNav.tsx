"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Users, BookOpen, User } from 'lucide-react'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const tabs = [
    {
      name: '질문',
      href: '/questions',
      icon: MessageSquare,
      active: pathname === '/questions' || pathname.startsWith('/questions/')
    },
    {
      name: '멘토',
      href: '/mentors',
      icon: Users,
      active: pathname === '/mentors' || pathname.startsWith('/mentors/')
    },
    {
      name: '저널',
      href: '/journal',
      icon: BookOpen,
      active: pathname === '/journal' || pathname.startsWith('/journal/')
    },
    {
      name: '프로필',
      href: '/profile',
      icon: User,
      active: pathname === '/profile' || pathname.startsWith('/profile/')
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-4 py-2 md:hidden">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center py-2 transition-colors ${
                tab.active 
                  ? 'text-purple-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${tab.active ? 'text-purple-600' : ''}`} />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
