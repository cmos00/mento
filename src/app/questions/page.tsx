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
  console.log('🔄 QuestionsPage 컴포넌트 렌더링 시작')
  
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
  
  console.log('✅ 단계 1: 기본 상태 관리 설정 완료')
  console.log('✅ 단계 2: 페이지네이션 상태 설정 완료', { currentPage, hasMoreQuestions, loadingMore })

  // 단계 3: useCallback 함수들 추가
  const loadLikesData = useCallback(async (questionIds: string[]) => {
    console.log('🔄 loadLikesData 호출됨', { questionIds })
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
      console.log('✅ 좋아요 데이터 로드 완료', likesData)
    } catch (error) {
      console.error('❌ 좋아요 데이터 로드 실패:', error)
    }
  }, [user?.id])

  const loadQuestions = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    console.log('🔄 loadQuestions 호출됨', { pageNum, append })
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
      console.log('✅ 질문 데이터 로드 완료', { count: newQuestions.length, pageNum })
      
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

  console.log('✅ 단계 3: useCallback 함수 정의 완료')

  // 단계 4: handleLikeToggle 함수 추가 (가장 복잡한 함수)
  const handleLikeToggle = useCallback(async (questionId: string) => {
    console.log('🔄 handleLikeToggle 호출됨', { questionId, userId: user?.id })
    
    if (!user?.id || likingQuestions.has(questionId)) {
      console.log('⚠️ 좋아요 처리 중단', { noUser: !user?.id, alreadyLiking: likingQuestions.has(questionId) })
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
      
      console.log('🔄 API 호출 준비', { action, currentLikeData })

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
      console.log('✅ API 응답 수신', result)

      // 상태 업데이트
      setLikes(prev => ({
        ...prev,
        [questionId]: {
          count: result.likeCount,
          isLiked: result.isLiked
        }
      }))

      console.log('✅ 좋아요 처리 완료', { questionId, newState: result })

    } catch (error) {
      console.error('❌ 좋아요 처리 실패:', error)
      alert('좋아요 처리에 실패했습니다.')
    } finally {
      // 로딩 상태 제거
      setLikingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
      console.log('🏁 좋아요 처리 종료')
    }
  }, [user?.id, likes, likingQuestions])

  console.log('✅ 단계 4: handleLikeToggle 함수 정의 완료')

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
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            질문 목록 (단계 5: 기본 JSX)
          </h1>
          <p className="text-gray-600">
            기본 헤더와 레이아웃이 추가되었습니다.
          </p>
          <p className="text-sm text-purple-600 mt-2">
            로딩 상태: {loading ? '로딩 중' : '완료'} | 
            질문 수: {questions.length}개 |
            현재 페이지: {currentPage}
          </p>
        </div>
      </div>

      <div id="mobile-bottom-nav">
        <MobileBottomNav />
      </div>
    </div>
  )
}