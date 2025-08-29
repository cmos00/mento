'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Plus, ArrowLeft, Send, Target, Tag, FileText, AlertCircle, User } from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'
import { createQuestion } from '@/lib/questions'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function NewQuestionPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { name: "이직", description: "이직 관련 고민" },
    { name: "인간관계", description: "동료, 상사와의 관계" },
    { name: "성과관리", description: "업무 성과와 평가" },
    { name: "기술개발", description: "기술적 성장과 학습" },
    { name: "리더십", description: "팀 관리와 리더십" },
    { name: "워라밸", description: "일과 삶의 균형" },
    { name: "기타", description: "기타 커리어 고민" }
  ]

  const suggestedTags = [
    "개발자", "마케터", "디자이너", "기획자", "PM", "PO", "스타트업", "대기업", "중소기업", "신입", "주니어", "시니어", "팀장", "리더"
  ]

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tag.trim()) {
      setTags([...tags, tag.trim()])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // NextAuth.js를 사용한 실제 데모 로그인
      const result = await signIn('demo-login', {
        email: 'demo@example.com',
        name: '데모 사용자',
        callbackUrl: '/questions/new',
        redirect: false
      })
      
      if (result?.error) {
        console.error('데모 로그인 오류:', result.error)
        setError('데모 로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      } else if (result?.ok) {
        // 로그인 성공 시 페이지 새로고침하여 로그인 상태 반영
        window.location.reload()
      }
    } catch (error) {
      console.error('데모 로그인 오류:', error)
      setError('데모 로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category) {
      setError('제목, 내용, 카테고리를 모두 입력해주세요.')
      return
    }
    if (!session?.user?.id) {
      setError('로그인이 필요합니다.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const questionData = {
        user_id: session.user.id,
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        is_anonymous: false,
        views: 0,
        status: 'active'
      }

      const { data, error } = await createQuestion(questionData, {
        name: session.user.name || '사용자',
        email: session.user.email || 'user@example.com',
        isDemo: (session.user as any).isDemo || false
      })

      if (error) {
        setError('질문 저장 중 오류가 발생했습니다: ' + error.message)
        return
      }

      if (data) {
        router.push('/questions')
      }
    } catch (err) {
      setError('질문 저장 중 예상치 못한 오류가 발생했습니다.')
      console.error('질문 저장 오류:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // 로그인되지 않은 경우
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">질문을 작성하려면 먼저 로그인해주세요.</p>
          
          {/* 데모 로그인 버튼만 */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200 mb-4 text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                로그인 중...
              </>
            ) : (
              <>
                <User className="w-5 h-5 mr-2 inline" />
                데모로 로그인
              </>
            )}
          </button>

          {/* 오류 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <Link href="/questions" className="text-purple-600 hover:text-purple-700">
            질문 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/questions" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">새 질문 작성</h1>
            <p className="text-gray-600">커리어 고민을 솔직하게 나누고 전문가들의 조언을 받아보세요</p>
            {session?.user && (
              <p className="text-sm text-purple-600 mt-2">
                👋 {session.user.name}님, 안녕하세요!
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-gray-700 font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                제목 *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="질문의 핵심을 간단하게 표현해주세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                required
                maxLength={100}
              />
              <div className="text-right text-sm text-gray-500">
                {title.length}/100
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-gray-700 font-medium flex items-center">
                <Target className="w-4 h-4 mr-2" />
                카테고리 *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                required
              >
                <option value="">카테고리를 선택해주세요</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name} - {cat.description}</option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-gray-700 font-medium flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                상세 내용 *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`구체적인 상황을 설명해주세요. 예시:

• 현재 상황과 배경
• 구체적인 문제나 고민
• 이미 시도해본 것들
• 원하는 조언의 방향

더 자세할수록 좋은 답변을 받을 수 있어요!`}
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
                required
                maxLength={2000}
              />
              <div className="text-right text-sm text-gray-500">
                {content.length}/2000
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                태그
              </label>
              <div className="space-y-3">
                {/* Suggested Tags */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">추천 태그:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        disabled={tags.includes(tag)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          tags.includes(tag)
                            ? 'bg-purple-200 text-purple-700 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Tags */}
                {tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">선택된 태그:</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-purple-500 hover:text-purple-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">질문 작성 팁</p>
                  <ul className="space-y-1">
                    <li>• 구체적인 상황과 배경을 설명해주세요</li>
                    <li>• 이미 시도해본 해결책이 있다면 함께 언급해주세요</li>
                    <li>• 원하는 조언의 방향을 명확히 해주세요</li>
                    <li>• 개인정보는 제외하고 익명으로 작성됩니다</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/questions">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    등록 중...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    질문 등록하기
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
