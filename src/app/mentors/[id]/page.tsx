"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Star, MessageCircle, Award, Briefcase, Clock, MapPin, Calendar, ArrowLeft, Coffee, Send, X } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function MentorDetailPage({ params }: { params: { id: string } }) {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
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

  const mentor = {
    id: parseInt(params.id),
    name: "김시니어",
    title: "시니어 백엔드 개발자",
    company: "네이버",
    experience: "8년차",
    rating: 4.9,
    reviews: 127,
    specialties: ["백엔드", "시스템설계", "팀리딩"],
    badges: ["인기 멘토", "답변왕", "검증된 멘토"],
    responseRate: 95,
    avgResponseTime: "2시간",
    bio: "대규모 서비스 개발 경험을 바탕으로 백엔드 개발과 시스템 설계에 대한 실무적인 조언을 드립니다. 특히 마이크로서비스 아키텍처와 클라우드 인프라에 대한 깊은 이해를 바탕으로 실무에서 바로 적용할 수 있는 솔루션을 제시합니다.",
    location: "서울 강남구",
    education: "서울대학교 컴퓨터공학과",
    languages: ["한국어", "영어"],
    availability: "평일 저녁, 주말 오후",
    hourlyRate: "15만원",
    totalMentoring: 89,
    successRate: 98,
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

  const handleMentoringRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mentoringRequest.topic.trim() || !mentoringRequest.description.trim()) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    
    // TODO: 실제 API 호출 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    setIsSubmitting(false)
    setShowMentoringModal(false)
    alert('멘토링 신청이 완료되었습니다. 멘토의 응답을 기다려주세요.')
    
    // 폼 초기화
    setMentoringRequest({
      topic: '',
      description: '',
      preferredDate: '',
      preferredTime: '',
      duration: '60'
    })
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
            <Link href="/mentors" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Mentor Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="lg:w-1/3">
              <div className="text-center lg:text-left">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl lg:text-4xl font-bold mx-auto lg:mx-0 mb-4">
                  {mentor.name.charAt(0)}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
                <p className="text-lg text-gray-600 mb-1">{mentor.title}</p>
                <p className="text-gray-600 mb-3">{mentor.company}</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold ml-1">{mentor.rating}</span>
                  </div>
                  <span className="text-gray-500">({mentor.reviews}개 리뷰)</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                  {mentor.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:w-2/3">
              <div className="space-y-4">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">소개</h3>
                  <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{mentor.totalMentoring}</p>
                    <p className="text-sm text-gray-600">총 멘토링</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{mentor.successRate}%</p>
                    <p className="text-sm text-gray-600">성공률</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{mentor.responseRate}%</p>
                    <p className="text-sm text-gray-600">응답률</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{mentor.avgResponseTime}</p>
                    <p className="text-sm text-gray-600">평균 응답</p>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">전문 분야</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{mentor.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>{mentor.experience}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{mentor.availability}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>시간당 {mentor.hourlyRate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      <span>{mentor.education}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button 
            onClick={() => setShowMentoringModal(true)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            멘토링 신청
          </button>
          <Link href={`/coffee/send?mentorId=${mentor.id}&mentorName=${mentor.name}`}>
            <button className="flex-1 border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center">
              <Coffee className="w-5 h-5 mr-2" />
              커피 쿠폰 보내기
            </button>
          </Link>
        </div>

        {/* Reviews */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">리뷰 ({reviews.length})</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">도움이 됐어요 {review.helpful}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">메시지 보내기</h3>
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
