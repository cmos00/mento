"use client"

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { getDisplayName } from '@/lib/utils'
import {
  BookOpen,
  Coffee,
  MessageSquare,
  Settings,
  Users,
  Award,
  TrendingUp,
  BarChart3,
  Clock,
  Star,
  Heart
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [dbUser, setDbUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [imageError, setImageError] = useState(false)
  const [mentoringEnabled, setMentoringEnabled] = useState(false)
  const user = dbUser || session?.user

  // 이미지 URL 처리 함수
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null
    
    // LinkedIn 이미지인 경우 프록시 사용
    if (imageUrl.includes('media.licdn.com')) {
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    
    return imageUrl
  }

  console.log('🔍 [Profile Page] 사용자 정보:', {
    session,
    dbUser,
    finalUser: user,
    userImage: user?.image,
    userEmail: user?.email,
    provider: (user as any)?.provider
  })

  // 탭 목록
  const tabs = [
    { id: 'overview', name: '개요', icon: BarChart3 },
    { id: 'activity', name: '활동', icon: Clock },
    { id: 'content', name: '콘텐츠', icon: MessageSquare },
    { id: 'coffee', name: '커피쿠폰', icon: Coffee }
  ]

  // 프로필 페이지 로드 시 사용자 정보 업데이트 및 DB에서 최신 정보 가져오기
  useEffect(() => {
    const updateAndFetchUserInfo = async () => {
      if (session && session.user) {
        try {
          // 1. LinkedIn 사용자인 경우 정보 업데이트
          if ((session.user as any)?.provider === 'linkedin') {
            console.log('🔄 [Profile Page] LinkedIn 사용자 정보 업데이트 시도')
            const updateResponse = await fetch('/api/user/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                company: (session.user as any)?.company,
                position: (session.user as any)?.position
              }),
            })

            if (updateResponse.ok) {
              console.log('✅ [Profile Page] LinkedIn 사용자 정보 업데이트 성공')
            } else {
              const updateResult = await updateResponse.json()
              console.log('⚠️ [Profile Page] LinkedIn 사용자 정보 업데이트 실패:', updateResult)
            }
          }

          // 2. 사용자 정보 조회
          const fetchResponse = await fetch('/api/user/get', {
            method: 'GET',
          })

          if (fetchResponse.ok) {
            const userData = await fetchResponse.json()
            console.log('✅ [Profile Page] 사용자 정보 조회 성공:', userData)
            setDbUser(userData)
          } else {
            const errorResult = await fetchResponse.json()
            console.log('⚠️ [Profile Page] 사용자 정보 조회 실패:', errorResult)
          }
        } catch (error) {
          console.error('❌ [Profile Page] 프로필 정보 업데이트 중 오류:', error)
        }
      }
    }

    updateAndFetchUserInfo()
  }, [session])

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-medium">프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않은 경우
  if (status === 'unauthenticated' || !user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <PCNavigation title="프로필" icon={Users} />
        
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">프로필에 접근하려면 로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-8">프로필을 보려면 먼저 로그인해주세요.</p>
            
            <Link href="/auth/login">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 text-lg mb-4">
                로그인하기
              </button>
            </Link>

            <Link href="/questions" className="text-purple-600 hover:text-purple-700 font-medium">
              질문 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 탭 내용 렌더링 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* 통계 박스 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">12</h3>
                <p className="text-sm text-gray-600">질문</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">8</h3>
                <p className="text-sm text-gray-600">답변</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">24</h3>
                <p className="text-sm text-gray-600">좋아요</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">3</h3>
                <p className="text-sm text-gray-600">저널</p>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">새로운 질문을 작성했습니다</p>
                    <p className="text-sm text-gray-600">2시간 전</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">답변을 작성했습니다</p>
                    <p className="text-sm text-gray-600">5시간 전</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">답변이 좋아요를 받았습니다</p>
                    <p className="text-sm text-gray-600">1일 전</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'activity':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 내역</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">질문 작성: &ldquo;업무와 개인 생활의 균형점은?&ldquo;</p>
                      <p className="text-sm text-gray-600 mt-1">팀 빌딩 관련 질문</p>
                    </div>
                    <span className="text-xs text-gray-500">2일 전</span>
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">답변 작성: &ldquo;프로젝트 관리 방법 질문에 답변&rdquo;</p>
                      <p className="text-sm text-gray-600 mt-1">3개 좋아요 받음</p>
                    </div>
                    <span className="text-xs text-gray-500">3일 전</span>
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">저널 작성: &ldquo;현재 업무에 대한 생각&rdquo;</p>
                      <p className="text-sm text-gray-600 mt-1">개인 성찰</p>
                    </div>
                    <span className="text-xs text-gray-500">1주 전</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'content':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 내 질문 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">내 질문</h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">업무와 개인 생활의 균형점은?</h4>
                    <p className="text-sm text-gray-600 mb-2">팀 빌딩 관련 질문</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>2일 전</span>
                      <span>5 답변</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">리더십 스킬 향상 방법</h4>
                    <p className="text-sm text-gray-600 mb-2">경력 발전</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1주 전</span>
                      <span>8 답변</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 p-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  전체 질문 보기
                </button>
              </div>

              {/* 내 답변 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">내 답변</h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">프로젝트 관리 방법에 대한 답변</h4>
                    <p className="text-sm text-gray-600 mb-2">Agile 방법론 설명</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>3일 전</span>
                      <span>3 좋아요</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">팀워크 향상 방법 답변</h4>
                    <p className="text-sm text-gray-600 mb-2">커뮤니케이션 강조</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1주 전</span>
                      <span>5 좋아요</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 p-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  전체 답변 보기
                </button>
              </div>
            </div>

            {/* 저널 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">내 저널</h3>
                <Link href="/journal">
                  <button className="text-purple-600 border border-purple-200 rounded-lg px-3 py-1 hover:bg-purple-50 transition-colors">
                    새 저널 작성
                  </button>
                </Link>
              </div>
              
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">현재 업무에 대한 생각</h4>
                  <p className="text-gray-600 text-sm mb-2">최근 프로젝트를 진행하면서 느낀 점들을 정리해보았다...</p>
                  <span className="text-xs text-gray-500">1주 전</span>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">학습 계획 수립</h4>
                  <p className="text-gray-600 text-sm mb-2">새로운 기술 스택 학습을 위한 계획을 세웠다...</p>
                  <span className="text-xs text-gray-500">2주 전</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'coffee':
        return (
          <div className="space-y-6">
            {/* 커피 잔 수 및 캐시 */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-orange-200 mb-1">보유 커피 쿠폰</p>
                  <h2 className="text-3xl font-bold">24개</h2>
                </div>
                <Coffee className="w-12 h-12 text-orange-200" />
              </div>
            </div>

            {/* 커피 관련 액션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <Coffee className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">받은 커피</h3>
                  <p className="text-sm text-gray-600">8개 받음</p>
                </div>
              </button>
              
              <button className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <Coffee className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">보낸 커피</h3>
                  <p className="text-sm text-gray-600">12개 보냄</p>
                </div>
              </button>
              
              <Link href="/coffee/charge">
                <button className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors w-full">
                  <div className="text-center">
                    <Coffee className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">충전하기</h3>
                    <p className="text-sm text-gray-600">새로운 커피 구매</p>
                  </div>
                </button>
              </Link>
            </div>

            {/* 최근 트랜잭션 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 커피 트랜잭션</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">커피를 받았습니다</p>
                      <p className="text-sm text-gray-600">팀원으로부터 +5</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2일 전</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">커피를 보냈습니다</p>
                      <p className="text-sm text-gray-600">멘토에게 -3</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1주 전</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">커피 충전</p>
                      <p className="text-sm text-gray-600">+20개 충전</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2주 전</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* PC Navigation */}
      <PCNavigation title="프로필" icon={Users} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">프로필</span>
          </div>
          <Link href="/profile/edit">
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50">
              <Settings className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 사이드바 - 프로필 정보 */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky space-y-6">
              {/* 프로필 헤더 */}
              <div className="text-center">
                {/* 백그라운드 원형 장식 */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 scale-110"></div>
                  <div className="relative inline-block">
                  {user?.image && !imageError ? (
                    <img
                      src={getImageUrl(user.image) || ''}
                      alt={getDisplayName(user.name || '사용자')}  
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      onError={() => {
                        console.log('❌ [Profile Page] 이미지 로드 실패:', user.image)
                        setImageError(true)
                      }}
                      onLoad={() => {
                        console.log('✅ [Profile Page] 이미지 로드 성공:', user.image)
                        setImageError(false)
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                      <span className="text-2xl font-bold text-white">
                        {getDisplayName(user?.name || '사용자').charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* 이미지 디버깅 정보 */}
                  {user?.image && (
                    <div className="mt-2 text-xs text-gray-500 max-w-48">
                      <div className="mb-1">
                        상태: {imageError ? '❌ 로드 실패' : '✅ 로드됨'}
                      </div>
                      <div className="truncate">
                        원본: {user.image.length > 30 ? user.image.substring(0, 30) + '...' : user.image}
                      </div>
                      <div className="truncate">
                        처리: {(() => {
                          const processedUrl = getImageUrl(user.image);
                          return processedUrl && processedUrl.length > 30 ? processedUrl.substring(0, 30) + '...' : processedUrl;
                        })()}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
                
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {getDisplayName(user?.name || '사용자')}
                </h1>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                {user?.company && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <p className="font-medium text-purple-700">{user.company}</p>
                    {user?.position && (
                      <p className="text-sm text-purple-600">{user.position}</p>
                    )}
                  </div>
                )}
              </div>

              {/* 멘토링 설정 (본인만 볼 수 있음) */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="font-medium text-gray-900">멘토링 상태</span>
                    </div>
                    <button
                      onClick={() => setMentoringEnabled(!mentoringEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        mentoringEnabled ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          mentoringEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    {mentoringEnabled
                      ? '다른 사용자들이 1:1 상담을 요청할 수 있습니다'
                      : '멘토링 요청을 받지 않습니다'}
                  </p>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <div className="border-t border-gray-200 pt-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className={`w-5 h-5 mr-3 ${
                        activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* 액션 버튼들 */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <Link href="/profile/edit" className="block">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 inline mr-2" />
                    프로필 편집
                  </button>
                </Link>
                
                <Link href="/questions/new" className="block">
                  <button className="w-full border border-purple-300 text-purple-600 hover:bg-purple-50 font-medium py-3 px-4 rounded-lg transition-colors">
                    <MessageSquare className="w-5 h-5 inline mr-2" />
                    새 질문 작성
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* 오른쪽 메인 컨텐츠 */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {/* 탭 헤더 */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
                <p className="text-gray-600">
                  {activeTab === 'overview' && '프로필 개요 및 통계를 확인하세요'}
                  {activeTab === 'activity' && '최근 활동 내역을 확인하세요'}
                  {activeTab === 'content' && '작성한 질문, 답변, 저널을 관리하세요'}
                  {activeTab === 'coffee' && '커피 쿠폰 잔액 및 내역을 확인하세요'}
                </p>
              </div>

              {/* 탭 컨텐츠 */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}