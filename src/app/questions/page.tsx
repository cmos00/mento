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
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            질문 목록 (간단 버전)
          </h1>
          <p className="text-gray-600">
            현재 테스트 중입니다.
          </p>
        </div>
      </div>

      <div id="mobile-bottom-nav">
        <MobileBottomNav />
      </div>
    </div>
  )
}