'use client'

import { useState } from 'react'
import Link from 'next/link'

// 임시 저널 데이터
const mockJournalEntries = [
  {
    id: '1',
    title: '프로덕트 매니저 전환을 위한 액션 플랜',
    content: '김성민 멘토님의 피드백을 바탕으로 프로덕트 매니저 전환을 위한 구체적인 액션 플랜을 수립했습니다.',
    feedbackId: 'feedback-1',
    actionItems: [
      '프로덕트 관리 관련 온라인 강의 수강',
      '현재 업무에서 프로덕트 관점으로 접근해보기',
      '사이드 프로젝트로 작은 제품 기획해보기'
    ],
    tags: ['커리어 전환', '프로덕트 관리', '액션 플랜'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: '팀 갈등 해결 방법 정리',
    content: '이지은 멘토님의 조직 갈등 해결 방법에 대한 피드백을 정리했습니다.',
    feedbackId: 'feedback-2',
    actionItems: [
      '1:1 대화를 통한 상대방 입장 이해하기',
      '객관적 데이터로 상황 분석하기',
      'HR팀과의 상담 고려하기'
    ],
    tags: ['인간관계', '갈등 해결', '커뮤니케이션'],
    createdAt: '2024-01-10'
  }
]

export default function JournalPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const allTags = Array.from(new Set(mockJournalEntries.flatMap(entry => entry.tags)))

  const filteredEntries = mockJournalEntries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => entry.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            커리어 저널
          </h1>
          <p className="text-lg text-gray-600">
            받은 피드백과 멘토링 기록을 체계적으로 저장하고 후속 액션을 관리하여 커리어 성장을 추적하세요.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <input
                type="text"
                placeholder="제목이나 내용으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그 필터
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 저널 목록 */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {entry.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {entry.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{entry.createdAt}</span>
                    {entry.feedbackId && (
                      <Link
                        href={`/feedback/${entry.feedbackId}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        관련 피드백 보기
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">액션 아이템</h4>
                <ul className="space-y-2">
                  {entry.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="btn-primary">
                  액션 아이템 추가
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">
              아직 저널 항목이 없습니다
            </p>
            <p className="text-gray-400 text-sm">
              질문을 작성하고 피드백을 받아보세요.
            </p>
            <Link href="/questions" className="btn-primary mt-4 inline-block">
              질문하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
