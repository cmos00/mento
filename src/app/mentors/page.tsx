"use client"

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { Mentor, getAllMentors } from '@/lib/mentors'
import { Clock, MessageCircle, Search, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const categories = [
  { name: "전체", count: 0 },
  { name: "개발", count: 0 },
  { name: "기획", count: 0 },
  { name: "디자인", count: 0 },
  { name: "마케팅", count: 0 },
  { name: "영업", count: 0 },
]

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMentors()
  }, [])

  const loadMentors = async () => {
    try {
      setLoading(true)
      const { data, error } = await getAllMentors()
      
      if (error) {
        console.error('멘토 로딩 실패:', error)
        return
      }

      if (data) {
        setMentors(data)
        // 카테고리별 카운트 업데이트
        updateCategoryCounts(data)
      }
    } catch (err) {
      console.error('멘토 로딩 중 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateCategoryCounts = (mentorData: Mentor[]) => {
    categories[0].count = mentorData.length
    // 각 카테고리별로 카운트 (간단히 specialties에 포함된 것으로 카운트)
    categories.forEach((cat, idx) => {
      if (idx === 0) return // '전체'는 이미 설정됨
      categories[idx].count = mentorData.filter(m => 
        m.specialties.some(s => s.toLowerCase().includes(cat.name.toLowerCase()))
      ).length
    })
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesCategory = selectedCategory === '전체' || 
      mentor.specialties.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()))
    const matchesSearch = 
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* Mentors Grid */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMentors.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
                    <Link href={`/mentors/${mentor.id}`} className="block group">
                      {/* Mentor Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold ring-4 ring-purple-100">
                          {mentor.title.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{mentor.title}</h3>
                            {mentor.badges.includes("인기 멘토") && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{mentor.company}</p>
                          <p className="text-xs text-gray-500">{mentor.experience}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-900">{mentor.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{mentor.reviews_count}개 리뷰</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium hover:bg-purple-200 transition-colors"
                          >
                            {specialty}
                          </span>
                        ))}
                        {mentor.specialties.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{mentor.specialties.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1 text-green-600" />
                            <span className="font-medium">{mentor.response_rate}%</span>
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-blue-600" />
                            <span className="font-medium">{mentor.avg_response_time}</span>
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          // TODO: 채팅 기능 구현
                          alert('채팅 기능은 곧 출시됩니다!')
                        }}
                      >
                        1:1 상담 요청
                      </button>
                    </div>

                    {/* Badges */}
                    {mentor.badges.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {mentor.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

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
