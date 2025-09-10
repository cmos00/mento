"use client"

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Plus, Calendar, Clock, MessageSquare, ThumbsUp, TrendingUp, Filter, Eye, User, Star, Award } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'

interface JournalArticle {
  id: number
  title: string
  content: string
  excerpt: string
  category: string
  author: {
    name: string
    title: string
    company: string
    avatar?: string
    experience: string
  }
  publishedAt: string
  readTime: string
  views: number
  likes: number
  comments: number
  tags: string[]
  isFeatured: boolean
  isTrending: boolean
}

const mockJournalArticles: JournalArticle[] = [
  {
    id: 1,
    title: "3년차 개발자, 이직 타이밍과 준비 과정",
    content: "3년차 개발자로서 이직을 고민하고 있는 분들에게 실제 경험을 바탕으로 한 조언을 드립니다. 이직 준비 과정에서 중요한 것들과 놓치기 쉬운 부분들을 정리해보았습니다.",
    excerpt: "3년차 개발자로서 이직을 고민하고 있는 분들에게 실제 경험을 바탕으로 한 조언을 드립니다...",
    category: "커리어 전환",
    author: {
      name: "김시니어",
      title: "시니어 백엔드 개발자",
      company: "네이버",
      experience: "8년차"
    },
    publishedAt: "2024-01-15",
    readTime: "5분",
    views: 1247,
    likes: 89,
    comments: 23,
    tags: ["이직", "개발자", "커리어"],
    isFeatured: true,
    isTrending: true
  },
  {
    id: 2,
    title: "팀 리드가 되기 전에 준비해야 할 것들",
    content: "개발자에서 팀 리드로 성장하는 과정에서 필요한 스킬과 마인드셋에 대해 이야기합니다. 기술적 역량뿐만 아니라 리더십과 소통 능력의 중요성을 강조합니다.",
    excerpt: "개발자에서 팀 리드로 성장하는 과정에서 필요한 스킬과 마인드셋에 대해 이야기합니다...",
    category: "리더십",
    author: {
      name: "박매니저",
      title: "프로덕트 매니저",
      company: "카카오",
      experience: "6년차"
    },
    publishedAt: "2024-01-12",
    readTime: "7분",
    views: 892,
    likes: 67,
    comments: 18,
    tags: ["리더십", "팀관리", "성장"],
    isFeatured: false,
    isTrending: true
  },
  {
    id: 3,
    title: "디자이너의 커리어 로드맵: 주니어에서 시니어까지",
    content: "디자이너로서 성장하고 싶은 분들을 위한 구체적인 로드맵을 제시합니다. 각 단계별로 필요한 스킬과 포트폴리오 구성 방법을 상세히 설명합니다.",
    excerpt: "디자이너로서 성장하고 싶은 분들을 위한 구체적인 로드맵을 제시합니다...",
    category: "디자인",
    author: {
      name: "이디자이너",
      title: "UX 디자이너",
      company: "토스",
      experience: "5년차"
    },
    publishedAt: "2024-01-10",
    readTime: "6분",
    views: 756,
    likes: 54,
    comments: 15,
    tags: ["디자인", "UX", "커리어"],
    isFeatured: true,
    isTrending: false
  },
  {
    id: 4,
    title: "스타트업에서의 성장 경험과 교훈",
    content: "스타트업에서 3년간 일하며 얻은 경험과 교훈을 공유합니다. 빠른 성장 환경에서의 적응 방법과 개인적 성장을 위한 팁을 제공합니다.",
    excerpt: "스타트업에서 3년간 일하며 얻은 경험과 교훈을 공유합니다...",
    category: "스타트업",
    author: {
      name: "최스타트업",
      title: "풀스택 개발자",
      company: "스타트업A",
      experience: "3년차"
    },
    publishedAt: "2024-01-08",
    readTime: "4분",
    views: 634,
    likes: 42,
    comments: 12,
    tags: ["스타트업", "성장", "경험"],
    isFeatured: false,
    isTrending: false
  },
  {
    id: 5,
    title: "원격근무 시대의 커뮤니케이션 전략",
    content: "원격근무가 일상이 된 지금, 효과적인 커뮤니케이션 방법에 대해 이야기합니다. 비대면 환경에서도 팀워크를 유지하고 생산성을 높이는 방법을 제시합니다.",
    excerpt: "원격근무가 일상이 된 지금, 효과적인 커뮤니케이션 방법에 대해 이야기합니다...",
    category: "워크라이프",
    author: {
      name: "정리모트",
      title: "프로덕트 오너",
      company: "원격근무회사",
      experience: "4년차"
    },
    publishedAt: "2024-01-05",
    readTime: "5분",
    views: 523,
    likes: 38,
    comments: 9,
    tags: ["원격근무", "커뮤니케이션", "워크라이프"],
    isFeatured: false,
    isTrending: false
  }
]

const categories = [
  { name: "전체", count: 127 },
  { name: "커리어 전환", count: 32 },
  { name: "리더십", count: 28 },
  { name: "디자인", count: 24 },
  { name: "개발", count: 21 },
  { name: "스타트업", count: 15 },
  { name: "워크라이프", count: 7 }
]

export default function JournalPage() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'popular'>('latest')

  const filteredArticles = mockJournalArticles.filter(article => {
    const matchesCategory = selectedCategory === '전체' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.views - a.views
      case 'popular':
        return b.likes - a.likes
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '오늘'
    if (diffDays === 2) return '어제'
    if (diffDays <= 7) return `${diffDays - 1}일 전`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전`
    return `${Math.floor(diffDays / 30)}개월 전`
  }

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
            <span className="text-sm text-gray-600">커리어 인사이트</span>
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
              <h3 className="text-lg text-purple-600 font-semibold mb-4">정렬</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy('latest')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    sortBy === 'latest' ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-purple-50"
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => setSortBy('trending')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    sortBy === 'trending' ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-purple-50"
                  }`}
                >
                  인기순
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    sortBy === 'popular' ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-purple-50"
                  }`}
                >
                  좋아요순
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">커리어 저널</h1>
                <Link href="/journal/new">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    글 작성하기
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

            {/* Featured Articles */}
            {selectedCategory === '전체' && sortBy === 'latest' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  추천 아티클
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {mockJournalArticles.filter(article => article.isFeatured).map((article) => (
                    <Link key={article.id} href={`/journal/${article.id}`} className="block">
                      <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                            {article.author.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{article.author.name} • {article.author.company}</span>
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Articles List */}
            <div className="space-y-6">
              {sortedArticles.map((article) => (
                <Link key={article.id} href={`/journal/${article.id}`} className="block">
                  <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                    <div className="flex items-start space-x-4">
                      {/* Author Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {article.author.name.charAt(0)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.excerpt}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {article.isTrending && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                인기
                              </span>
                            )}
                            {article.isFeatured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                추천
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {article.author.name}
                            </span>
                            <span>{article.author.company}</span>
                            <span>{article.author.experience}</span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.readTime}
                            </span>
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {article.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {article.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {article.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* No Articles */}
            {sortedArticles.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">아티클이 없습니다</h3>
                <p className="text-gray-600">새로운 아티클을 작성해보세요.</p>
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
