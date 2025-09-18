'use client'

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { Question, getQuestionsWithPagination, getTrendingQuestions, getUserStats } from '@/lib/questions'
import { Eye, MessageCircle, MessageSquare, Plus, RefreshCw, Search, ThumbsUp, TrendingUp, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { formatTimeAgo, getDisplayName } from '@/lib/utils'

export default function QuestionsPage() {
  const { data: session, status } = useSession()
  const user = session?.user
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [likes, setLikes] = useState<{[key: string]: {count: number, isLiked: boolean}}>({})
  const [likingQuestions, setLikingQuestions] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadLikesData = useCallback(async (questionIds: string[]) => {
    if (!questionIds.length || !user?.id) return
    
    try {
      const likesData: {[key: string]: {count: number, isLiked: boolean}} = {}
      
      for (const questionId of questionIds) {
        const response = await fetch(`/api/questions/like?questionId=${questionId}&userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          likesData[questionId] = data
        }
      }
      
      setLikes(prev => ({ ...prev, ...likesData }))
    } catch (error) {
      console.error('❌ 좋아요 데이터 로드 실패:', error)
    }
  }, [user?.id])

  const loadQuestions = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true)
        setError('')
      } else {
        setLoadingMore(true)
      }

      const result = await getQuestionsWithPagination(pageNum, 10)
      if (result.error) {
        throw new Error(result.error.message)
      }

      const newQuestions = result.data || []
      
      if (append) {
        setQuestions(prev => [...prev, ...newQuestions])
      } else {
        setQuestions(newQuestions)
      }
      
      setHasMoreQuestions(newQuestions.length === 10)
      
      // 좋아요 데이터 로드
      const questionIds = newQuestions.map(q => q.id)
      await loadLikesData(questionIds)

    } catch (err) {
      console.error('❌ 질문 로딩 실패:', err)
      setError('질문을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [loadLikesData])

  const handleLikeToggle = useCallback(async (questionId: string) => {
    if (!user?.id || likingQuestions.has(questionId)) {
      return
    }

    try {
      // 로딩 상태 추가
      setLikingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.add(questionId)
        return newSet
      })

      const currentLikeData = likes[questionId] || { count: 0, isLiked: false }
      const action = currentLikeData.isLiked ? 'unlike' : 'like'
      

      const response = await fetch('/api/questions/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          userId: user.id,
          action
        }),
      })

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`)
      }

      const result = await response.json()

      // 상태 업데이트
      setLikes(prev => ({
        ...prev,
        [questionId]: {
          count: result.likeCount,
          isLiked: result.isLiked
        }
      }))


    } catch (error) {
      console.error('❌ 좋아요 처리 실패:', error)
      console.error('좋아요 처리에 실패했습니다. 다시 시도해주세요.')
    } finally {
      // 로딩 상태 제거
      setLikingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }
  }, [user?.id, likes, likingQuestions])

  useEffect(() => {
    loadQuestions(0, false)
  }, [status, user?.id, loadQuestions])

  // 무한 스크롤을 위한 스크롤 이벤트 리스너
  const loadMoreQuestions = useCallback(async () => {
    if (loadingMore || !hasMoreQuestions) return
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    await loadQuestions(nextPage, true)
  }, [currentPage, loadQuestions, loadingMore, hasMoreQuestions])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreQuestions()
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreQuestions])


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
      <div id="pc-navigation">
        <PCNavigation title="홈" icon={MessageCircle} />
      </div>
      
      <header id="mobile-header" className="md:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">홈</h1>
          </div>
          <Link href="/questions/new">
            <button className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>질문하기</span>
            </button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 질문 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.length > 0 ? (
            questions.map((question) => {
              const likeData = likes[question.id] || { count: 0, isLiked: false }
              const isLiking = likingQuestions.has(question.id)
              
              return (
                <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {question.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-8 line-clamp-3 flex-1">
                    {question.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {(question as any).answerCount || 0}개 답변
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleLikeToggle(question.id)
                      }}
                      disabled={isLiking}
                      className={`flex items-center text-sm transition-colors ${
                        likeData.isLiked 
                          ? 'text-purple-500 hover:text-purple-600' 
                          : 'text-gray-500 hover:text-purple-500'
                      } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <ThumbsUp 
                        className={`w-4 h-4 mr-1 ${
                          likeData.isLiked ? 'fill-current' : ''
                        }`} 
                      />
                      {likeData.count}개 좋아요
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">아직 질문이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 무한 스크롤 로딩 표시 */}
        {loadingMore && (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">더 많은 질문을 불러오는 중...</p>
          </div>
        )}
        
        {!hasMoreQuestions && questions.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">모든 질문을 확인하셨습니다.</p>
          </div>
        )}
      </div>

      <div id="mobile-bottom-nav">
        <MobileBottomNav />
      </div>
    </div>
  )
}