'use client'

import { useState } from 'react'
import Link from 'next/link'

// 임시 멘토 데이터 (실제로는 API에서 가져올 예정)
const mockMentors = [
  {
    id: '1',
    name: '김성민',
    company: '네이버',
    position: '시니어 프로덕트 매니저',
    experience: 8,
    specialties: ['프로덕트 관리', '팀 리더십', '스타트업 성장'],
    rating: 4.8,
    totalFeedback: 127,
    isVerified: true,
    bio: '8년간 다양한 IT 제품을 성공적으로 런칭하고 팀을 이끌어온 경험이 있습니다. 특히 초기 스타트업에서의 제품 전략과 팀 빌딩에 전문성을 가지고 있습니다.',
    hourlyRate: 50000
  },
  {
    id: '2',
    name: '이지은',
    company: '쿠팡',
    position: '데이터 사이언티스트',
    experience: 6,
    specialties: ['데이터 분석', '머신러닝', '비즈니스 인사이트'],
    rating: 4.9,
    totalFeedback: 89,
    isVerified: true,
    bio: '6년간 전자상거래와 핀테크 분야에서 데이터 기반 의사결정을 지원해왔습니다. 데이터로부터 의미있는 인사이트를 도출하고 비즈니스 가치를 창출하는 것에 열정을 가지고 있습니다.',
    hourlyRate: 45000
  },
  {
    id: '3',
    name: '박준호',
    company: '토스',
    position: '엔지니어링 매니저',
    experience: 7,
    specialties: ['소프트웨어 아키텍처', '팀 관리', '기술 전략'],
    rating: 4.7,
    totalFeedback: 156,
    isVerified: true,
    bio: '7년간 대규모 시스템을 설계하고 개발팀을 관리해왔습니다. 마이크로서비스 아키텍처와 클라우드 네이티브 개발에 대한 깊은 이해를 바탕으로 기술적 의사결정을 지원합니다.',
    hourlyRate: 55000
  },
  {
    id: '4',
    name: '최수진',
    company: '당근마켓',
    position: '마케팅 디렉터',
    experience: 9,
    specialties: ['브랜드 마케팅', '성장 마케팅', '콘텐츠 전략'],
    rating: 4.6,
    totalFeedback: 203,
    isVerified: true,
    bio: '9년간 다양한 브랜드의 마케팅 전략을 수립하고 실행해왔습니다. 특히 디지털 마케팅과 콘텐츠 마케팅을 통한 브랜드 성장에 전문성을 가지고 있습니다.',
    hourlyRate: 60000
  }
]

export default function MentorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'totalFeedback'>('rating')

  const specialties = Array.from(new Set(mockMentors.flatMap(mentor => mentor.specialties)))

  const filteredMentors = mockMentors
    .filter(mentor => 
      (!selectedSpecialty || mentor.specialties.includes(selectedSpecialty)) &&
      (!searchQuery || 
        mentor.name.includes(searchQuery) || 
        mentor.company.includes(searchQuery) || 
        mentor.position.includes(searchQuery))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return b.experience - a.experience
        case 'totalFeedback':
          return b.totalFeedback - a.totalFeedback
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            멘토 찾기
          </h1>
          <p className="text-lg text-gray-600">
            AI 기반 추천 시스템으로 직무 유사도와 경험을 고려한 최적의 멘토를 찾아보세요.
          </p>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전문 분야
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">전체</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <input
                type="text"
                placeholder="이름, 회사, 직무로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬 기준
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">평점순</option>
                <option value="experience">경력순</option>
                <option value="totalFeedback">피드백 수순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 멘토 목록 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="card">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary-600">
                    {mentor.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mentor.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {mentor.position} @ {mentor.company}
                  </p>
                  <p className="text-sm text-gray-500">
                    경력 {mentor.experience}년
                  </p>
                </div>
                {mentor.isVerified && (
                  <div className="text-primary-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(mentor.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {mentor.rating} ({mentor.totalFeedback}개 피드백)
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">전문 분야</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {mentor.bio}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary-600">
                  {mentor.hourlyRate?.toLocaleString()}원/시간
                </span>
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="btn-primary"
                >
                  상세보기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              조건에 맞는 멘토를 찾을 수 없습니다.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              검색 조건을 변경해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
