'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const questionCategories = [
  {
    id: 'career-transition',
    title: '커리어 전환',
    description: '현재 직장에서 새로운 기회로의 전환을 고려하고 있습니다.',
    icon: '🔄',
    examples: [
      '프로덕트 매니저로 전환하고 싶습니다',
      'IT 업계로 전환하고 싶습니다',
      '스타트업에서 대기업으로 전환하고 싶습니다'
    ]
  },
  {
    id: 'workplace-conflict',
    title: '직장 갈등',
    description: '직장에서 동료나 상사와의 관계에서 어려움을 겪고 있습니다.',
    icon: '😤',
    examples: [
      '동료와의 아이디어 충돌',
      '상사와의 소통 문제',
      '팀 내 갈등 상황'
    ]
  },
  {
    id: 'performance-management',
    title: '성과 관리',
    description: '업무 성과 향상과 효율적인 업무 관리를 위한 조언이 필요합니다.',
    icon: '📊',
    examples: [
      '업무 효율성 향상',
      '성과 평가 개선',
      '시간 관리 방법'
    ]
  },
  {
    id: 'skill-development',
    title: '스킬 개발',
    description: '새로운 스킬을 배우거나 기존 스킬을 향상시키고 싶습니다.',
    icon: '🎯',
    examples: [
      '프로그래밍 스킬 향상',
      '리더십 스킬 개발',
      '데이터 분석 능력 향상'
    ]
  }
]

export default function NewQuestionPage() {
  const router = useRouter()
  const [step, setStep] = useState<'category' | 'content'>('category')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isAnonymous: true,
    tags: []
  })

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setStep('content')
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 질문 제출 로직 구현
    console.log('Question data:', { category: selectedCategory, ...formData })
    router.push('/questions')
  }

  if (step === 'category') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="mobile-header">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">질문 등록</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mobile-content">
          <div className="px-4 py-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                어떤 고민이 있으신가요?
              </h2>
              <p className="text-gray-600">
                상황에 맞는 카테고리를 선택해주세요
              </p>
            </div>

            <div className="space-y-4">
              {questionCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="w-full text-left card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description}
                      </p>
                      <div className="space-y-1">
                        {category.examples.map((example, index) => (
                          <p key={index} className="text-xs text-gray-500">
                            • {example}
                          </p>
                        ))}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep('category')}
            className="text-primary-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">질문 작성</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mobile-content">
        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">
                {questionCategories.find(c => c.id === selectedCategory)?.icon}
              </span>
              <span className="text-sm text-gray-500">
                {questionCategories.find(c => c.id === selectedCategory)?.title}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문 제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="구체적이고 명확한 제목을 작성해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 내용 *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="구체적인 상황과 맥락을 설명해주세요. 멘토가 더 정확한 조언을 드릴 수 있도록 도움이 됩니다."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관련 태그
              </label>
              <input
                type="text"
                placeholder="쉼표로 구분하여 입력 (예: 커리어, 전환, IT)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                익명으로 질문하기
              </label>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="btn-primary w-full"
              >
                질문 등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
