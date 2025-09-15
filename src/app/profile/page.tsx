"use client"

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import {
  Award,
  BookOpen,
  Coffee,
  LogOut,
  MessageCircle,
  MessageSquare,
  Settings,
  Star,
  ThumbsUp,
  TrendingUp,
  Users
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const user = session?.user
  
  const getDisplayName = (name: string) => {
    if (!name || name === '사용자') return name
    const parts = name.split(' ')
    if (parts.length >= 2) {
      // 성과 이름을 바꿔서 표시 (예: "동현 김" -> "김 동현")
      return `${parts[parts.length - 1]} ${parts.slice(0, -1).join(' ')}`
    }
    return name
  }

  // LinkedIn 사용자 구분
  const isLinkedInUser = (user as any)?.provider === 'linkedin'
  
  // 디버깅: 프로필 이미지 정보 확인
  console.log('🖼️ [Profile Page] 사용자 이미지 정보:', {
    hasImage: !!user?.image,
    imageUrl: user?.image,
    provider: (user as any)?.provider,
    fullUser: user
  })

  // 프로필 페이지 로드 시 사용자 정보 업데이트
  useEffect(() => {
    const updateUserInfo = async () => {
      if (session && user && (user as any)?.provider === 'linkedin') {
        try {
          console.log('🔄 [Profile Page] LinkedIn 사용자 정보 업데이트 시도')
          const response = await fetch('/api/user/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            console.log('✅ [Profile Page] 사용자 정보 업데이트 완료')
          } else {
            console.warn('⚠️ [Profile Page] 사용자 정보 업데이트 실패:', response.status)
          }
        } catch (error) {
          console.error('❌ [Profile Page] 사용자 정보 업데이트 오류:', error)
        }
      }
    }

    updateUserInfo()
  }, [session, user])

  const userStats = {
    questionsAsked: 12,
    answersGiven: 28,
    helpfulVotes: 156,
    coffeeReceived: 8,
    mentoringSessions: 15,
  }

  const recentQuestions = [
    {
      id: 1,
      title: "3년차 개발자, 이직 타이밍이 맞을까요?",
      category: "이직",
      answers: 12,
      likes: 24,
      status: "해결됨",
      createdAt: "2일 전",
    },
    {
      id: 2,
      title: "팀 리드 역할 제안받았는데 준비가 될까요?",
      category: "리더십",
      answers: 8,
      likes: 18,
      status: "진행중",
      createdAt: "1주 전",
    },
  ]

  const recentAnswers = [
    {
      id: 1,
      questionTitle: "신입 개발자 온보딩 어떻게 하면 좋을까요?",
      category: "리더십",
      likes: 15,
      isBest: true,
      createdAt: "1일 전",
    },
    {
      id: 2,
      questionTitle: "코드 리뷰 문화 정착시키는 방법",
      category: "개발문화",
      likes: 22,
      isBest: false,
      createdAt: "3일 전",
    },
  ]

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // 로그인되지 않은 경우
  if (status === 'unauthenticated' || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">프로필을 보려면 먼저 로그인해주세요.</p>
          
          <Link href="/auth/login">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200 mb-4 text-lg">
              로그인하기
            </button>
          </Link>

          <Link href="/questions" className="text-purple-600 hover:text-purple-700">
            질문 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* PC Navigation */}
      <PCNavigation title="프로필" icon={Users} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">프로필</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 text-center mb-6">
              {/* 프로필 이미지 */}
              {user.image ? (
                <div className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-purple-200 overflow-hidden">
                  <img 
                    src={user.image} 
                    alt={user.name || '프로필'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 ring-4 ring-purple-200">
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
              
              {/* 사용자 이름 */}
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{getDisplayName(user.name || '사용자')}</h2>
              
              {/* 이메일 */}
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              {/* 계정 타입 표시 */}
              {isLinkedInUser && (
                <div className="flex items-center justify-center mb-4">
                  <div className="w-4 h-4 bg-[#0077b5] rounded mr-2"></div>
                  <p className="text-sm text-[#0077b5] font-medium">LinkedIn 계정</p>
                </div>
              )}
              <div className="flex justify-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  활발한 멘토
                </span>
                <span className="px-3 py-1 border border-purple-200 text-purple-600 rounded-full text-sm flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  도움왕
                </span>
              </div>
              <button 
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  isLinkedInUser 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
                disabled={isLinkedInUser}
              >
                {isLinkedInUser ? 'LinkedIn 프로필 연동됨' : '프로필 편집'}
              </button>
            </div>

            {/* Activity Stats */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 통계</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                  <div className="text-sm text-gray-600">질문</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">8</div>
                  <div className="text-sm text-gray-600">답변</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
                  <div className="text-sm text-gray-600">멘토링</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">3</div>
                  <div className="text-sm text-gray-600">저널</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
              <div className="space-y-3">
                <Link href="/questions/new">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    새 질문 작성
                  </button>
                </Link>
                
                <Link href="/coffee">
                  <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center">
                    <Coffee className="w-5 h-5 mr-2" />
                    커피쿠폰 관리
                  </button>
                </Link>
                
                <Link href="/journal/new">
                  <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    저널 작성
                  </button>
                </Link>
                
                <Link href="/profile/edit">
                  <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center">
                    <Settings className="w-5 h-5 mr-2" />
                    프로필 편집
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex space-x-1 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  개요
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'questions'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  내 질문
                </button>
                <button
                  onClick={() => setActiveTab('answers')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'answers'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  내 답변
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">최근 질문</h4>
                        <div className="space-y-2">
                          {recentQuestions.slice(0, 2).map((question) => (
                            <div key={question.id} className="text-sm">
                              <p className="text-gray-900 font-medium">{question.title}</p>
                              <p className="text-gray-600">{question.answers}개 답변 • {question.likes}개 좋아요</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">최근 답변</h4>
                        <div className="space-y-2">
                          {recentAnswers.slice(0, 2).map((answer) => (
                            <div key={answer.id} className="text-sm">
                              <p className="text-gray-900 font-medium">{answer.questionTitle}</p>
                              <p className="text-gray-600">{answer.likes}개 좋아요 • {answer.isBest ? '베스트 답변' : '일반 답변'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 추가 섹션들 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 성과 요약 */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                        이번 달 성과
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">질문 작성</span>
                          <span className="font-semibold text-purple-600">3개</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">답변 작성</span>
                          <span className="font-semibold text-green-600">7개</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">받은 좋아요</span>
                          <span className="font-semibold text-blue-600">24개</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">저널 작성</span>
                          <span className="font-semibold text-yellow-600">1개</span>
                        </div>
                      </div>
                    </div>

                    {/* 업적 배지 */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 text-yellow-600 mr-2" />
                        업적 배지
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <MessageCircle className="w-4 h-4 text-purple-600" />
                          </div>
                          <p className="text-xs text-gray-600">질문왕</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-xs text-gray-600">도움왕</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-600">멘토</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <BookOpen className="w-4 h-4 text-yellow-600" />
                          </div>
                          <p className="text-xs text-gray-600">작가</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 최근 멘토링 활동 */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      최근 멘토링 활동
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">백엔드 아키텍처 상담</p>
                          <p className="text-sm text-gray-600">김신입님과의 1:1 멘토링</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">2일 전</p>
                          <p className="text-sm text-blue-600 font-medium">완료</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">이직 준비 상담</p>
                          <p className="text-sm text-gray-600">박주니어님과의 커피챗</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">1주 전</p>
                          <p className="text-sm text-green-600 font-medium">완료</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">코드 리뷰 멘토링</p>
                          <p className="text-sm text-gray-600">이개발자님의 코드 리뷰</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">3일 전</p>
                          <p className="text-sm text-yellow-600 font-medium">진행중</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">내 질문 ({recentQuestions.length})</h3>
                  {recentQuestions.map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{question.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{question.category}</span>
                            <span>{question.answers}개 답변</span>
                            <span>{question.likes}개 좋아요</span>
                            <span>{question.createdAt}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          question.status === '해결됨' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {question.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'answers' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">내 답변 ({recentAnswers.length})</h3>
                  {recentAnswers.map((answer) => (
                    <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{answer.questionTitle}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{answer.category}</span>
                            <span>{answer.likes}개 좋아요</span>
                            <span>{answer.createdAt}</span>
                          </div>
                        </div>
                        {answer.isBest && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            베스트 답변
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
