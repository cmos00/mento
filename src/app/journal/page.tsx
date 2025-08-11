'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Calendar, BookOpen, Target, TrendingUp } from 'lucide-react'

interface JournalEntry {
  id: number
  title: string
  content: string
  category: string
  date: string
  tags: string[]
  mentor?: string
  actionItems: string[]
  completed: boolean
}

const mockJournalEntries: JournalEntry[] = [
  {
    id: 1,
    title: "팀 리더십 향상을 위한 피드백",
    content: "시니어 개발자로 승진 후 팀을 이끌면서 겪은 어려움과 해결 방법을 정리했습니다...",
    category: "리더십",
    date: "2024-01-15",
    tags: ["팀리드", "승진", "관리"],
    mentor: "김멘토",
    actionItems: ["주간 1:1 미팅 정기화", "팀원 성과 피드백 시스템 구축"],
    completed: false
  },
  {
    id: 2,
    title: "기술 아키텍처 개선 계획",
    content: "현재 시스템의 기술적 부채를 정리하고 개선 방안을 도출했습니다...",
    category: "기술",
    date: "2024-01-10",
    tags: ["아키텍처", "리팩토링", "기술부채"],
    mentor: "박멘토",
    actionItems: ["마이크로서비스 전환 계획 수립", "성능 모니터링 도구 도입"],
    completed: true
  },
  {
    id: 3,
    title: "커리어 목표 재정립",
    content: "5년차 개발자로서 앞으로의 커리어 방향성을 점검하고 목표를 재설정했습니다...",
    category: "커리어",
    date: "2024-01-05",
    tags: ["커리어계획", "목표설정", "자기계발"],
    mentor: "이멘토",
    actionItems: ["연간 학습 계획 수립", "네트워킹 이벤트 참여"],
    completed: false
  }
]

export default function JournalPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [showCompleted, setShowCompleted] = useState(true)

  const categories = ['전체', '리더십', '기술', '커리어', '인간관계', '성과관리']

  const filteredEntries = mockJournalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || entry.category === selectedCategory
    const matchesStatus = showCompleted ? true : !entry.completed
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">커리어 저널</h1>
          <button className="text-violet-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mobile-content">
        {/* 검색 및 필터 */}
        <div className="space-y-4 mb-6">
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="저널을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 상태 필터 */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
              />
              <span className="text-sm text-gray-600">완료된 항목 표시</span>
            </label>
          </div>
        </div>

        {/* 저널 목록 */}
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="card">
              <div className="space-y-3">
                {/* 저널 헤더 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Link href={`/journal/${entry.id}`} className="hover:text-violet-600 transition-colors">
                        {entry.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      entry.completed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {entry.completed ? '완료' : '진행중'}
                    </span>
                  </div>
                </div>

                {/* 메타 정보 */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{entry.date}</span>
                  </span>
                  <span>{entry.category}</span>
                  {entry.mentor && (
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{entry.mentor}</span>
                    </span>
                  )}
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 액션 아이템 */}
                {entry.actionItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>액션 아이템</span>
                    </h4>
                    <ul className="space-y-1">
                      {entry.actionItems.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 저널이 없을 때 */}
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">저널이 없습니다</h3>
            <p className="text-gray-600">새로운 저널을 작성해보세요.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/journal/new" className="mobile-fab">
        <Plus className="w-6 h-6" />
      </Link>

      {/* 하단 네비게이션 */}
      <div className="mobile-bottom-nav">
        <div className="flex justify-around">
          <Link href="/questions" className="flex flex-col items-center py-2 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs">질문</span>
          </Link>
          <Link href="/mentors" className="flex flex-col items-center py-2 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">멘토</span>
          </Link>
          <Link href="/journal" className="flex flex-col items-center py-2 text-violet-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">저널</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">프로필</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
