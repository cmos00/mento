'use client'

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { Question, getQuestionsWithPagination, getTrendingQuestions, getUserStats } from '@/lib/questions'
import { formatTimeAgo, getDisplayName } from '@/lib/utils'
import { Eye, MessageCircle, MessageSquare, Plus, RefreshCw, Search, ThumbsUp, TrendingUp, User } from 'lucide-react'
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
  const [votedQuestions, setVotedQuestions] = useState<Set<string>>(new Set())
  const [likes, setLikes] = useState<{[key: string]: {count: number, isLiked: boolean}}>({})
  const [likingQuestions, setLikingQuestions] = useState<Set<string>>(new Set())
  const [userStats, setUserStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    mentoringSessions: 0,
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

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

  // 좋아요 데이터 로딩 (서버 연동 시도, 실패 시 기본값)
  const loadLikesData = useCallback(async (questionIds: string[]) => {
    if (!questionIds.length) return

    try {
      const likesData: {[key: string]: {count: number, isLiked: boolean}} = {}
      
      console.log('좋아요 데이터 로딩 시도:', { questionIds, userId: user?.id })
      
      // 병렬로 모든 질문의 좋아요 데이터를 조회
      const promises = questionIds.map(async (questionId) => {
        try {
          const params = new URLSearchParams({
            questionId,
            ...(user?.id ? { userId: user.id } : {})
          })
          
          const response = await fetch(`/api/questions/like?${params.toString()}`)
          if (response.ok) {
            const data = await response.json()
            return {
              questionId,
              data: {
                count: data.likeCount || 0,
                isLiked: user?.id ? (data.isLiked || false) : false
              }
            }
          } else {
            console.log(`좋아요 데이터 조회 실패 - ${questionId}:`, response.status, response.statusText)
            // 좋아요 수만이라도 조회해보기
            try {
              const countResponse = await fetch(`/api/questions/like?questionId=${questionId}`)
              if (countResponse.ok) {
                const countData = await countResponse.json()
                return {
                  questionId,
                  data: {
                    count: countData.likeCount || 0,
                    isLiked: false
                  }
                }
              }
            } catch (countError) {
              console.log(`좋아요 수 조회 실패 - ${questionId}:`, countError)
            }
            throw new Error(`HTTP ${response.status}`)
          }
        } catch (error) {
          console.log(`좋아요 데이터 로딩 실패 - ${questionId}:`, error)
          return {
            questionId,
            data: { count: 0, isLiked: false }
          }
        }
      })
      
      const results = await Promise.all(promises)
      
      // 결과를 likesData 객체로 변환
      results.forEach(({ questionId, data }) => {
        likesData[questionId] = data
      })
      
      setLikes(prev => ({ ...prev, ...likesData }))
      console.log('좋아요 데이터 로딩 완료:', likesData)
    } catch (error) {
      console.error('좋아요 데이터 로딩 중 전체 오류:', error)
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
      
      // 질문과 답변 수를 함께 조회 (페이지네이션)
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
      
      // 더 불러올 질문이 있는지 확인
      setHasMoreQuestions(newQuestions.length === 10)
      
      // 좋아요 데이터 로딩 (세션이 로드된 후에만)
      const questionIds = newQuestions.map(q => q.id)
      if (status !== 'loading') {
        // 비동기로 처리하여 질문 로딩을 방해하지 않음
        loadLikesData(questionIds).catch(error => {
          console.error('좋아요 데이터 로딩 실패:', error)
        })
      }
      
      // 첫 페이지 로딩시에만 사용자 통계와 인기 질문 조회
      if (!append) {
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
      }
    } catch (err) {
      console.error('질문 로딩 실패:', err)
      setError('질문을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [status, user?.id])

  useEffect(() => {
    loadQuestions()
    setCurrentPage(0)
  }, [status, user?.id, loadQuestions])

  // 세션이 로드된 후 기존 질문들의 좋아요 데이터 로드 (중복 제거)
  useEffect(() => {
    if (status !== 'loading' && questions.length > 0) {
      const questionIds = questions.map(q => q.id)
      loadLikesData(questionIds)
    }
  }, [status, questions.length, loadLikesData])

  // 무한스크롤을 위한 함수
  const loadMoreQuestions = useCallback(async () => {
    if (loadingMore || !hasMoreQuestions) return
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    await loadQuestions(nextPage, true)
  }, [currentPage, loadQuestions, loadingMore, hasMoreQuestions])

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreQuestions()
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreQuestions])

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


  const handleVote = async (questionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch('/api/questions/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId }),
      })

      const result = await response.json()

      if (result.success) {
        // 투표 상태 업데이트
        setVotedQuestions(prev => {
          const newSet = new Set(prev)
          if (result.isVoted) {
            newSet.add(questionId)
          } else {
            newSet.delete(questionId)
          }
          return newSet
        })

        // 질문 목록 새로고침
        loadQuestions()
      } else {
        alert(result.error || '투표에 실패했습니다.')
      }
    } catch (error) {
      console.error('투표 오류:', error)
      alert('투표 중 오류가 발생했습니다.')
    }
  }

  const getUserDisplayName = (question: Question) => {
    if (question.is_anonymous) {
      return '익명 사용자'
    }
    
    const user = (question as any).users
    
    // 탈퇴한 사용자인 경우 (컬럼이 존재할 때만 체크)
    // if (user?.is_deleted === true) {
    //   return '탈퇴한 사용자'
    // }
    
    // users 테이블과 조인된 데이터가 있다면 사용
    return getDisplayName(user?.name || '사용자')
  }

  const getUserProfileInfo = (question: Question) => {
    const user = (question as any).users
    
    // 익명 사용자인 경우
    if (question.is_anonymous) {
      return {
        displayName: '익명 사용자',
        avatarUrl: null,
        linkedinUrl: null,
        isDeleted: false,
        showProfile: false
      }
    }
    
    // 탈퇴한 사용자인 경우 (컬럼이 존재할 때만 체크)
    // if (user?.is_deleted === true) {
    //   return {
    //     displayName: '탈퇴한 사용자',
    //     avatarUrl: null,
    //     linkedinUrl: null,
    //     isDeleted: true,
    //     showProfile: false
    //   }
    // }
    
    // 일반 사용자인 경우
    const displayName = getDisplayName(user?.name || '사용자') // DB의 실제 이름 사용하고 형식 변환
    const originalImageUrl = user?.image || user?.avatar_url // DB의 이미지 우선 사용
    
    // LinkedIn 이미지인 경우 프록시를 통해 제공
    const avatarUrl = originalImageUrl && originalImageUrl.includes('media.licdn.com') 
      ? `/api/image-proxy?url=${encodeURIComponent(originalImageUrl)}`
      : originalImageUrl
    
    // 디버깅을 위한 로그
    console.log('🖼️ [Questions Page] 사용자 이미지 정보:', {
      userId: user?.id,
      userName: user?.name,
      originalImage: originalImageUrl,
      proxyImage: avatarUrl,
      isLinkedInImage: originalImageUrl?.includes('media.licdn.com')
    })
    
    return {
      displayName: displayName,
      avatarUrl: avatarUrl,
      linkedinUrl: user?.linkedin_url || `https://linkedin.com/in/${displayName.toLowerCase().replace(' ', '-')}`,
      isDeleted: false,
      showProfile: true
    }
  }


  // 답변 수 계산 함수
  const getAnswerCount = (question: Question) => {
    // 질문 객체에 answerCount가 포함되어 있으면 사용, 없으면 0
    return (question as any).answerCount || 0
  }

  // 좋아요 토글 함수 (서버 연동 시도, 실패 시 로컬 상태만 업데이트)
  const handleLikeToggle = async (questionId: string, event: React.MouseEvent) => {
    event.preventDefault() // Link 클릭 방지
    event.stopPropagation()

    if (!user?.id) {
      alert('로그인이 필요합니다.')
      return
    }

    if (likingQuestions.has(questionId)) {
      return // 이미 처리 중
    }

    setLikingQuestions(prev => new Set(prev).add(questionId))

    try {
      const currentLike = likes[questionId]
      const isCurrentlyLiked = currentLike?.isLiked || false
      const action = isCurrentlyLiked ? 'unlike' : 'like'
      
      // 서버에 좋아요 상태 업데이트 시도
      try {
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

        if (response.ok) {
          const data = await response.json()
          setLikes(prev => ({
            ...prev,
            [questionId]: {
              count: data.likeCount,
              isLiked: !isCurrentlyLiked
            }
          }))
          console.log('서버 좋아요 상태 업데이트 성공:', data)
        } else {
          // 서버 오류 시 로컬 상태만 업데이트
          setLikes(prev => ({
            ...prev,
            [questionId]: {
              count: (currentLike?.count || 0) + (isCurrentlyLiked ? -1 : 1),
              isLiked: !isCurrentlyLiked
            }
          }))
          console.log('서버 오류로 로컬 상태만 업데이트')
        }
      } catch (apiError) {
        // API 호출 실패 시 로컬 상태만 업데이트
        setLikes(prev => ({
          ...prev,
          [questionId]: {
            count: (currentLike?.count || 0) + (isCurrentlyLiked ? -1 : 1),
            isLiked: !isCurrentlyLiked
          }
        }))
        console.log('API 호출 실패로 로컬 상태만 업데이트')
      }
      
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error)
      alert('좋아요 처리 중 오류가 발생했습니다.')
    } finally {
      setLikingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }
  }

  // Skeleton UI 컴포넌트
  const QuestionSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      
      <div className="mb-3">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-6"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  )

  const TrendingSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      
      <div className="mb-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-6"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 헤더 Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* 인기 질문 섹션 Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {[1, 2, 3].map((i) => (
                <TrendingSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* 검색바 Skeleton */}
          <div className="mb-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* 카테고리 태그 Skeleton */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* 질문 리스트 Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <QuestionSkeleton key={i} />
            ))}
          </div>
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
      <header id="mobile-header" className="md:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">홈</h1>
             <button
               onClick={() => loadQuestions(0, false)}
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
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between min-h-[60px]">
              <div className="flex flex-col justify-center flex-1 ml-6">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {status === 'authenticated' ? `안녕하세요, ${getDisplayName(user?.name || '사용자')}님!` : 'CareerTalk에 오신 것을 환영합니다!'}
                </h1>
                <p className="text-base text-gray-600">
                  {status === 'authenticated' 
                    ? '오늘도 멘토들과 함께 성장해보세요' 
                    : '멘토들과 함께 커리어 성장의 여정을 시작하세요'
                  }
                </p>
              </div>
              <div className="hidden md:block p-4">
                {status === 'authenticated' ? (
                  <Link href="/questions/new">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center shadow-lg hover:shadow-lg transform hover:-translate-y-1">
                      <Plus className="w-5 h-5 mr-2" />
                      질문하기
                    </button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center shadow-lg hover:shadow-lg transform hover:-translate-y-1">
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
            <Link href="/questions/trending" className="text-purple-600 hover:text-purple-700 font-medium">
              더보기 →
            </Link>
          </div>
          <div id="trending-questions-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {trendingQuestions.length > 0 ? trendingQuestions.map((question, index) => (
              <Link key={question.id} href={`/questions/${question.id}`} className="group block">
                  <div id={`trending-question-${index}`} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform group-hover:-translate-y-1 relative h-64 flex flex-col">
                    {/* 날짜를 카드 우측 상단에 배치 */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs text-gray-500">{formatTimeAgo(question.created_at)}</span>
                    </div>
                    
                    <div className="mb-3 overflow-hidden">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        {getCategoryDisplayName(question.category) || '기술개발'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors pr-16">
                      {question.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 h-12 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.5rem'
                    }}>
                      {question.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
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
            )) : questions.slice(0, 3).map((question, index) => (
              <Link key={question.id} href={`/questions/${question.id}`} className="group">
                <div id={`trending-question-${index}`} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform group-hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      인기 급상승
                    </span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(question.created_at)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-3 group-hover:text-purple-700 transition-colors">
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors duration-200"
            />
          </div>

          {/* 카테고리 필터 - 항상 표시 */}
          <div id="category-filter" className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                id={`category-button-${index}`}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  selectedCategory === category
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
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
            <div id="questions-container" className="space-y-12 py-12 w-full overflow-visible">
              {filteredQuestions.map((question, index) => (
                <div key={question.id} className="relative flex flex-col py-4 overflow-visible">
                  {/* 프로필 영역 - 카드 밖 */}
                  <div className="flex items-center mb-2 overflow-visible">
                    {(() => {
                      const profileInfo = getUserProfileInfo(question)
                      return (
                        <>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3 overflow-hidden ${
                            profileInfo.isDeleted ? 'bg-gray-400' : 'bg-purple-500'
                          }`}>
                            {profileInfo.avatarUrl ? (
                              <img 
                                src={profileInfo.avatarUrl} 
                                alt={profileInfo.displayName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('❌ [Questions Page] 이미지 로드 실패:', profileInfo.avatarUrl)
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const sibling = target.nextElementSibling as HTMLElement;
                                  if (sibling) sibling.style.display = 'flex';
                                }}
                                onLoad={() => {
                                  console.log('✅ [Questions Page] 이미지 로드 성공:', profileInfo.avatarUrl)
                                }}
                              />
                            ) : null}
                            <span className={`${profileInfo.avatarUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                              {profileInfo.isDeleted ? '?' : profileInfo.displayName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex items-center h-10">
                            {profileInfo.showProfile ? (
                              <a 
                                href={profileInfo.linkedinUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-gray-900 hover:text-purple-700 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {profileInfo.displayName}
                              </a>
                            ) : (
                              <span className={`text-sm font-medium ${
                                profileInfo.isDeleted ? 'text-gray-500' : 'text-gray-900'
                              }`}>
                                {profileInfo.displayName}
                              </span>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                  
                  {/* 카드 영역 - 프로필 이름과 시작점 맞춤, 전체 width 사용 */}
                  <div className="ml-[52px] w-[calc(100%-52px)] py-2 px-1">
                    <Link href={`/questions/${question.id}`} className="block group">
                      <div id={`question-item-${index}`} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform group-hover:-translate-y-1 relative">
                      {/* 날짜를 카드 우측 상단에 배치 */}
                      <div className="absolute top-4 right-4 overflow-hidden">
                        <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(question.created_at)}</span>
                      </div>
                      
                      <div className="mb-3 overflow-hidden">
                        {question.category && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            {getCategoryDisplayName(question.category)}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3 group-hover:text-purple-700 transition-colors pr-16">
                        {question.title}
                      </h3>
                       <p className="text-gray-600 text-sm mb-6 line-clamp-5 leading-relaxed">
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
                         <button
                           onClick={(e) => handleLikeToggle(question.id, e)}
                           disabled={likingQuestions.has(question.id)}
                           className={`flex items-center text-sm transition-colors ${
                             likes[question.id]?.isLiked 
                               ? 'text-purple-500 hover:text-purple-600' 
                               : 'text-gray-500 hover:text-purple-500'
                           } ${likingQuestions.has(question.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                         >
                           <ThumbsUp 
                             className={`w-4 h-4 mr-1 ${
                               likes[question.id]?.isLiked ? 'fill-current' : ''
                             }`} 
                           />
                           {likes[question.id]?.count || 0}개 좋아요
                         </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
               ))}
             </div>
           )}
           
           {/* 무한스크롤 로딩 표시 */}
           {loadingMore && (
             <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <QuestionSkeleton key={`loading-${i}`} />
               ))}
             </div>
           )}
           
           {!hasMoreQuestions && questions.length > 0 && (
             <div className="text-center py-8">
               <p className="text-gray-500">모든 질문을 확인하셨습니다.</p>
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