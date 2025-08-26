"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, MessageSquare, Users, Clock, ThumbsUp, Star, Briefcase } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

interface SearchResult {
  id: number
  type: 'question' | 'mentor'
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  date: string
  likes?: number
  answers?: number
  rating?: number
  reviews?: number
  company?: string
  experience?: string
}

const mockSearchResults: SearchResult[] = [
  {
    id: 1,
    type: 'question',
    title: "3년차 개발자, 이직 타이밍이 맞을까요?",
    content: "현재 스타트업에서 3년째 근무 중인 백엔드 개발자입니다. 최근 대기업에서 제안이 왔는데...",
    author: "익명의 개발자",
    category: "이직",
    tags: ["개발자", "이직", "스타트업", "대기업"],
    date: "2시간 전",
    likes: 24,
    answers: 12
  },
  {
    id: 2,
    type: 'mentor',
    title: "김시니어",
    content: "시니어 백엔드 개발자 • 네이버 • 8년차",
    author: "김시니어",
    category: "개발",
    tags: ["백엔드", "시스템설계", "팀리딩"],
    date: "활성",
    rating: 4.9,
    reviews: 127,
    company: "네이버",
    experience: "8년차"
  },
  {
    id: 3,
    type: 'question',
    title: "팀장과의 갈등, 어떻게 해결해야 할까요?",
    content: "입사한 지 1년 된 마케터입니다. 팀장님과 업무 방식에 대한 의견 차이가 계속 발생하고 있어서...",
    author: "익명의 마케터",
    category: "인간관계",
    tags: ["마케팅", "팀장", "갈등", "스트레스"],
    date: "4시간 전",
    likes: 18,
    answers: 8
  },
  {
    id: 4,
    type: 'mentor',
    title: "박매니저",
    content: "프로덕트 매니저 • 카카오 • 6년차",
    author: "박매니저",
    category: "기획",
    tags: ["프로덕트", "기획", "데이터분석"],
    date: "활성",
    rating: 4.8,
    reviews: 89,
    company: "카카오",
    experience: "6년차"
  }
]

const categories = [
  { name: "전체", count: 156 },
  { name: "질문", count: 89 },
  { name: "멘토", count: 67 }
]

function SearchContent() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [selectedType, setSelectedType] = useState<string>('all')
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  const filteredResults = mockSearchResults.filter(result => {
    const matchesCategory = selectedCategory === '전체' || result.category === selectedCategory
    const matchesType = selectedType === 'all' || result.type === selectedType
    const matchesSearch = searchTerm === '' || 
                         result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesType && matchesSearch
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="질문, 멘토, 키워드로 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Category Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mobile-scrollable">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors mobile-grid-item ${
                  selectedCategory === category.name
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedType('question')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'question'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              질문만
            </button>
            <button
              onClick={() => setSelectedType('mentor')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'mentor'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              멘토만
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <div key={`${result.type}-${result.id}`} className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          result.type === 'question' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {result.type === 'question' ? '질문' : '멘토'}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {result.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          href={result.type === 'question' ? `/questions/${result.id}` : `/mentors/${result.id}`}
                          className="hover:text-purple-600 transition-colors"
                        >
                          {result.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {result.content}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{result.author}</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {result.date}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {result.type === 'question' ? (
                        <>
                          <span className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {result.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {result.answers}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                            {result.rating}
                          </span>
                          <span className="text-xs">({result.reviews}개 리뷰)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
            </div>
          )}
        </div>

        {/* Search Tips */}
        {searchTerm && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">검색 팁</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium mb-2">질문 검색 시:</p>
                <ul className="space-y-1">
                  <li>• 구체적인 상황을 포함해보세요</li>
                  <li>• 직무나 경력 수준을 명시해보세요</li>
                  <li>• 관련 기술이나 도구명을 추가해보세요</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">멘토 검색 시:</p>
                <ul className="space-y-1">
                  <li>• 원하는 전문 분야를 입력해보세요</li>
                  <li>• 회사명이나 직무를 검색해보세요</li>
                  <li>• 경력 수준을 고려해보세요</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
