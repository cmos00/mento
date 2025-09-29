'use client'

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { Question, getTrendingQuestions } from '@/lib/questions'
import { getDisplayName } from '@/lib/utils'
import { ArrowLeft, Eye, MessageCircle, Star, ThumbsUp, TrendingUp } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

// 스켈레톤 UI 컴포넌트
const TrendingQuestionSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
    {/* 배지 영역 */}
    <div className="flex justify-between mb-4">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-12 bg-gray-200 rounded"></div>
    </div>
    
    {/* 스코어 표시 */}
    <div className="mb-4">
      <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
    </div>
    
    {/* 카테고리 */}
    <div className="mb-3">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    
    {/* 제목 */}
    <div className="mb-3">
      <div className="h-5 bg-gray-200 rounded mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
    </div>
    
    {/* 내용 */}
    <div className="mb-4">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
    
    {/* 하단 정보 */}
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="h-4 w-8 bg-gray-200 rounded"></div>
        <div className="h-4 w-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
)

export default function TrendingQuestionsPage() {
  const { data: session, status } = useSession()
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTrendingQuestions = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const result = await getTrendingQuestions(20) // 더 많은 인기 질문 로드
      if (result.error) {
        throw new Error(result.error.message)
      }
      setTrendingQuestions(result.data || [])
    } catch (err) {
      console.error('인기 질문 로딩 실패:', err)
      setError('인기 질문을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTrendingQuestions()
  }, [loadTrendingQuestions])

  const formatTimeAgo = (dateString: string) => {
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
    return getDisplayName((question as any).users?.name || '사용자')
  }


  const getAnswerCount = (question: Question) => {
    return (question as any).answerCount || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* PC Navigation */}
        <PCNavigation title="인기 질문" icon={TrendingUp} />
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/questions" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                인기 질문
              </h1>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="w-6 h-6 text-purple-500 mr-3" />
                    인기 질문 모아보기
                  </h1>
                  <p className="text-lg text-gray-600">
                    가장 활발하게 논의되고 있는 질문들입니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 스켈레톤 UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <TrendingQuestionSkeleton key={index} />
            ))}
          </div>
        </div>

        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* PC Navigation */}
      <PCNavigation title="인기 질문" icon={TrendingUp} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/questions" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              인기 질문
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <TrendingUp className="w-6 h-6 text-purple-500 mr-3" />
                  인기 질문 모아보기
                </h1>
                <p className="text-lg text-gray-600">
                  가장 활발하게 논의되고 있는 질문들입니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Trending Questions List */}
        <div>
          {trendingQuestions.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                인기 질문이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                아직 충분한 활동이 없어 인기 질문을 표시할 수 없습니다
              </p>
              <Link href="/questions" className="text-purple-600 hover:text-purple-700 font-medium">
                ← 전체 질문 보기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {trendingQuestions.map((question, index) => (
                <Link key={question.id} href={`/questions/${question.id}`} className="group block">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform group-hover:-translate-y-1 relative h-full flex flex-col">
                    {/* 인기 순위 배지 */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full font-medium">
                        #{index + 1} 인기
                      </span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(question.created_at)}</span>
                    </div>
                    
                    {/* 트렌딩 스코어 */}
                    {(question as any).trendingScore && (
                      <div className="mb-3">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                          점수: {Math.round((question as any).trendingScore)}
                        </span>
                      </div>
                    )}
                    
                    {/* 카테고리 */}
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        {question.category || '기술개발'}
                      </span>
                    </div>
                    
                    {/* 메인 콘텐츠 */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                        {question.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {question.content}
                      </p>
                    </div>
                    
                    {/* 하단 정보 */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
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
                      
                      {/* 액션 버튼 */}
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            // Handle like action
                          }}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
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
              ))}
            </div>
          )}
        </div>
        
        {/* Back to Questions */}
        <div className="mt-8 text-center">
          <Link 
            href="/questions" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            전체 질문으로 돌아가기
          </Link>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
