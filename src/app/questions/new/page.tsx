"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Plus, ArrowLeft, Send, Target, Tag, FileText, AlertCircle } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function NewQuestionPage() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    
    // TODO: 실제 API 호출 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    setIsSubmitting(false)
    router.push('/questions')
  }

  if (!mockUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="태그를 입력하고 Enter를 누르세요"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Suggested Tags */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">추천 태그:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addSuggestedTag(tag)}
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
