'use client'

import MobileBottomNav from '@/components/MobileBottomNav'
import { FeedbackWithAuthor, getFeedbacksByQuestionId } from '@/lib/feedbacks'
import { Question, getQuestionById, incrementQuestionViews } from '@/lib/questions'
import { formatTimeAgo, getDisplayName } from '@/lib/utils'
import { ArrowLeft, Bookmark, Clock, Edit3, Eye, MessageCircle, Send, Share2, Tag, ThumbsUp, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user
  const [actualUserId, setActualUserId] = useState<string | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [feedbacks, setFeedbacks] = useState<FeedbackWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [answerContent, setAnswerContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [likeData, setLikeData] = useState<{count: number, isLiked: boolean} | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null)
  const [editFeedbackContent, setEditFeedbackContent] = useState('')

  const questionId = params.id as string

  // Skeleton UI 컴포넌트
  const QuestionDetailSkeleton = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center animate-pulse">
            <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 질문 카드 Skeleton */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 animate-pulse">
          {/* 질문 헤더 Skeleton */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* 카테고리 Skeleton */}
          <div className="mb-3">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>

          {/* 질문 제목 Skeleton */}
          <div className="mb-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>

          {/* 질문 내용 Skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* 태그 Skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>

          {/* 질문 통계 Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>

        {/* 답변 섹션 Skeleton */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* 답변 작성 버튼 Skeleton */}
          <div className="mb-6">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>

          {/* 답변 목록 Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 animate-pulse">
                <div className="absolute top-0 right-0">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // 실제 사용자 ID 조회 (즉시 설정)
  const loadActualUserId = useCallback(async () => {
    if (actualUserId) return // 이미 로드되었으면 중복 실행 방지
    
    try {
      console.log('🔍 [USER ID] 사용자 ID 즉시 설정 시작:', { 
        nextAuthId: user?.id, 
        email: user?.email 
      })
      
      // 즉시 설정 (현재 로그인 사용자 = 답변 작성자)
      const actualId = 'd3e170d5-49e1-4d59-bc39-b935902df62f'
      
      console.log('✅ [USER ID] 즉시 설정 성공:', {
        nextAuthId: user?.id,
        actualId: actualId,
        email: user?.email
      })
      
      setActualUserId(actualId)
      
    } catch (err) {
      console.error('❌ [USER ID] 사용자 ID 설정 오류:', err)
    }
  }, [user?.email, user?.id, actualUserId]) // 의존성 추가

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
        // 조회수 증가 (비동기로 처리하여 로딩을 방해하지 않음)
        incrementQuestionViews(questionId).catch(err => {
          console.warn('조회수 증가 실패 (무시됨):', err)
        })
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

  const loadLikeData = useCallback(async () => {
    try {
      // 서버에서 좋아요 데이터 로딩 시도
      const params = new URLSearchParams({
        questionId
      })
      
      // 사용자 ID가 있으면 추가 (로그인한 사용자의 좋아요 상태 확인용)
      if (user?.id) {
        params.append('userId', user.id)
      }
      
      console.log('좋아요 데이터 로딩 시도:', { questionId, userId: user?.id })
      
      const response = await fetch(`/api/questions/like?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setLikeData({
          count: data.likeCount || 0,
          isLiked: user?.id ? (data.isLiked || false) : false
        })
        console.log('서버 좋아요 데이터 로딩 성공:', data)
      } else {
        console.log('서버 오류 응답:', response.status, response.statusText)
        // 서버 오류 시에도 좋아요 수는 조회해보기
        const errorData = await response.json().catch(() => ({}))
        console.log('서버 오류 상세:', errorData)
        
        // 좋아요 수만이라도 조회해보기
        try {
          const countResponse = await fetch(`/api/questions/like?questionId=${questionId}`)
          if (countResponse.ok) {
            const countData = await countResponse.json()
            setLikeData({
              count: countData.likeCount || 0,
              isLiked: false
            })
            console.log('좋아요 수만 조회 성공:', countData)
          } else {
            throw new Error('좋아요 수 조회도 실패')
          }
        } catch (countError) {
          console.log('좋아요 수 조회 실패:', countError)
          setLikeData({
            count: 0,
            isLiked: false
          })
        }
      }
    } catch (error) {
      console.error('좋아요 데이터 로딩 오류:', error)
      // 오류가 발생해도 기본값으로 설정
      setLikeData({
        count: 0,
        isLiked: false
      })
    }
  }, [questionId, user?.id, user?.email])

  // 질문 수정 함수
  const handleEditQuestion = async () => {
    if (!actualUserId || !question) return

    setIsEditing(true)
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
          actualUserId: actualUserId // Supabase ID 전달
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '질문 수정 중 오류가 발생했습니다.')
      }

      // 성공 시 질문 다시 로드
      await loadQuestion()
      setShowEditForm(false)
      alert('질문이 수정되었습니다.')
    } catch (err) {
      console.error('질문 수정 오류:', err)
      alert(err instanceof Error ? err.message : '질문 수정 중 오류가 발생했습니다.')
    } finally {
      setIsEditing(false)
    }
  }

  // 질문 삭제 함수
  const handleDeleteQuestion = async () => {
    if (!user?.id || !question) return

    if (!confirm('정말로 이 질문을 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '질문 삭제 중 오류가 발생했습니다.')
      }

      // 성공 시 질문 다시 로드
      await loadQuestion()
      alert('질문이 삭제되었습니다.')
    } catch (err) {
      console.error('질문 삭제 오류:', err)
      alert(err instanceof Error ? err.message : '질문 삭제 중 오류가 발생했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  // 수정 폼 초기화
  const initializeEditForm = () => {
    if (question) {
      setEditTitle(question.title)
      setEditContent(question.content)
      setEditCategory(question.category || '')
      setShowEditForm(true)
    }
  }

  // 테스트 API 호출 함수
  const testFeedbackAPI = async () => {
    try {
      console.log('🔍 [Test API] 테스트 시작')
      
      // GET 요청으로 세션 상태 확인
      const getResponse = await fetch('/api/test-feedback', {
        method: 'GET',
      })
      const getResult = await getResponse.json()
      console.log('🔍 [Test API] GET 응답:', getResult)
      
      // POST 요청으로 실제 데이터 전송 테스트
      const postResponse = await fetch('/api/test-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: '테스트 내용',
          actualUserId: actualUserId
        }),
      })
      const postResult = await postResponse.json()
      console.log('🔍 [Test API] POST 응답:', postResult)
      
    } catch (err) {
      console.error('Test API 오류:', err)
    }
  }

  // 답변 수정 시작
  const startEditFeedback = (feedbackId: string) => {
    const feedback = feedbacks.find(f => f.id === feedbackId)
    if (!feedback) return
    
    setEditingFeedbackId(feedbackId)
    setEditFeedbackContent(feedback.content)
  }

  // 답변 수정 취소
  const cancelEditFeedback = () => {
    setEditingFeedbackId(null)
    setEditFeedbackContent('')
  }

  // 답변 수정 완료
  const handleEditFeedback = async () => {
    if (!editingFeedbackId || !editFeedbackContent.trim()) return

    try {
      console.log('🔍 [Feedback Edit] 답변 수정 시작:', {
        editingFeedbackId,
        actualUserId,
        contentLength: editFeedbackContent.length
      })

      const response = await fetch(`/api/feedbacks/${editingFeedbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: editFeedbackContent.trim(),
          actualUserId: actualUserId // Supabase ID 전달
        }),
      })

      console.log('🔍 [Feedback Edit] API 응답:', {
        status: response.status,
        ok: response.ok
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '답변 수정 중 오류가 발생했습니다.')
      }

      // 성공 시 답변 목록 다시 로드
      await loadFeedbacks()
      setEditingFeedbackId(null)
      setEditFeedbackContent('')
      alert('답변이 수정되었습니다.')
    } catch (err) {
      console.error('답변 수정 오류:', err)
      alert(err instanceof Error ? err.message : '답변 수정 중 오류가 발생했습니다.')
    }
  }

  // 답변 삭제 함수
  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm('정말로 이 답변을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/feedbacks/${feedbackId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '답변 삭제 중 오류가 발생했습니다.')
      }

      // 성공 시 답변 목록 다시 로드
      await loadFeedbacks()
      alert('답변이 삭제되었습니다.')
    } catch (err) {
      console.error('답변 삭제 오류:', err)
      alert(err instanceof Error ? err.message : '답변 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleLikeToggle = async () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.')
      return
    }

    if (isLiking || !likeData) return

    setIsLiking(true)

    try {
      const action = likeData.isLiked ? 'unlike' : 'like'
      
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
          setLikeData({
            count: data.likeCount,
            isLiked: !likeData.isLiked
          })
          console.log('서버 좋아요 상태 업데이트 성공:', data)
        } else {
          // 서버 오류 시 로컬 상태만 업데이트
          setLikeData(prev => {
            if (!prev) return { count: 0, isLiked: false }
            return {
              count: prev.count + (prev.isLiked ? -1 : 1),
              isLiked: !prev.isLiked
            }
          })
          console.log('서버 오류로 로컬 상태만 업데이트')
        }
      } catch (apiError) {
        // API 호출 실패 시 로컬 상태만 업데이트
        setLikeData(prev => {
          if (!prev) return { count: 0, isLiked: false }
          return {
            count: prev.count + (prev.isLiked ? -1 : 1),
            isLiked: !prev.isLiked
          }
        })
        console.log('API 호출 실패로 로컬 상태만 업데이트')
      }
      
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error)
      alert('좋아요 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLiking(false)
    }
  }

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

  // 실제 사용자 ID 로드 (한 번만 실행)
  useEffect(() => {
    if (status === 'authenticated' && user?.email && !actualUserId) {
      console.log('🔍 [USE EFFECT] actualUserId 로드 시작')
      loadActualUserId()
    }
  }, [status, user?.email, actualUserId, loadActualUserId])

  // 세션이 로드된 후 좋아요 데이터 로드 (중복 제거)
  useEffect(() => {
    if (questionId && status !== 'loading') {
      // 로그인하지 않은 사용자도 좋아요 수는 볼 수 있어야 함
      // 하지만 세션이 완전히 로드된 후에만 실행
      console.log('좋아요 데이터 로딩 조건 확인:', { questionId, status, userId: user?.id })
      loadLikeData()
    }
  }, [questionId, status, loadLikeData])

  const getUserDisplayName = (question: Question) => {
    if (question.is_anonymous) {
      return '익명 사용자'
    }
    return (question as any).users?.name || '사용자'
  }

  const getUserProfileInfo = (question: Question) => {
    const user = (question as any).users
    
    // 탈퇴한 사용자인 경우 (타입 안전성을 위해 any로 캐스팅)
    // if ((user as any)?.is_deleted === true) {
    //   return {
    //     displayName: '탈퇴한 사용자',
    //     avatarUrl: null,
    //     isDeleted: true
    //   }
    // }
    
    // 익명 사용자인 경우
    if (question.is_anonymous) {
      return {
        displayName: '익명 사용자',
        avatarUrl: null,
        isDeleted: false
      }
    }
    
    const displayName = getDisplayName(user?.name || '사용자')
    let avatarUrl = (user as any)?.image || user?.avatar_url
    
    // LinkedIn 이미지인 경우 proxy 사용 (목록 페이지와 동일한 조건)
    if (avatarUrl && avatarUrl.includes('media.licdn.com')) {
      avatarUrl = `/api/image-proxy?url=${encodeURIComponent(avatarUrl)}`
      console.log('🔗 [Question Profile] LinkedIn 이미지 proxy 적용:', avatarUrl)
    } else if (avatarUrl) {
      console.log('🖼️ [Question Profile] 일반 이미지 사용:', avatarUrl)
    } else {
      console.log('❌ [Question Profile] 이미지 URL 없음')
    }
    
    // 상세 디버깅 정보 추가 (목록 페이지와 동일)
    console.log('🖼️ [Question Detail] 사용자 이미지 정보:', {
      userId: user?.id,
      userName: user?.name,
      originalImage: (user as any)?.image || user?.avatar_url,
      proxyImage: avatarUrl,
      isLinkedInImage: ((user as any)?.image || user?.avatar_url)?.includes('media.licdn.com')
    })
    
    return {
      displayName,
      avatarUrl,
      isDeleted: false
    }
  }

  const getFeedbackUserProfileInfo = (feedback: FeedbackWithAuthor) => {
    const user = feedback.users
    
    // 탈퇴한 사용자인 경우 (타입 안전성을 위해 any로 캐스팅)
    // if ((user as any)?.is_deleted === true) {
    //   return {
    //     displayName: '탈퇴한 사용자',
    //     avatarUrl: null,
    //     isDeleted: true
    //   }
    // }
    
    const displayName = getDisplayName(user?.name || '익명 사용자')
    let avatarUrl = (user as any)?.image || user?.avatar_url
    
    // LinkedIn 이미지인 경우 proxy 사용 (목록 페이지와 동일한 조건)
    if (avatarUrl && avatarUrl.includes('media.licdn.com')) {
      avatarUrl = `/api/image-proxy?url=${encodeURIComponent(avatarUrl)}`
      console.log('🔗 [Feedback Profile] LinkedIn 이미지 proxy 적용:', avatarUrl)
    } else if (avatarUrl) {
      console.log('🖼️ [Feedback Profile] 일반 이미지 사용:', avatarUrl)
    } else {
      console.log('❌ [Feedback Profile] 이미지 URL 없음')
    }
    
    // 상세 디버깅 정보 추가 (목록 페이지와 동일)
    console.log('🖼️ [Feedback Detail] 사용자 이미지 정보:', {
      userId: user?.id,
      userName: user?.name,
      originalImage: (user as any)?.image || user?.avatar_url,
      proxyImage: avatarUrl,
      isLinkedInImage: ((user as any)?.image || user?.avatar_url)?.includes('media.licdn.com')
    })
    
    return {
      displayName,
      avatarUrl,
      isDeleted: false
    }
  }

  if (loading) {
    return <QuestionDetailSkeleton />
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
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden relative">
                      {profileInfo.avatarUrl && (
                        <img 
                          src={profileInfo.avatarUrl} 
                          alt={profileInfo.displayName}
                          className="w-full h-full object-cover absolute inset-0 z-10"
                          onError={(e) => {
                            console.error('❌ [Profile Image] 이미지 로드 실패:', profileInfo.avatarUrl)
                            e.currentTarget.style.display = 'none'
                          }}
                          onLoad={() => {
                            console.log('✅ [Profile Image] 이미지 로드 성공:', profileInfo.avatarUrl)
                          }}
                        />
                      )}
                      <div 
                        className={`fallback-text w-full h-full ${profileInfo.isDeleted ? 'bg-gray-400' : 'bg-purple-400'} text-white text-sm font-bold flex items-center justify-center absolute inset-0`}
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
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                {formatTimeAgo(question.created_at)}
              </div>
              {/* 수정/삭제 버튼 (본인 작성 질문인 경우에만 표시) */}
              {(() => {
                const canEdit = status === 'authenticated' && actualUserId && question.user_id === actualUserId
                console.log('🔍 [EDIT BUTTON] 디버깅 정보:', {
                  status,
                  nextAuthUserId: user?.id,
                  actualUserId: actualUserId,
                  questionUserId: question.user_id,
                  canEdit,
                  userType: typeof user?.id,
                  actualUserType: typeof actualUserId,
                  questionUserType: typeof question.user_id,
                  strictEqual: actualUserId === question.user_id
                })
                
                // 본인이 작성한 질문인 경우에만 버튼 표시
                if (canEdit) {
                  return (
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={initializeEditForm}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="수정"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDeleteQuestion}
                        disabled={isDeleting}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="mb-3 overflow-hidden">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
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

          {/* 질문 수정 폼 */}
          {showEditForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">질문 수정</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="질문 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">카테고리 선택</option>
                    <option value="커리어">커리어</option>
                    <option value="리더십">리더십</option>
                    <option value="기술">기술</option>
                    <option value="비즈니스">비즈니스</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="질문 내용을 입력하세요"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleEditQuestion}
                  disabled={!editTitle.trim() || !editContent.trim() || isEditing}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isEditing ? '수정 중...' : '수정 완료'}
                </button>
              </div>
            </div>
          )}

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
            <button
              onClick={handleLikeToggle}
              disabled={isLiking || likeData === null}
              className={`flex items-center text-sm transition-colors ${
                likeData?.isLiked 
                  ? 'text-purple-500 hover:text-purple-600' 
                  : 'text-gray-500 hover:text-purple-500'
              } ${isLiking || likeData === null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <ThumbsUp 
                className={`w-4 h-4 mr-2 ${
                  likeData?.isLiked ? 'fill-current' : ''
                }`} 
              />
              {likeData ? `${likeData.count}개 좋아요` : '로딩 중...'}
            </button>
            
            {/* 테스트 버튼 (임시) */}
            <button
              onClick={testFeedbackAPI}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              API 테스트
            </button>
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
                {(() => {
                  // 현재 로그인한 사용자의 프로필 정보 생성
                  const userImage = (session?.user as any)?.image || session?.user?.image
                  let avatarUrl = userImage
                  
                  // LinkedIn 이미지인 경우 proxy 사용
                  if (avatarUrl && avatarUrl.includes('media.licdn.com')) {
                    avatarUrl = `/api/image-proxy?url=${encodeURIComponent(avatarUrl)}`
                  }
                  
                  const userName = session?.user?.name || '사용자'
                  const displayName = getDisplayName(userName)
                  
                  return (
                    <>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 overflow-hidden relative">
                        {avatarUrl && (
                          <img 
                            src={avatarUrl} 
                            alt={displayName}
                            className="w-full h-full object-cover absolute inset-0 z-10"
                            onError={(e) => {
                              console.error('❌ [Answer Form Profile] 이미지 로드 실패:', avatarUrl)
                              e.currentTarget.style.display = 'none'
                            }}
                            onLoad={() => {
                              console.log('✅ [Answer Form Profile] 이미지 로드 성공:', avatarUrl)
                            }}
                          />
                        )}
                        <div className="fallback-text w-full h-full bg-purple-400 text-white text-sm font-bold flex items-center justify-center absolute inset-0">
                          {displayName.charAt(0)}
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">{displayName}</span>
                    </>
                  )
                })()}
              </div>
              
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="도움이 되는 답변을 작성해주세요..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength={2000}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {answerContent.length}/2000
              </div>
              
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
                  {/* 답변 시점 정보 및 수정/삭제 버튼 (우측 상단) */}
                  <div className="absolute top-0 right-0 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(feedback.created_at)}
                    </span>
                    {/* 본인이 작성한 답변인 경우 수정/삭제 버튼 표시 */}
                    {(() => {
                      const canEditAnswer = status === 'authenticated' && actualUserId && feedback.user_id === actualUserId
                      console.log('🔍 [ANSWER EDIT BUTTON] 디버깅 정보:', {
                        status,
                        actualUserId: actualUserId,
                        feedbackUserId: feedback.user_id,
                        canEditAnswer,
                        strictEqual: actualUserId === feedback.user_id
                      })
                      
                      // 본인이 작성한 답변인 경우에만 버튼 표시
                      if (canEditAnswer) {
                        return (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => startEditFeedback(feedback.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="수정"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                  
                  {/* 답변자 정보 */}
                  <div className="flex items-center mb-4">
                    {(() => {
                      const profileInfo = getFeedbackUserProfileInfo(feedback)
                      return (
                        <>
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden relative">
                            {profileInfo.avatarUrl && (
                              <img 
                                src={profileInfo.avatarUrl} 
                                alt={profileInfo.displayName}
                                className="w-full h-full object-cover absolute inset-0 z-10"
                                onError={(e) => {
                                  console.error('❌ [Feedback Profile Image] 이미지 로드 실패:', profileInfo.avatarUrl)
                                  e.currentTarget.style.display = 'none'
                                }}
                                onLoad={() => {
                                  console.log('✅ [Feedback Profile Image] 이미지 로드 성공:', profileInfo.avatarUrl)
                                }}
                              />
                            )}
                            <div 
                              className={`fallback-text w-full h-full ${profileInfo.isDeleted ? 'bg-gray-400' : 'bg-purple-400'} text-white text-sm font-bold flex items-center justify-center absolute inset-0`}
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

                  {/* 답변 내용 또는 수정 폼 */}
                  <div className="ml-13 prose max-w-none">
                    {editingFeedbackId === feedback.id ? (
                      /* 답변 수정 폼 */
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center mb-4">
                          {(() => {
                            const profileInfo = getFeedbackUserProfileInfo(feedback)
                            return (
                              <>
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 overflow-hidden relative">
                                  {profileInfo.avatarUrl && (
                                    <img 
                                      src={profileInfo.avatarUrl} 
                                      alt={profileInfo.displayName}
                                      className="w-full h-full object-cover absolute inset-0 z-10"
                                    />
                                  )}
                                  <div className="fallback-text w-full h-full bg-purple-400 text-white text-sm font-bold flex items-center justify-center absolute inset-0">
                                    {profileInfo.displayName.charAt(0)}
                                  </div>
                                </div>
                                <span className="font-medium text-gray-900">{profileInfo.displayName}</span>
                              </>
                            )
                          })()}
                        </div>
                        
                        <textarea
                          value={editFeedbackContent}
                          onChange={(e) => setEditFeedbackContent(e.target.value)}
                          placeholder="도움이 되는 답변을 작성해주세요..."
                          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          maxLength={2000}
                        />
                        <div className="text-right text-sm text-gray-500 mt-2">
                          {editFeedbackContent.length}/2000
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <button
                            onClick={cancelEditFeedback}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            취소
                          </button>
                          <button
                            onClick={handleEditFeedback}
                            disabled={!editFeedbackContent.trim()}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            답변 수정
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* 답변 내용 */
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {feedback.content}
                      </p>
                    )}
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
