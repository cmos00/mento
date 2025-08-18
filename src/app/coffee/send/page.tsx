"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Coffee, ArrowLeft, Gift, Search, MessageCircle, Send, Users, Star } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

interface Mentor {
  id: number
  name: string
  title: string
  company: string
  rating: number
  reviews: number
  specialties: string[]
  avatar: string
  recentMentoring?: string
}

export default function CoffeeSendPage() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [amount, setAmount] = useState(5000)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [step, setStep] = useState<'select' | 'send'>('select')

  // Mock 멘토 데이터
  const mentors: Mentor[] = [
    {
      id: 1,
      name: '김시니어',
      title: '시니어 백엔드 개발자',
      company: '네이버',
      rating: 4.9,
      reviews: 127,
      specialties: ['백엔드', '시스템설계', '팀리딩'],
      avatar: '김',
      recentMentoring: '백엔드 아키텍처 설계'
    },
    {
      id: 2,
      name: '박매니저',
      title: '프로덕트 매니저',
      company: '카카오',
      rating: 4.8,
      reviews: 89,
      specialties: ['프로덕트 기획', '데이터 분석', '사용자 리서치'],
      avatar: '박',
      recentMentoring: '프로덕트 기획 방법론'
    },
    {
      id: 3,
      name: '이디자이너',
      title: 'UI/UX 디자이너',
      company: '쿠팡',
      rating: 4.7,
      reviews: 156,
      specialties: ['UI/UX', '사용자 경험', '디자인 시스템'],
      avatar: '이',
      recentMentoring: 'UI/UX 디자인 리뷰'
    },
    {
      id: 4,
      name: '최개발',
      title: '풀스택 개발자',
      company: '토스',
      rating: 4.9,
      reviews: 203,
      specialties: ['프론트엔드', '백엔드', 'DevOps'],
      avatar: '최',
      recentMentoring: '풀스택 개발 가이드'
    }
  ]

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.includes(searchQuery) ||
    mentor.title.includes(searchQuery) ||
    mentor.company.includes(searchQuery) ||
    mentor.specialties.some(specialty => specialty.includes(searchQuery))
  )

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setStep('send')
  }

  const handleSendCoffee = async () => {
    if (!selectedMentor || !message.trim()) return
    
    setIsSending(true)
    
    // TODO: 실제 API 호출 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSending(false)
    alert(`${selectedMentor.name}님에게 ${amount.toLocaleString()}원 커피쿠폰을 성공적으로 전송했습니다!`)
    
    // 폼 초기화
    setMessage('')
    setStep('select')
    setSelectedMentor(null)
  }

  const handleBackToSelect = () => {
    setStep('select')
    setSelectedMentor(null)
    setMessage('')
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
            <Link href="/coffee" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Mentor Selection Step */}
        {step === 'select' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">커피쿠폰을 보낼 멘토 선택</h1>
              <p className="text-gray-600">멘토링에 감사한 마음을 담아 커피쿠폰을 전송하세요</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="멘토 이름, 직책, 회사, 전문 분야로 검색"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Mentors List */}
            <div className="space-y-3">
              {filteredMentors.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => handleMentorSelect(mentor)}
                  className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 text-left hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {mentor.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{mentor.rating}</span>
                          <span className="text-sm text-gray-500">({mentor.reviews})</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-1">{mentor.title}</p>
                      <p className="text-gray-600 text-sm mb-2">{mentor.company}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {mentor.specialties.slice(0, 3).map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      
                      {mentor.recentMentoring && (
                        <p className="text-sm text-gray-500">
                          최근 멘토링: {mentor.recentMentoring}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Gift className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 검색어를 시도해보세요.</p>
              </div>
            )}
          </div>
        )}

        {/* Send Coffee Step */}
        {step === 'send' && selectedMentor && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">커피쿠폰 전송</h1>
              <p className="text-gray-600">선택한 멘토에게 감사의 마음을 전달하세요</p>
            </div>

            {/* Selected Mentor Info */}
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">선택한 멘토</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedMentor.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedMentor.name}</h4>
                  <p className="text-gray-700">{selectedMentor.title}</p>
                  <p className="text-gray-600 text-sm">{selectedMentor.company}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{selectedMentor.rating}</span>
                    <span className="text-sm text-gray-500">({selectedMentor.reviews}개 리뷰)</span>
                  </div>
                </div>
                <button
                  onClick={handleBackToSelect}
                  className="ml-auto text-sm text-purple-600 hover:text-purple-700"
                >
                  변경
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">커피쿠폰 금액</h3>
              <div className="grid grid-cols-2 gap-3">
                {[3000, 5000, 10000, 20000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value)}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      amount === value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">{value.toLocaleString()}원</div>
                      <div className="text-sm text-gray-500">
                        {value === 3000 && '아메리카노'}
                        {value === 5000 && '카페라떼'}
                        {value === 10000 && '스페셜티'}
                        {value === 20000 && '프리미엄'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">선택된 금액</span>
                  <span className="font-semibold text-gray-900">{amount.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">감사 메시지</h3>
              <div className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`${selectedMentor.name}님에게 전달할 감사 메시지를 작성해주세요.

예시:
• 멘토링에 정말 감사드립니다!
• 구체적인 조언 덕분에 많이 배웠습니다
• 앞으로도 좋은 멘토링 부탁드립니다`}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500">
                  {message.length}/500
                </div>
              </div>
            </div>

            {/* Quick Messages */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">빠른 메시지</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  '멘토링에 정말 감사드립니다!',
                  '구체적인 조언 덕분에 많이 배웠습니다',
                  '앞으로도 좋은 멘토링 부탁드립니다',
                  '실무에 바로 적용할 수 있는 팁 감사합니다',
                  '궁금했던 점들을 명확하게 해결해주셔서 감사합니다',
                  '전문적인 시각으로 조언해주셔서 도움이 많이 되었습니다'
                ].map((quickMessage) => (
                  <button
                    key={quickMessage}
                    onClick={() => setMessage(quickMessage)}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
                  >
                    {quickMessage}
                  </button>
                ))}
              </div>
            </div>

            {/* Send Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSendCoffee}
                disabled={!message.trim() || isSending}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {amount.toLocaleString()}원 커피쿠폰 전송하기
                  </>
                )}
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Coffee className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">커피쿠폰 전송 안내</p>
                  <ul className="space-y-1">
                    <li>• 전송된 커피쿠폰은 즉시 멘토에게 전달됩니다</li>
                    <li>• 멘토는 받은 커피쿠폰을 실제 카페에서 사용할 수 있습니다</li>
                    <li>• 전송 후에는 취소할 수 없습니다</li>
                    <li>• 감사 메시지는 멘토에게 함께 전달됩니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
