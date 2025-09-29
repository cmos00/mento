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
  BarChart3
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [dbUser, setDbUser] = useState<any>(null)
  const user = dbUser || session?.user

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50">
        <PCNavigation title="프로필" icon={Users} />
        
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">프로필에 접근하려면 로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-8">프로필을 보려면 먼저 로그인해주세요.</p>
            
            <Link href="/auth/login">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-lg mb-4">
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

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={getDisplayName(user.name || '사용자')}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {getDisplayName(user?.name || '사용자').charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getDisplayName(user?.name || '시용자')}
            </h1>
            <p className="text-gray-600 mb-6">{user?.email}</p>
            
            {user?.company && (
              <div className="bg-purple-50 rounded-xl p-4 mb-6 max-w-sm mx-auto">
                <p className="text-lg text-purple-700 font-medium">{user.company}</p>
                {user?.position && (
                  <p className="text-purple-600">{user.position}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
            <p className="text-gray-600">질문</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">8</h3>
            <p className="text-gray-600">답변</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">24</h3>
            <p className="text-gray-600">좋아요</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">3</h3>
            <p className="text-gray-600">저널</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-6">
          {/* 내 콘텐츠 관리 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 text-purple-600 mr-3" />
              내 콘텐츠 관리
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group">
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">내 질문 관리</h3>
                    <p className="text-sm text-gray-600">작성한 질문을 확인하고 관리하세요</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group">
                <div className="flex items-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">내 답변 관리</h3>
                    <p className="text-sm text-gray-600">작성한 답변을 확인하고 관리하세요</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 커뮤니티 활동 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              커뮤니티 활동
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">멘토링 내역</h3>
                    <p className="text-sm text-gray-600">멘토링 활동을 확인하세요</p>
                  </div>
                </div>
              </button>
              
              <Link href="/journal">
                <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group w-full">
                  <div className="flex items-center">
                    <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">내 저널</h3>
                      <p className="text-sm text-gray-600">개인 저널을 관리하세요</p>
                    </div>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* 커피 쿠폰 관리 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Coffee className="w-6 h-6 text-purple-600 mr-3" />
              커피 쿠폰 관리
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group">
                <div className="text-center">
                  <Coffee className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 mb-2">받은 쿠폰</h3>
                  <p className="text-sm text-gray-600">받은 쿠폰 내역</p>
                </div>
              </button>
              
              <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group">
                <div className="text-center">
                  <Coffee className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 mb-2">보낸 쿠폰</h3>
                  <p className="text-sm text-gray-600">보낸 쿠폰 내역</p>
                </div>
              </button>
              
              <Link href="/coffee/charge">
                <button className="p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group w-full">
                  <div className="text-center">
                    <Coffee className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 mb-2">충전 내역</h3>
                    <p className="text-sm text-gray-600">충전 기록 보기</p>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* 계정 설정 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 text-purple-600 mr-3" />
              계정 설정
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/profile/edit" className="flex-1">
                <button className="w-full p-4 border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 group">
                  <div className="text-center">
                    <Settings className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-700">프로필 편집</h3>
                  </div>
                </button>
              </Link>
              
              <Link href="/questions" className="flex-1">
                <button className="w-full p-4 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-200 hover:bg-purple-50 group">
                  <div className="text-center">
                    <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">질문하기</h3>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}