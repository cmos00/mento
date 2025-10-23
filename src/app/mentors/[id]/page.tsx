"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Award, Briefcase, Calendar, Coffee, MessageCircle, Send, Star, X, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { Mentor, getMentorById } from '@/lib/mentors'

export default function MentorDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [showMentoringModal, setShowMentoringModal] = useState(false)
  const [mentoringRequest, setMentoringRequest] = useState({
    topic: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    duration: '60'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadMentor()
  }, [params.id])

  const loadMentor = async () => {
    try {
      setLoading(true)
      const { data, error } = await getMentorById(params.id)
      
      if (error) {
        console.error('멘토 로딩 실패:', error)
        return
      }

      if (data) {
        setMentor(data)
      }
    } catch (err) {
      console.error('멘토 로딩 중 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMentoringRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mentoringRequest.topic.trim() || !mentoringRequest.description.trim()) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    
    // TODO: 실제 API 호출 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setShowMentoringModal(false)
    alert('멘토링 신청이 완료되었습니다. 멘토의 응답을 기다려주세요.')
    
    setMentoringRequest({
      topic: '',
      description: '',
      preferredDate: '',
      preferredTime: '',
      duration: '60'
    })
  }

  const reviews = [
    {
      id: 1,
      author: "박개발",
      rating: 5,
      content: "정말 도움이 많이 되었습니다. 구체적이고 실무적인 조언을 많이 받을 수 있어서 감사했습니다.",
      date: "1주 전",
      helpful: 12
    },
    {
      id: 2,
      author: "이신입",
      rating: 5,
      content: "신입 개발자로서 궁금했던 점들을 하나씩 차근차근 설명해주셔서 정말 유익했습니다.",
      date: "2주 전",
      helpful: 8
    },
    {
      id: 3,
      author: "김주니어",
      rating: 4,
      content: "전반적으로 만족스러웠지만, 조금 더 구체적인 예시가 있었으면 좋았을 것 같습니다.",
      date: "3주 전",
      helpful: 5
    }
  ]

  if (loading || !mentor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-medium">멘토 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* PC Navigation */}
      <PCNavigation title="멘토 프로필" icon={Users} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3">
          <Link href="/mentors" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">멘토 프로필</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 사이드바 - 멘토 정보 */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              {/* 멘토 프로필 헤더 */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 scale-110"></div>
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-purple-200 shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {mentor.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-xl font-bold text-gray-900 mb-1">{mentor.title}</h1>
                <p className="text-gray-600 mb-1">{mentor.company}</p>
                <p className="text-sm text-gray-500 mb-4">{mentor.experience}</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold ml-1">{mentor.rating}</span>
                  </div>
                  <span className="text-gray-500">({mentor.reviews_count}개 리뷰)</span>
                </div>

                {/* Badges */}
                {mentor.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {mentor.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 통계 정보 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{mentor.total_sessions}</p>
                    <p className="text-xs text-gray-600">총 멘토링</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{mentor.response_rate}%</p>
                    <p className="text-xs text-gray-600">응답률</p>
                  </div>
                </div>
              </div>

              {/* 상태 정보 */}
              <div className="border-t border-gray-200 pt-6 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{mentor.is_available ? '상담 가능' : '상담 불가'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{mentor.is_verified ? '검증된 멘토' : '멘토'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Coffee className="w-4 h-4 mr-2 text-purple-600" />
                  <span>커피 쿠폰으로 감사 표현</span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <button 
                  onClick={() => setShowMentoringModal(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  멘토링 신청
                </button>
                
                <Link href={`/coffee/send?mentorId=${mentor.id}&mentorName=${encodeURIComponent(mentor.title)}`}>
                  <button className="w-full border border-purple-300 text-purple-600 hover:bg-purple-50 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                    <Coffee className="w-5 h-5 mr-2" />
                    커피 쿠폰 보내기
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* 오른쪽 메인 컨텐츠 */}
          <div className="flex-1 space-y-6">
            {/* 소개 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">소개</h2>
              <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
            </div>

            {/* 전문 분야 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">전문 분야</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* 리뷰 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">리뷰 ({reviews.length})</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{review.author}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{review.content}</p>
                    <span className="text-sm text-gray-500">도움이 됐어요 {review.helpful}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 메시지 보내기 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">메시지 보내기</h2>
              <div className="space-y-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="멘토에게 궁금한 점이나 멘토링 요청사항을 작성해주세요..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    메시지 보내기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentoring Request Modal */}
      {showMentoringModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">멘토링 신청</h3>
                <button
                  onClick={() => setShowMentoringModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleMentoringRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    멘토링 주제 *
                  </label>
                  <input
                    type="text"
                    value={mentoringRequest.topic}
                    onChange={(e) => setMentoringRequest(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="멘토링하고 싶은 주제를 입력해주세요"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세 설명 *
                  </label>
                  <textarea
                    value={mentoringRequest.description}
                    onChange={(e) => setMentoringRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="구체적인 상황과 궁금한 점을 설명해주세요"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      희망 날짜
                    </label>
                    <input
                      type="date"
                      value={mentoringRequest.preferredDate}
                      onChange={(e) => setMentoringRequest(prev => ({ ...prev, preferredDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      희망 시간
                    </label>
                    <input
                      type="time"
                      value={mentoringRequest.preferredTime}
                      onChange={(e) => setMentoringRequest(prev => ({ ...prev, preferredTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    멘토링 시간
                  </label>
                  <select
                    value={mentoringRequest.duration}
                    onChange={(e) => setMentoringRequest(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="30">30분</option>
                    <option value="60">1시간</option>
                    <option value="90">1시간 30분</option>
                    <option value="120">2시간</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMentoringModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '신청 중...' : '신청하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
