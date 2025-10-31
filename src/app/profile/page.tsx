"use client"

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { getDisplayName } from '@/lib/utils'
import {
    Award,
    BarChart3,
    Clock,
    Coffee,
    Heart,
    LogOut,
    MessageSquare,
    Settings,
    Users
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [dbUser, setDbUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [imageError, setImageError] = useState(false)
  const [mentoringEnabled, setMentoringEnabled] = useState(false)
  const [isSavingMentoring, setIsSavingMentoring] = useState(false)
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
            // 멘토링 상태 초기화
            setMentoringEnabled(userData.mentoring_enabled || false)
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

  // 멘토링 상태 변경
  const handleMentoringToggle = async () => {
    const newValue = !mentoringEnabled
    setIsSavingMentoring(true)
    
    console.log('🔄 [Profile Page] 멘토링 토글 시작:', {
      currentValue: mentoringEnabled,
      newValue: newValue,
      userEmail: user?.email
    })
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          mentoring_enabled: newValue
        }),
      })

      console.log('📡 [Profile Page] API 응답 상태:', response.status)

      if (response.ok) {
        const result = await response.json()
        setMentoringEnabled(newValue)
        console.log('✅ [Profile Page] 멘토링 상태 업데이트 성공:', newValue, result)
        
        // 성공 피드백
        alert(`멘토링 상태가 ${newValue ? 'ON' : 'OFF'}으로 변경되었습니다.`)
      } else {
        const errorData = await response.json()
        console.error('❌ [Profile Page] 멘토링 상태 업데이트 실패:', errorData)
        
        // 상세 에러 정보 표시
        if (errorData.error && errorData.error.includes('column')) {
          alert(`데이터베이스 컬럼이 없습니다.\n\nSupabase SQL Editor에서 다음을 실행하세요:\n\nALTER TABLE users ADD COLUMN IF NOT EXISTS mentoring_enabled BOOLEAN DEFAULT false;\nCREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled ON users(mentoring_enabled);`)
        } else {
          alert(`멘토링 상태 변경 실패\n\n에러: ${errorData.error || '알 수 없는 오류'}`)
        }
      }
    } catch (error) {
      console.error('❌ [Profile Page] 멘토링 상태 업데이트 중 오류:', error)
      alert(`네트워크 오류가 발생했습니다.\n\n${error}`)
    } finally {
      setIsSavingMentoring(false)
    }
  }

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
    <div className="min-h-screen bg-white">
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
                {/* 프로필 이미지 */}
                <div className="mb-6 flex justify-center">
                  {user?.image && !imageError ? (
                    <img
                      src={getImageUrl(user.image) || ''}
                      alt={getDisplayName(user.name || '사용자')}  
                      className="w-28 h-28 rounded-full object-cover shadow-lg"
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
                    <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {getDisplayName(user?.name || '사용자').charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                {user?.linkedin_url ? (
                  <a 
                    href={user.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                      {getDisplayName(user?.name || '사용자')}
                    </h1>
                    <p className="text-gray-600 mb-4">{user?.email}</p>
                  </a>
                ) : (
                  <>
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                      {getDisplayName(user?.name || '사용자')}
                    </h1>
                    <p className="text-gray-600 mb-4">{user?.email}</p>
                  </>
                )}
                
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
                      onClick={handleMentoringToggle}
                      disabled={isSavingMentoring}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        mentoringEnabled ? 'bg-purple-600' : 'bg-gray-300'
                      } ${isSavingMentoring ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  
                  {/* 디버그 버튼 */}
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={async () => {
                        const response = await fetch('/api/debug/check-column')
                        const data = await response.json()
                        console.log('🔍 [Debug] 컬럼 체크 결과:', data)
                        if (data.checks?.hasMentoringColumn) {
                          alert('✅ mentoring_enabled 컬럼이 존재합니다!\n\n사용 가능한 컬럼:\n' + data.checks.availableColumns.join(', '))
                        } else {
                          alert('❌ mentoring_enabled 컬럼이 없습니다!\n\n' + data.recommendation)
                        }
                      }}
                      className="w-full text-xs text-purple-600 hover:text-purple-700 underline"
                    >
                      🔍 데이터베이스 컬럼 확인
                    </button>
                    
                    <button
                      onClick={async () => {
                        console.log('🧪 [Test] 업데이트 테스트 시작')
                        const response = await fetch('/api/debug/test-update', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            currentValue: mentoringEnabled,
                            mentoring_enabled: !mentoringEnabled
                          })
                        })
                        const data = await response.json()
                        console.log('🧪 [Test] 테스트 결과:', data)
                        
                        if (data.success) {
                          alert(`✅ 업데이트 테스트 성공!\n\n변경 전: ${data.before.mentoring_enabled}\n변경 후: ${data.after.mentoring_enabled}`)
                          // 성공했으면 실제 상태도 업데이트
                          setMentoringEnabled(data.after.mentoring_enabled)
                        } else {
                          alert(`❌ 업데이트 테스트 실패\n\n에러: ${data.error}\n\n상세:\n${JSON.stringify(data.details || data, null, 2)}`)
                        }
                      }}
                      className="w-full text-xs text-green-600 hover:text-green-700 underline"
                    >
                      🧪 업데이트 테스트 (디버그 모드)
                    </button>
                  </div>
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

                <button
                  onClick={() => {
                    if (confirm('로그아웃 하시겠습니까?')) {
                      signOut({ callbackUrl: '/auth/login' })
                    }
                  }}
                  className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 inline mr-2" />
                  로그아웃
                </button>
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