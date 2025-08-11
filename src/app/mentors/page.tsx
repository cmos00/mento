'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Star, MessageCircle, MapPin } from 'lucide-react'

interface Mentor {
  id: number
  name: string
  company: string
  jobTitle: string
  experience: string
  specialties: string[]
  rating: number
  reviewCount: number
  location: string
  isAvailable: boolean
}

const mockMentors: Mentor[] = [
  {
    id: 1,
    name: "김멘토",
    company: "테크컴퍼니",
    jobTitle: "시니어 개발자",
    experience: "8년",
    specialties: ["웹개발", "팀리드", "아키텍처"],
    rating: 4.8,
    reviewCount: 24,
    location: "서울",
    isAvailable: true
  },
  {
    id: 2,
    name: "이멘토",
    company: "스타트업",
    jobTitle: "프로덕트 매니저",
    experience: "6년",
    specialties: ["제품기획", "사용자경험", "데이터분석"],
    rating: 4.6,
    reviewCount: 18,
    location: "부산",
    isAvailable: true
  },
  {
    id: 3,
    name: "박멘토",
    company: "대기업",
    jobTitle: "엔지니어링 매니저",
    experience: "10년",
    specialties: ["프로젝트관리", "인사관리", "기술전략"],
    rating: 4.9,
    reviewCount: 32,
    location: "서울",
    isAvailable: false
  }
]

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('전체')

  const specialties = ['전체', '웹개발', '팀리드', '아키텍처', '제품기획', '사용자경험', '데이터분석', '프로젝트관리', '인사관리', '기술전략']

  const filteredMentors = mockMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialty === '전체' || mentor.specialties.includes(selectedSpecialty)
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">멘토 찾기</h1>
          <button className="text-[#6A5ACD]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mobile-content">
        {/* 검색 및 필터 */}
        <div className="space-y-4 mb-6">
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="멘토를 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent"
            />
          </div>

          {/* 전문 분야 필터 */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSpecialty === specialty
                    ? 'bg-[#6A5ACD] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* 멘토 목록 */}
        <div className="space-y-4">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="card">
              <div className="space-y-3">
                {/* 멘토 헤더 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Link href={`/mentors/${mentor.id}`} className="hover:text-[#6A5ACD] transition-colors">
                        {mentor.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {mentor.jobTitle} • {mentor.company}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{mentor.location}</span>
                      </span>
                      <span>{mentor.experience} 경력</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({mentor.reviewCount}개 리뷰)</span>
                  </div>
                </div>

                {/* 전문 분야 */}
                <div className="flex flex-wrap gap-2">
                  {mentor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-[#F5F5DC] text-[#6A5ACD] text-xs rounded-md"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* 액션 버튼 */}
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      mentor.isAvailable
                        ? 'bg-[#6A5ACD] text-white hover:bg-[#5A4ABD]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!mentor.isAvailable}
                  >
                    {mentor.isAvailable ? '멘토링 신청' : '일시적 불가'}
                  </button>
                  <button className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 멘토가 없을 때 */}
        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">멘토를 찾을 수 없습니다</h3>
            <p className="text-gray-600">다른 검색어나 전문 분야를 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="mobile-bottom-nav">
        <div className="flex justify-around">
          <Link href="/questions" className="flex flex-col items-center py-2 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs">질문</span>
          </Link>
          <Link href="/mentors" className="flex flex-col items-center py-2 text-[#6A5ACD]">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">멘토</span>
          </Link>
          <Link href="/journal" className="flex flex-col items-center py-2 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">저널</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">프로필</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
