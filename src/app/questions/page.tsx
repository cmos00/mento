'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Filter, MessageCircle, Eye, ThumbsUp } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'

interface Question {
  id: number
  title: string
  content: string
  category: string
  author: string
  answers: number
  views: number
  tags: string[]
  createdAt: string
}

const mockQuestions: Question[] = [
  {
    id: 1,
    title: "시니어 개발자로 승진 후 팀 관리가 어려워요",
    content: "최근 시니어 개발자로 승진했는데, 주니어 개발자들을 리드하는 것이 생각보다 어렵습니다...",
    category: "경력 전환",
    author: "김개발",
    answers: 8,
    views: 156,
    tags: ["팀리드", "승진", "관리"],
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "스타트업에서 대기업으로 이직할 때 고려사항",
    content: "현재 스타트업에서 3년간 일하고 있는데, 대기업으로의 이직을 고려하고 있습니다...",
    category: "이직",
    author: "박이직",
    answers: 12,
    views: 234,
    tags: ["이직", "스타트업", "대기업"],
    createdAt: "2024-01-14"
  },
  {
    id: 3,
    title: "개발자 커리어에서 PM으로 전환하는 방법",
    content: "개발 경력 5년차인데, 제품 관리자(PM)로 전환하고 싶습니다...",
    category: "커리어 전환",
    author: "이전환",
    answers: 15,
    views: 312,
    tags: ["PM", "커리어전환", "제품관리"],
    createdAt: "2024-01-13"
  }
]

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [searchTerm, setSearchTerm] = useState('')
  const [mockUser, setMockUser] = useState<MockUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Mock 사용자 정보 확인
    if (!mockAuth.isLoggedIn()) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/auth/login')
      return
    }
    
    const user = mockAuth.getUser()
    if (user) {
      setMockUser(user)
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const categories = ['전체', '경력 전환', '이직', '커리어 전환', '조직 갈등', '성과 관리', '스킬 개발']

  const filteredQuestions = questions.filter(question => {
    const matchesCategory = selectedCategory === '전체' || question.category === selectedCategory
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!mockUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">커리어 질문</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">안녕하세요, {mockUser.name}님!</span>
          </div>
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
              placeholder="질문을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent"
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
                    ? 'bg-[#6A5ACD] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 질문 목록 */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="card">
              <div className="space-y-3">
                {/* 질문 헤더 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Link href={`/questions/${question.id}`} className="hover:text-[#6A5ACD] transition-colors">
                        {question.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {question.content}
                    </p>
                  </div>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{question.author}</span>
                    <span>{question.category}</span>
                    <span>{question.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{question.answers}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{question.views}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 질문이 없을 때 */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">질문을 찾을 수 없습니다</h3>
            <p className="text-gray-600">다른 검색어나 카테고리를 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/questions/new" className="mobile-fab">
        <Plus className="w-6 h-6" />
      </Link>

      {/* 하단 네비게이션 */}
      <div className="mobile-bottom-nav">
        <div className="flex justify-around">
          <Link href="/questions" className="flex flex-col items-center py-2 text-[#6A5ACD]">
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
          <Link href="/journal" className="flex flex-col items-center py-2 text-gray-400">
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
