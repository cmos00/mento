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
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [votedQuestions, setVotedQuestions] = useState<Set<string>>(new Set())
  const [likes, setLikes] = useState<{[key: string]: {count: number, isLiked: boolean}}>({})
  const [likingQuestions, setLikingQuestions] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [userStats, setUserStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    mentoringSessions: 0,
  })

  const categories = ['전체', '이직', '인간관계', '성과관리', '기술개발', '리더십', '워라밸', '기타']

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(prev => prev === category ? '' : category)
  }

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'career': '이직',
      'work-life-balance': '워라밸',
      '인간관계': '인간관계',
      '리더십': '리더십'
    }
    return categoryMap[category] || category
  }

  // 좋아요 데이터 로딩
  const loadLikesData = useCallback(async (questionIds: string[]) => {
    if (!questionIds.length) return

    try {
      const likesData: {[key: string]: {count: number, isLiked: boolean}} = {}
      
      for (const questionId of questionIds) {
        const params = new URLSearchParams({
          questionId,
          ...(session?.user ? { userId: (session.user as any).id } : {})
        })
        
        const response = await fetch(`/api/questions/like?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          likesData[questionId] = {
            count: data.likeCount || 0,
            isLiked: data.isLiked || false
          }
        }
      }
      
      setLikes(prev => ({ ...prev, ...likesData }))
    } catch (error) {
      console.error('좋아요 데이터 로딩 오류:', error)
    }
  }, [session?.user])

  const loadQuestions = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)
      setError('')
      
      // 페이지네이션을 지원하는 질문 조회
      const result = await getQuestionsWithPagination(pageNum, 10)
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      const newQuestions = result.data || []
      
      if (append) {
        setQuestions(prev => [...prev, ...newQuestions])
        setFilteredQuestions(prev => [...prev, ...newQuestions])
      } else {
        setQuestions(newQuestions)
        setFilteredQuestions(newQuestions)
      }
      
      // 더 로딩할 질문이 있는지 확인 (10개 미만이면 끝)
      setHasMoreQuestions(newQuestions.length === 10)
      
      // 좋아요 데이터 로딩
      const questionIds = newQuestions.map(q => q.id)
      await loadLikesData(questionIds)
      
      // 첫 로딩 시에만 사용자 통계와 인기 질문 조회
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
      if (!append) setLoading(false)
      else setLoadingMore(false)
    }
  }, [status, user?.id, loadLikesData])

  const loadMoreQuestions = useCallback(async () => {
    if (loadingMore || !hasMoreQuestions) return
    
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    await loadQuestions(nextPage, true)
  }, [currentPage, loadQuestions, loadingMore, hasMoreQuestions])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  // 무한스크롤 이벤트 처리
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

    if (selectedCategory && selectedCategory !== '전체') {
      filtered = filtered.filter(question => question.category === selectedCategory)
    }

    setFilteredQuestions(filtered)
  }, [questions, searchTerm, selectedCategory])

  const getUserDisplayName = (question: Question) => {
    if (question.is_anonymous) {
      return '익명 사용자'
    }
    
    const user = (question as any).users
    
    // 탈퇴한 사용자인 경우 (컬럼이 존재할 때만 체크)
    if (user?.is_deleted === true) {
      return '탈퇴한 사용자'
    }
    
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
    if (user?.is_deleted === true) {
      return {
        displayName: '탈퇴한 사용자',
        avatarUrl: null,
        linkedinUrl: null,
        isDeleted: true,
        showProfile: false
      }
    }
    
    // 일반 사용자인 경우
    const displayName = getDisplayName(user?.name || '사용자') // DB의 실제 이름 사용하고 형식 변환
    const originalImageUrl = user?.image || user?.avatar_url // DB의 이미지 우선 사용
    
    // LinkedIn 이미지인 경우 프록시를 통해 제공
    const avatarUrl = originalImageUrl && originalImageUrl.includes('media.licdn.com') 
      ? `/api/image-proxy?url=${encodeURIComponent(originalImageUrl)}`
      : originalImageUrl
    
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
    return (question as any).answerCount || 0
  }

  // 좋아요 토글 함수
  const handleLikeToggle = async (questionId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!session?.user) {
      alert('로그인이 필요합니다.')
      return
    }

    if (likingQuestions.has(questionId)) {
      return
    }

    setLikingQuestions(prev => new Set(prev).add(questionId))

    try {
      const currentLike = likes[questionId]
      const isCurrentlyLiked = currentLike?.isLiked || false
      const action = isCurrentlyLiked ? 'unlike' : 'like'

      const response = await fetch('/api/questions/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          userId: (session.user as any).id,
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
      } else {
        const errorData = await response.json()
        console.error('좋아요 처리 오류:', errorData.error)
        alert('좋아요 처리에 실패했습니다.')
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
          <div className="flex items-center space-x-2">
            <button
              onClick={loadQuestions}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/questions/new">
              <button className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'authenticated' ? `안녕하세요, ${getDisplayName(user?.name || '사용자')}님!` : 'CareerTalk에 오신 것을 환영합니다!'}
            </h2>
            <p className="text-gray-600">
              {status === 'authenticated' 
                ? '오늘도 좋은 하루 되세요! 새로운 질문을 확인해보세요.' 
                : '커리어 고민을 나누고 전문가들의 조언을 받아보세요.'
              }
            </p>
          </div>
          
          {status === 'authenticated' && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <MessageSquare className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats.questionsAsked}</p>
                <p className="text-sm text-gray-600">작성한 질문</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <MessageCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats.answersGiven}</p>
                <p className="text-sm text-gray-600">작성한 답변</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <User className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats.mentoringSessions}</p>
                <p className="text-sm text-gray-600">멘토링 세션</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
              인기 질문
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {trendingQuestions.map((question, index) => (
              <Link key={question.id} href={`/questions/${question.id}`}>
                <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {getCategoryDisplayName(question.category) || '기술개발'}
                    </span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(question.created_at)}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{question.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{question.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {getAnswerCount(question)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {question.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div id="search-and-filter" className="mb-6 space-y-4">
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

        {error && (
          <div id="error-message" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div id="questions-list">
          {filteredQuestions.length === 0 ? (
            <div id="empty-state" className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedCategory ? '검색 결과가 없습니다' : '아직 질문이 없습니다'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory 
                  ? '다른 검색어나 카테고리를 시도해보세요.' 
                  : '첫 번째 질문을 작성해보세요!'
                }
              </p>
              {(!searchTerm && !selectedCategory) && (
                <Link href="/questions/new">
                  <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center mx-auto">
                    <Plus className="w-5 h-5 mr-2" />
                    질문 작성하기
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div id="questions-grid" className="space-y-6">
              {filteredQuestions.map((question, index) => (
                <div key={question.id} className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3 px-1">
                    {(() => {
                      const profileInfo = getUserProfileInfo(question)
                      return (
                        <>
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden relative">
                            {profileInfo.avatarUrl ? (
                              <img 
                                src={profileInfo.avatarUrl} 
                                alt={profileInfo.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                            <div className={`w-full h-full ${profileInfo.isDeleted ? 'bg-gray-400' : 'bg-purple-400'} text-white text-xs font-bold flex items-center justify-center`}>
                              {profileInfo.isDeleted ? '?' : profileInfo.displayName.charAt(0)}
                            </div>
                          </div>
                          {profileInfo.showProfile ? (
                            <a 
                              href={profileInfo.linkedinUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {profileInfo.displayName}
                            </a>
                          ) : (
                            <span className="text-sm font-medium text-gray-500">
                              {profileInfo.displayName}
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </div>
                  
                  <div className="w-full">
                    <Link href={`/questions/${question.id}`} className="block">
                      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform group-hover:-translate-y-1 relative">
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
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors pr-16">
                          {question.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-1">
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
            
            {loadingMore && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">더 많은 질문을 불러오는 중...</p>
              </div>
            )}
            
            {!hasMoreQuestions && questions.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">모든 질문을 확인하셨습니다.</p>
              </div>
            )}
          )}
        </div>
      </div>

      <div id="mobile-bottom-nav">
        <MobileBottomNav />
      </div>
    </div>
  )
}