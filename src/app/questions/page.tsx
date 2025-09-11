'use client'

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { Question, getAllQuestionsWithStats, getTrendingQuestions, getUserStats } from '@/lib/questions'
import { Eye, Filter, MessageCircle, MessageSquare, Plus, RefreshCw, Search, Star, ThumbsUp, TrendingUp, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

export default function QuestionsPage() {
  const { data: session, status } = useSession()
  const user = session?.user
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [userStats, setUserStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    mentoringSessions: 0,
  })

  const categories = [
    '커리어 전환',
    '면접 준비', 
    '업무 스킬',
    '팀 관리',
    '네트워킹',
    '워라밸',
    '인간관계',
    '리더십'
  ]

  // 카테고리 표시명 매핑
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'career-transition': '커리어 전환',
      'interview-prep': '면접 준비',
      'work-skills': '업무 스킬',
      'team-management': '팀 관리',
      'networking': '네트워킹',
      'work-life-balance': '워라밸',
      '인간관계': '인간관계',
      '리더십': '리더십'
    }
    return categoryMap[category] || category
  }

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      // 질문과 답변 수를 함께 조회
      const result = await getAllQuestionsWithStats()
      if (result.error) {
        throw new Error(result.error.message)
      }
      setQuestions(result.data || [])
      setFilteredQuestions(result.data || [])
      
      // 로그인한 사용자의 통계 조회
      if (status === 'authenticated' && user?.id) {
        const statsResult = await getUserStats(user.id)
        if (statsResult.data) {
          setUserStats(statsResult.data)
        }
      }
      
      // 인기 질문 조회
      const trendingResult = await getTrendingQuestions(3)
      if (trendingResult.data) {
        setTrendingQuestions(trendingResult.data)
      }
    } catch (err) {
      console.error('질문 로딩 실패:', err)
      setError('질문을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [status, user?.id])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  // 검색 및 필터링
  useEffect(() => {
    let filtered = questions

    if (searchTerm) {
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(question => question.category === selectedCategory)
    }

    setFilteredQuestions(filtered)
  }, [questions, searchTerm, selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}주 전`
    return date.toLocaleDateString('ko-KR')
  }

  const getUserDisplayName = (question: Question) => {
    if (question.is_anonymous) {
      return '익명 사용자'
    }
    // users 테이블과 조인된 데이터가 있다면 사용
    return getDisplayName((question as any).users?.name || '사용자')
  }

  const getDisplayName = (name: string) => {
    if (!name || name === '사용자') return name
    const parts = name.split(' ')
    if (parts.length >= 2) {
      // 성과 이름을 바꿔서 표시 (예: "동현 김" -> "김 동현")
      return `${parts[parts.length - 1]} ${parts.slice(0, -1).join(' ')}`
    }
    return name
  }

  // 답변 수 계산 함수
  const getAnswerCount = (question: Question) => {
    // 질문 객체에 answerCount가 포함되어 있으면 사용, 없으면 0
    return (question as any).answerCount || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">질문을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* PC Navigation */}
      <div id="pc-navigation">
        <PCNavigation title="홈" icon={MessageCircle} />
      </div>
      
      {/* Mobile Header */}
      <header id="mobile-header" className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">홈</h1>
            <button
              onClick={loadQuestions}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {status === 'authenticated' ? (
            <Link href="/questions/new">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                질문 작성
              </button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center opacity-60">
                <Plus className="w-4 h-4 mr-2" />
                로그인 필요
              </button>
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div id="hero-section" className="mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-between min-h-[120px]">
              <div className="flex flex-col justify-center flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {status === 'authenticated' ? `안녕하세요, ${getDisplayName(user?.name || '사용자')}님!` : 'CareerTalk에 오신 것을 환영합니다!'}
                </h1>
                <p className="text-lg text-gray-600">
                  {status === 'authenticated' 
                    ? '오늘도 멘토들과 함께 성장해보세요' 
                    : '멘토들과 함께 커리어 성장의 여정을 시작하세요'
                  }
                </p>
              </div>
              <div className="hidden md:block p-4">
                {status === 'authenticated' ? (
                  <Link href="/questions/new">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <Plus className="w-5 h-5 mr-2" />
                      질문하기
                    </button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <Plus className="w-5 h-5 mr-2" />
                      시작하기
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Questions Section */}
        <div id="trending-questions-section" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              인기 질문
            </h2>
            <Link href="/questions?sort=trending" className="text-purple-600 hover:text-purple-700 font-medium">
              더보기 →
            </Link>
          </div>
          <div id="trending-questions-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {trendingQuestions.length > 0 ? trendingQuestions.map((question, index) => (
              <div key={question.id} className="relative">
                {/* 프로필 영역 - 카드 밖 */}
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm mr-3">
                    {getUserDisplayName(question).charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {getUserDisplayName(question)}
                    </div>
                    <div className="text-xs text-gray-500">CEO • {formatDate(question.created_at)}</div>
                  </div>
                </div>
                
                {/* 카드 영역 */}
                <Link href={`/questions/${question.id}`} className="group block">
                  <div id={`trending-question-${index}`} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform group-hover:-translate-y-1 relative">
                    {/* 날짜를 카드 우측 상단에 배치 */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs text-gray-500">{formatDate(question.created_at)}</span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        {getCategoryDisplayName(question.category) || '기술개발'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors pr-16">
                      {question.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {question.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {getAnswerCount(question)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {question.views || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          👍 1
                        </span>
                        <span className="flex items-center">
                          ⭐ 1
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )) : questions.slice(0, 3).map((question, index) => (
              <Link key={question.id} href={`/questions/${question.id}`} className="group">
                <div id={`trending-question-${index}`} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform group-hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      최신
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(question.created_at)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {question.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {getUserDisplayName(question)}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {getAnswerCount(question)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {question.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div id="search-and-filter" className="mb-6 space-y-4">
          {/* 검색바 */}
          <div id="search-bar" className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="search-input"
              type="text"
              placeholder="질문을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* 필터 토글 */}
          <div id="filter-toggle" className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-4 h-4 mr-2" />
              필터
            </button>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                필터 초기화
              </button>
            )}
          </div>

          {/* 카테고리 필터 */}
          {showFilters && (
            <div id="category-filter" className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    id={`category-button-${index}`}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div id="error-message" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 질문 목록 */}
        <div id="questions-list">
          {filteredQuestions.length === 0 ? (
            <div id="empty-state" className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory ? '검색 결과가 없습니다' : '아직 질문이 없습니다'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory 
                  ? '다른 검색어나 카테고리를 시도해보세요'
                  : '첫 번째 질문을 작성해보세요!'
                }
              </p>
              {!searchTerm && !selectedCategory && (
                status === 'authenticated' ? (
                  <Link href="/questions/new">
                    <button id="create-question-button" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                      질문 작성하기
                    </button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <button id="login-required-button" className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all opacity-60">
                      로그인 후 질문 작성
                    </button>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div id="questions-container" className="space-y-6 p-2">
              {filteredQuestions.map((question, index) => (
                <div key={question.id} className="relative">
                  {/* 프로필 영역 - 카드 밖 */}
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm mr-3">
                      {getUserDisplayName(question).charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getUserDisplayName(question)}
                      </div>
                      <div className="text-xs text-gray-500">CEO • {formatDate(question.created_at)}</div>
                    </div>
                  </div>
                  
                  {/* 카드 영역 */}
                  <Link href={`/questions/${question.id}`} className="block group">
                    <div id={`question-item-${index}`} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform group-hover:-translate-y-1 relative">
                      {/* 날짜를 카드 우측 상단에 배치 */}
                      <div className="absolute top-4 right-4">
                        <span className="text-xs text-gray-500">{formatDate(question.created_at)}</span>
                      </div>
                      
                      <div className="mb-3">
                        {question.category && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            {getCategoryDisplayName(question.category)}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors pr-16">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {question.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {getAnswerCount(question)}개 답변
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {question.views || 0}회 조회
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle like action
                            }}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle bookmark action
                            }}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div id="mobile-bottom-nav">
        <MobileBottomNav />
      </div>
    </div>
  )
}