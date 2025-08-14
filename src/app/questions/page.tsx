"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, ThumbsUp, MessageSquare, Clock, TrendingUp, Users, Briefcase, Plus, Bell } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

interface Question {
  id: number
  title: string
  content: string
  category: string
  author: string
  likes: number
  comments: number
  timeAgo: string
  tags: string[]
}

const mockQuestions: Question[] = [
  {
    id: 1,
    title: "3년차 개발자, 이직 타이밍이 맞을까요?",
    content: "현재 스타트업에서 3년째 근무 중인 백엔드 개발자입니다. 최근 대기업에서 제안이 왔는데, 지금 이직하는 것이 커리어에 도움이 될지 고민입니다...",
    category: "이직",
    author: "익명의 개발자",
    likes: 24,
    comments: 12,
    timeAgo: "2시간 전",
    tags: ["개발자", "이직", "스타트업", "대기업"]
  },
  {
    id: 2,
    title: "팀장과의 갈등, 어떻게 해결해야 할까요?",
    content: "입사한 지 1년 된 마케터입니다. 팀장님과 업무 방식에 대한 의견 차이가 계속 발생하고 있어서 스트레스가 심합니다...",
    category: "인간관계",
    author: "익명의 마케터",
    likes: 18,
    comments: 8,
    timeAgo: "4시간 전",
    tags: ["마케팅", "팀장", "갈등", "스트레스"]
  },
  {
    id: 3,
    title: "성과평가에서 B등급... 어떻게 개선할 수 있을까요?",
    content: "열심히 했다고 생각했는데 성과평가에서 B등급을 받았습니다. 상사 피드백도 애매해서 구체적으로 뭘 개선해야 할지 모르겠어요...",
    category: "성과관리",
    author: "익명의 직장인",
    likes: 31,
    comments: 15,
    timeAgo: "6시간 전",
    tags: ["성과평가", "피드백", "개선방안"]
  }
]

const categories = [
  { name: "전체", count: 156, active: true },
  { name: "이직", count: 42, active: false },
  { name: "인간관계", count: 38, active: false },
  { name: "성과관리", count: 29, active: false },
  { name: "커리어전환", count: 24, active: false },
  { name: "리더십", count: 23, active: false }
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

  const filteredQuestions = questions.filter(question => {
    const matchesCategory = selectedCategory === '전체' || question.category === selectedCategory
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 mb-6">
              <h3 className="font-semibold flex items-center text-purple-600 mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                인기 카테고리
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-gray-100"
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

            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
              <h3 className="font-semibold flex items-center text-purple-600 mb-4">
                <Users className="w-4 h-4 mr-2" />
                이번 주 활발한 멘토
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">김멘토</p>
                    <p className="text-xs text-gray-500">시니어 개발자</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">이멘토</p>
                    <p className="text-xs text-gray-500">PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="질문을 검색해보세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Mobile Category Pills */}
              <div className="lg:hidden">
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
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link href={`/questions/${question.id}`} className="hover:text-purple-600 transition-colors">
                            {question.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {question.content}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag) => (
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
                        <span>{question.author}</span>
                        <span>{question.category}</span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {question.timeAgo}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {question.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {question.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Questions */}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">질문을 찾을 수 없습니다</h3>
                <p className="text-gray-600">다른 검색어나 카테고리를 시도해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link href="/questions/new" className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:shadow-xl transition-all md:bottom-6">
        <Plus className="w-6 h-6" />
      </Link>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
