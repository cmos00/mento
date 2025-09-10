"use client"

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Plus, Calendar, Clock, MessageSquare, ThumbsUp, TrendingUp, Filter } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'

interface JournalEntry {
  id: number
  title: string
  content: string
  category: string
  date: string
  mentor: string
  tags: string[]
  isCompleted: boolean
}

const mockJournalEntries: JournalEntry[] = [
  {
    id: 1,
    title: "이직 준비 계획 수립",
    content: "시니어 개발자로의 이직을 위해 필요한 기술 스택과 경험을 정리했습니다. 6개월 내 목표를 설정하고 단계별 계획을 세웠습니다.",
    category: "커리어 계획",
    date: "2024-01-15",
    mentor: "김시니어",
    tags: ["이직", "기술스택", "계획"],
    isCompleted: false
  },
  {
    id: 2,
    title: "팀 리드 역할 적응하기",
    content: "새로운 팀에서 리드 역할을 맡게 되었습니다. 팀원들과의 소통 방법과 업무 분배 전략을 정리했습니다.",
    category: "리더십",
    date: "2024-01-10",
    mentor: "박매니저",
    tags: ["리더십", "팀관리", "소통"],
    isCompleted: true
  },
  {
    id: 3,
    title: "성과평가 개선 방안",
    content: "B등급을 받은 성과평가를 분석하고, 구체적인 개선 방안을 도출했습니다. 상사와의 정기적인 피드백 요청도 계획에 포함했습니다.",
    category: "성과관리",
    date: "2024-01-05",
    mentor: "이디자이너",
    tags: ["성과평가", "피드백", "개선"],
    isCompleted: false
  }
]

const categories = [
  { name: "전체", count: 12 },
  { name: "커리어 계획", count: 4 },
  { name: "리더십", count: 3 },
  { name: "성과관리", count: 2 },
  { name: "기술개발", count: 2 },
  { name: "기타", count: 1 }
]

export default function JournalPage() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEntries = mockJournalEntries.filter(entry => {
    const matchesCategory = selectedCategory === '전체' || entry.category === selectedCategory
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!mockUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* PC Navigation */}
      <PCNavigation title="저널" icon={BookOpen} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">저널</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">커리어 저널</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg text-purple-600 font-semibold mb-4">카테고리</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg text-purple-600 font-semibold mb-4">진행 상태</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="completed" className="rounded text-purple-600" />
                  <label htmlFor="completed" className="text-sm">완료된 항목</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="inProgress" className="rounded text-purple-600" />
                  <label htmlFor="inProgress" className="text-sm">진행 중인 항목</label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Header */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">커리어 저널</h1>
                <Link href="/journal/new">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    새 항목 추가
                  </button>
                </Link>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="저널을 검색해보세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Journal Entries */}
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                          {entry.isCompleted && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              완료
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{entry.content}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {entry.date}
                        </span>
                        <span>{entry.category}</span>
                        <span>멘토: {entry.mentor}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Entries */}
            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">저널 항목이 없습니다</h3>
                <p className="text-gray-600">새로운 항목을 추가해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
