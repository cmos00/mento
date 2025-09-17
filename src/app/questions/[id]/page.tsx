'use client'

import MobileBottomNav from '@/components/MobileBottomNav'
import { FeedbackWithAuthor, getFeedbacksByQuestionId } from '@/lib/feedbacks'
import { Question, getQuestionById, incrementQuestionViews } from '@/lib/questions'
import { ArrowLeft, Bookmark, Clock, Eye, MessageCircle, Send, Share2, Tag, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { formatTimeAgo, getDisplayName } from '@/lib/utils'

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [question, setQuestion] = useState<Question | null>(null)
  const [feedbacks, setFeedbacks] = useState<FeedbackWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [answerContent, setAnswerContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const questionId = params.id as string

  const loadQuestion = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔍 [DEBUG] 질문 로딩 시작:', questionId)
      
      const { data, error } = await getQuestionById(questionId)
      
      console.log('🔍 [DEBUG] 질문 로딩 결과:', { data, error, questionId })
      
      if (error) {
        const errorMessage = `질문을 불러오는 중 오류가 발생했습니다: ${error.message}`
        console.error('❌ [DEBUG] 질문 로딩 에러:', errorMessage)
        setError(errorMessage)
        return
      }

      if (data) {
        console.log('✅ [DEBUG] 질문 로딩 성공:', data.title)
        setQuestion(data)
        // 조회수 증가
        incrementQuestionViews(questionId)
      } else {
        console.error('❌ [DEBUG] 질문 데이터 없음')
        setError('해당 질문을 찾을 수 없습니다.')
      }
    } catch (err) {
      const errorMessage = '질문을 불러오는 중 예상치 못한 오류가 발생했습니다.'
      console.error('❌ [DEBUG] 질문 로드 예외:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [questionId])

  const loadFeedbacks = useCallback(async () => {
    try {
      setFeedbackLoading(true)
      const feedbackData = await getFeedbacksByQuestionId(questionId)
      setFeedbacks(feedbackData)
    } catch (err) {
      console.error('피드백 로드 오류:', err)
    } finally {
      setFeedbackLoading(false)
    }
  }, [questionId])

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim() || !session?.user) {
      return
    }

    try {
      setSubmitting(true)

      const feedbackData = {
        question_id: questionId,
        content: answerContent.trim(),
        user_id: (session.user as any).id
      }

      const userInfo = {
        id: (session.user as any).id,
        email: session.user.email!,
        name: session.user.name!,
        isLinkedIn: (session.user as any)?.provider === 'linkedin'
      }

      const response = await fetch('/api/feedbacks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackData,
          userInfo
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '답변 작성 중 오류가 발생했습니다.')
      }

      // 성공 시 폼 초기화 및 피드백 목록 다시 로드
      setAnswerContent('')
      setShowAnswerForm(false)
      await loadFeedbacks()

    } catch (err) {
      console.error('답변 제출 오류:', err)
      alert(err instanceof Error ? err.message : '답변 작성 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (questionId) {
      loadQuestion()
      loadFeedbacks()
    }
  }, [questionId, loadQuestion, loadFeedbacks])

  const getUserDisplayName = (question: Question) => {
    if (question.is_anonymous) {
      return '익명 사용자'
    }
    return getDisplayName((question as any).users?.name || '사용자')
  }

  const getUserProfileInfo = (question: Question) => {
    const user = (question as any).users
    
    // 탈퇴한 사용자인 경우 (타입 안전성을 위해 any로 캐스팅)
    if ((user as any)?.is_deleted === true) {
      return {
        displayName: '탈퇴한 사용자',
        avatarUrl: null,
        isDeleted: true
      }
    }
    
    // 익명 사용자인 경우
    if (question.is_anonymous) {
      return {
        displayName: '익명 사용자',
        avatarUrl: null,
        isDeleted: false
      }
    }
    
    const displayName = getDisplayName(user?.name || '사용자')
    let avatarUrl = user?.image || user?.avatar_url
    
    // LinkedIn 이미지인 경우 proxy 사용
    if (avatarUrl && avatarUrl.includes('linkedin.com')) {
      avatarUrl = `/api/image-proxy?url=${encodeURIComponent(avatarUrl)}`
    }
    
    return {
      displayName,
      avatarUrl,
      isDeleted: false
    }
  }

  const getFeedbackUserProfileInfo = (feedback: FeedbackWithAuthor) => {
    const user = feedback.users
    
    // 탈퇴한 사용자인 경우 (타입 안전성을 위해 any로 캐스팅)
    if ((user as any)?.is_deleted === true) {
      return {
        displayName: '탈퇴한 사용자',
        avatarUrl: null,
        isDeleted: true
      }
    }
    
    const displayName = getDisplayName(user?.name || '익명 사용자')
    let avatarUrl = user?.image || user?.avatar_url
    
    // LinkedIn 이미지인 경우 proxy 사용
    if (avatarUrl && avatarUrl.includes('linkedin.com')) {
      avatarUrl = `/api/image-proxy?url=${encodeURIComponent(avatarUrl)}`
    }
    
    return {
      displayName,
      avatarUrl,
      isDeleted: false
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

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">질문을 찾을 수 없습니다</h3>
          <p className="text-gray-600 mb-6">{error || '요청하신 질문이 존재하지 않습니다.'}</p>
          <Link href="/questions">
            <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors">
              질문 목록으로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/questions" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            뒤로
          </Link>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 질문 카드 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          {/* 질문 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {(() => {
                const profileInfo = getUserProfileInfo(question)
                return (
                  <>
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                      {profileInfo.avatarUrl ? (
                        <img 
                          src={profileInfo.avatarUrl} 
                          alt={profileInfo.displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('❌ [Profile Image] 이미지 로드 실패:', profileInfo.avatarUrl)
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              const fallback = parent.querySelector('.fallback-text')
                              if (fallback) {
                                (fallback as HTMLElement).style.display = 'flex'
                              }
                            }
                          }}
                          onLoad={() => {
                            console.log('✅ [Profile Image] 이미지 로드 성공:', profileInfo.avatarUrl)
                          }}
                        />
                      ) : null}
                      <div 
                        className={`fallback-text w-full h-full ${profileInfo.isDeleted ? 'bg-gray-400' : 'bg-purple-400'} text-white text-sm font-bold flex items-center justify-center ${profileInfo.avatarUrl ? 'hidden' : 'flex'}`}
                        style={{ display: profileInfo.avatarUrl ? 'none' : 'flex' }}
                      >
                        {profileInfo.isDeleted ? '?' : profileInfo.displayName.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {profileInfo.displayName}
                      </p>
                    </div>
                  </>
                )
              })()}
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              {question.category}
            </span>
          </div>

          {/* 질문 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {question.title}
          </h1>

          {/* 질문 내용 */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {question.content}
            </p>
          </div>

          {/* 태그 */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 질문 통계 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                {feedbacks.length} 답변
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {question.views || 0} 조회
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              {formatTimeAgo(question.created_at)}
            </div>
          </div>
        </div>

        {/* 답변 섹션 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">답변</h2>
            <span className="text-sm text-gray-500">{feedbacks.length}개의 답변</span>
          </div>

          {/* 답변 작성 버튼 */}
          {status === 'authenticated' && !showAnswerForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowAnswerForm(true)}
                className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                답변 작성하기
              </button>
            </div>
          )}

          {/* 답변 작성 폼 */}
          {showAnswerForm && (
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">{getDisplayName(session?.user?.name || '사용자')}</span>
              </div>
              
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="도움이 되는 답변을 작성해주세요..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    setShowAnswerForm(false)
                    setAnswerContent('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answerContent.trim() || submitting}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      제출 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      답변 제출
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 로그인하지 않은 경우 */}
          {status === 'unauthenticated' && (
            <div className="mb-6 text-center py-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-gray-600 mb-3">답변을 작성하려면 로그인이 필요합니다.</p>
              <Link href="/auth/login">
                <button className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                  로그인하기
                </button>
              </Link>
            </div>
          )}

          {feedbackLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">답변을 불러오는 중...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            /* 답변이 없을 때 */
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 답변이 없습니다</h3>
              <p className="text-gray-600">
                이 질문에 대한 첫 번째 답변을 작성해보세요!
              </p>
            </div>
          ) : (
            /* 답변 목록 */
            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 relative">
                  {/* 답변 시점 정보 (우측 상단) */}
                  <div className="absolute top-0 right-0 text-xs text-gray-500">
                    {formatTimeAgo(feedback.created_at)}
                  </div>
                  
                  {/* 답변자 정보 */}
                  <div className="flex items-center mb-4">
                    {(() => {
                      const profileInfo = getFeedbackUserProfileInfo(feedback)
                      return (
                        <>
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                            {profileInfo.avatarUrl ? (
                              <img 
                                src={profileInfo.avatarUrl} 
                                alt={profileInfo.displayName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.log('❌ [Feedback Profile Image] 이미지 로드 실패:', profileInfo.avatarUrl)
                                  e.currentTarget.style.display = 'none'
                                  const parent = e.currentTarget.parentElement
                                  if (parent) {
                                    const fallback = parent.querySelector('.fallback-text')
                                    if (fallback) {
                                      (fallback as HTMLElement).style.display = 'flex'
                                    }
                                  }
                                }}
                                onLoad={() => {
                                  console.log('✅ [Feedback Profile Image] 이미지 로드 성공:', profileInfo.avatarUrl)
                                }}
                              />
                            ) : null}
                            <div 
                              className={`fallback-text w-full h-full ${profileInfo.isDeleted ? 'bg-gray-400' : 'bg-purple-400'} text-white text-sm font-bold flex items-center justify-center ${profileInfo.avatarUrl ? 'hidden' : 'flex'}`}
                              style={{ display: profileInfo.avatarUrl ? 'none' : 'flex' }}
                            >
                              {profileInfo.isDeleted ? '?' : profileInfo.displayName.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">
                              {profileInfo.displayName}
                            </p>
                            {feedback.users?.company && feedback.users?.position && (
                              <div className="text-sm text-gray-500">
                                <span>{feedback.users.company} · {feedback.users.position}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </div>

                  {/* 답변 내용 */}
                  <div className="ml-13 prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {feedback.content}
                    </p>
                  </div>

                  {/* 추가 정보 (예시, 조언, 자료 등) */}
                  {(feedback.examples || feedback.advice || feedback.resources) && (
                    <div className="ml-13 mt-4 space-y-3">
                      {feedback.examples && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="font-medium text-blue-900 mb-2">💡 예시</h4>
                          <p className="text-blue-800 text-sm">{feedback.examples}</p>
                        </div>
                      )}
                      
                      {feedback.advice && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="font-medium text-green-900 mb-2">💭 조언</h4>
                          <p className="text-green-800 text-sm">{feedback.advice}</p>
                        </div>
                      )}
                      
                      {feedback.resources && feedback.resources.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <h4 className="font-medium text-yellow-900 mb-2">📚 참고 자료</h4>
                          <ul className="text-yellow-800 text-sm space-y-1">
                            {feedback.resources.map((resource, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{resource}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
