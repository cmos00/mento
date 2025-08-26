'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, MessageCircle, Clock, User, Tag, Share2, Bookmark } from 'lucide-react'
import { getQuestionById, incrementQuestionViews, Question } from '@/lib/questions'
import { mockAuth } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState(mockAuth.getUser())
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const questionId = params.id as string

  const loadQuestion = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await getQuestionById(questionId)
      
      if (error) {
        setError('질문을 불러오는 중 오류가 발생했습니다: ' + error.message)
        return
      }

      if (data) {
        setQuestion(data)
        // 조회수 증가
        incrementQuestionViews(questionId)
      }
    } catch (err) {
      setError('질문을 불러오는 중 예상치 못한 오류가 발생했습니다.')
      console.error('질문 로드 오류:', err)
    } finally {
      setLoading(false)
    }
  }, [questionId])

  useEffect(() => {
    if (questionId) {
      loadQuestion()
    }
  }, [questionId, loadQuestion])

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
    return (question as any).users?.name || '사용자'
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
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getUserDisplayName(question)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(question.created_at)}
                </p>
              </div>
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
                <Eye className="w-4 h-4 mr-2" />
                {question.views || 0} 조회
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                0 답변
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(question.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* 답변 섹션 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">답변</h2>
            <span className="text-sm text-gray-500">0개의 답변</span>
          </div>

          {/* 답변이 없을 때 */}
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 답변이 없습니다</h3>
            <p className="text-gray-600 mb-6">
              이 질문에 대한 답변을 기다리고 있어요.<br />
              멘토들이 곧 도움을 줄 거예요!
            </p>
            {user && (
              <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                답변 작성하기
              </button>
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
