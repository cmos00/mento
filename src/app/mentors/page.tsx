"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Star, MessageCircle, Award, Briefcase, Filter, Search, Users, TrendingUp, Clock } from 'lucide-react'
import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'

interface Mentor {
  id: number
  name: string
  title: string
  company: string
  experience: string
  rating: number
  reviews: number
  specialties: string[]
  badges: string[]
  responseRate: number
  avgResponseTime: string
  bio: string
}

const mockMentors: Mentor[] = [
  {
    id: 1,
    name: "김시니어",
    title: "시니어 백엔드 개발자",
    company: "네이버",
    experience: "8년차",
    rating: 4.9,
    reviews: 127,
    specialties: ["백엔드", "시스템설계", "팀리딩"],
    badges: ["인기 멘토", "답변왕"],
    responseRate: 95,
    avgResponseTime: "2시간",
    bio: "대규모 서비스 개발 경험을 바탕으로 백엔드 개발과 시스템 설계에 대한 실무적인 조언을 드립니다.",
  },
  {
    id: 2,
    name: "박매니저",
    title: "프로덕트 매니저",
    company: "카카오",
    experience: "6년차",
    rating: 4.8,
    reviews: 89,
    specialties: ["프로덕트", "기획", "데이터분석"],
    badges: ["신뢰 멘토"],
    responseRate: 92,
    avgResponseTime: "3시간",
    bio: "B2C 프로덕트 기획부터 런칭까지의 전 과정을 경험했습니다. PM 커리어에 대한 고민을 함께 나눠요.",
  },
  {
    id: 3,
    name: "이디자이너",
    title: "UX 디자이너",
    company: "토스",
    experience: "5년차",
    rating: 4.7,
    reviews: 64,
    specialties: ["UX디자인", "사용자리서치", "디자인시스템"],
    badges: ["전문가"],
    responseRate: 88,
    avgResponseTime: "4시간",
    bio: "사용자 중심의 디자인과 디자이너의 커리어 성장에 대해 이야기해요.",
  },
]

const categories = [
  { name: "전체", count: 156 },
  { name: "개발", count: 42 },
  { name: "기획", count: 38 },
  { name: "디자인", count: 29 },
  { name: "마케팅", count: 24 },
  { name: "영업", count: 23 },
]

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')

  const filteredMentors = mockMentors.filter(mentor => {
    const matchesCategory = selectedCategory === '전체' || mentor.specialties.some(s => s.includes(selectedCategory))
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* PC Navigation */}
      <PCNavigation title="멘토" icon={Users} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">멘토</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">멘토 찾기</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg text-purple-600 font-semibold mb-4">전문 분야</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg text-purple-600 font-semibold mb-4">멘토 등급</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="expert" className="rounded text-purple-600" />
                  <label htmlFor="expert" className="text-sm">전문가 멘토</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="popular" className="rounded text-purple-600" />
                  <label htmlFor="popular" className="text-sm">인기 멘토</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="verified" className="rounded text-purple-600" />
                  <label htmlFor="verified" className="text-sm">검증된 멘토</label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="멘토를 검색해보세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mentors */}
            <div className="space-y-4">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {mentor.name.charAt(0)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            <Link href={`/mentors/${mentor.id}`} className="hover:text-purple-600 transition-colors">
                              {mentor.name}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-1">{mentor.title} • {mentor.company}</p>
                          <p className="text-sm text-gray-500">{mentor.experience}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{mentor.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">({mentor.reviews}개 리뷰)</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-600 text-sm leading-relaxed">{mentor.bio}</p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2">
                        {mentor.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {mentor.badges.map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md flex items-center"
                          >
                            <Award className="w-3 h-3 mr-1" />
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          응답률 {mentor.responseRate}%
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          평균 {mentor.avgResponseTime}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="flex space-x-2 pt-2">
                        <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                          멘토링 신청
                        </button>
                        <button className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Mentors */}
            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">멘토를 찾을 수 없습니다</h3>
                <p className="text-gray-600">다른 검색어나 전문 분야를 시도해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
