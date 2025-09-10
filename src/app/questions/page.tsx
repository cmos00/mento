'use client'

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { Question, getAllQuestions } from '@/lib/questions'
import { Clock, Eye, Filter, MessageCircle, MessageSquare, Plus, RefreshCw, Search, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

export default function QuestionsPage() {
  const { data: session, status } = useSession()
  const user = session?.user
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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

  const loadQuestions = async () => {
    try {
      setLoading(true)
      setError('')
      const { data, error } = await getAllQuestions()
      
      if (error) {
        setError('질문을 불러오는 중 오류가 발생했습니다: ' + error.message)
        return
      }

      if (data) {
        console.log('로드된 질문 개수:', data.length)
        setQuestions(data)
      } else {
        setQuestions([])
      }
    } catch (err) {
      setError('질문을 불러오는 중 예상치 못한 오류가 발생했습니다.')
      console.error('질문 로드 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterQuestions = useCallback(() => {
    let filtered = [...questions]

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }

    // 검색어 필터
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(term) ||
        q.content.toLowerCase().includes(term) ||
        q.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    }

    setFilteredQuestions(filtered)
  }, [questions, selectedCategory, searchTerm])

  // 질문 데이터 로드
  useEffect(() => {
    loadQuestions()
  }, [])

  // 검색 및 필터링 적용
  useEffect(() => {
    filterQuestions()
  }, [filterQuestions])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '오늘'
    if (diffDays === 2) return '어제'
    if (diffDays <= 7) return `${diffDays - 1}일 전`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전`
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)}개월 전`
    return `${Math.floor(diffDays / 365)}년 전`
  }

  const getUserDisplayName = (question: Question) => {
    if (question.is_anonymous) {
      return '익명 사용자'
    }
    // users 테이블과 조인된 데이터가 있다면 사용
    return (question as any).users?.name || '사용자'
  }

  const getUserCompanyInfo = (question: Question) => {
    if (question.is_anonymous || !(question as any).users) {
      return ''
    }
    const user = (question as any).users
    if (user.company && user.position) {
      return `${user.company} · ${user.position}`
    }
    return user.company || user.position || ''
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
      <PCNavigation title="홈" icon={MessageCircle} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
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
        {/* 질문하기 버튼 (PC) */}
        <div className="hidden md:flex justify-end mb-6">
          {status === 'authenticated' ? (
            <Link href="/questions/new">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                질문하기
              </button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <button className="bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center opacity-60 shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                로그인 필요
              </button>
            </Link>
          )}
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-6 space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="질문을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* 필터 토글 */}
          <div className="flex items-center justify-between">
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
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">카테고리</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 질문 목록 */}
        <div>
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
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
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                      질문 작성하기
                    </button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <button className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all opacity-60">
                      로그인 후 질문 작성
                    </button>
                  </Link>
                )
              )}
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <Link key={question.id} href={`/questions/${question.id}`} className="block mb-[10px] last:mb-0">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                  {/* 질문 헤더 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getUserDisplayName(question)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getUserCompanyInfo(question) || formatDate(question.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {getCategoryDisplayName(question.category)}
                    </span>
                  </div>

                  {/* 질문 제목 */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {question.title}
                  </h3>

                  {/* 질문 내용 미리보기 */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {question.content}
                  </p>

                  {/* 태그 */}
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {question.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                          +{question.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 질문 통계 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {question.views || 0}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      0 답변
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(question.created_at)}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
