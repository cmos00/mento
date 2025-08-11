'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// 임시 질문 데이터 (실제로는 API에서 가져올 예정)
const mockQuestions = [
  {
    id: '1',
    title: '프로덕트 매니저로 전환하고 싶은데 어떻게 준비해야 할까요?',
    content: '현재 IT 회사에서 5년간 개발자로 일하고 있는데, 프로덕트 매니저로 전환하고 싶습니다. 어떤 준비가 필요한지 조언 부탁드립니다.',
    category: '커리어 전환',
    author: {
      name: '김개발',
      company: '테크스타트업',
      isAnonymous: true
    },
    answers: 3,
    views: 127,
    createdAt: '2시간 전',
    tags: ['프로덕트 매니저', '커리어 전환', 'IT']
  },
  {
    id: '2',
    title: '팀 내 갈등 상황에서 어떻게 대처해야 할까요?',
    content: '동료가 제 아이디어를 계속 무시하고 다른 방향으로 진행하려고 합니다. 이런 상황에서 어떻게 대처해야 할지 고민입니다.',
    category: '직장 갈등',
    author: {
      name: '이마케터',
      company: '대기업',
      isAnonymous: true
    },
    answers: 5,
    views: 89,
    createdAt: '5시간 전',
    tags: ['팀 갈등', '인간관계', '커뮤니케이션']
  },
  {
    id: '3',
    title: '업무 효율성을 높이는 방법이 있을까요?',
    content: '업무량이 많아 시간 관리가 어렵고, 중요한 업무에 집중하기 어렵습니다. 효율성을 높이는 방법을 알려주세요.',
    category: '성과 관리',
    author: {
      name: '박매니저',
      company: '중소기업',
      isAnonymous: false
    },
    answers: 2,
    views: 156,
    createdAt: '1일 전',
    tags: ['업무 효율성', '시간 관리', '성과 향상']
  }
]

export default function QuestionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')

  const categories = ['전체', '커리어 전환', '직장 갈등', '성과 관리', '스킬 개발']

  const filteredQuestions = selectedCategory === '전체' 
    ? mockQuestions 
    : mockQuestions.filter(q => q.category === selectedCategory)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">질문 목록</h1>
          <div className="flex items-center space-x-3">
            <button className="text-primary-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-primary-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mobile-content">
        {/* 카테고리 필터 */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 질문 목록 */}
        <div className="px-4 py-4 space-y-3">
          {filteredQuestions.map((question) => (
            <Link
              key={question.id}
              href={`/questions/${question.id}`}
              className="block"
            >
              <div className="card hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {question.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {question.createdAt}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {question.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {question.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{question.answers}개 답변</span>
                        <span>{question.views}회 조회</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {question.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 질문 등록 FAB */}
      <Link href="/questions/new" className="mobile-fab">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      {/* 하단 네비게이션 */}
      <div className="mobile-bottom-nav">
        <div className="flex items-center justify-around">
          <Link href="/questions" className="flex flex-col items-center space-y-1 text-primary-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-medium">질문</span>
          </Link>
          <Link href="/mentors" className="flex flex-col items-center space-y-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium">멘토</span>
          </Link>
          <Link href="/journal" className="flex flex-col items-center space-y-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-medium">저널</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">프로필</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
