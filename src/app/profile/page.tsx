"use client"

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { getDisplayName } from '@/lib/utils'
import {
  BookOpen,
  Coffee,
  MessageSquare,
  Settings,
  Users
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않은 경우
  if (status === 'unauthenticated' || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <PCNavigation title="프로필" icon={Users} />
        
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">프로필에 접근하려면 로그인이 필요합니다</h1>
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
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={getDisplayName(user.name || '사용자')}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {getDisplayName(user?.name || '사용자').charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {getDisplayName(user?.name || '사용자')}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                {user?.company && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-purple-700 font-medium">{user.company}</p>
                    {user?.position && (
                      <p className="text-xs text-purple-600">{user.position}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">내 계정 관리</h3>
              <div className="space-y-3">
                <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-3" />
                    내 질문/답변 관리
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3" />
                    멘토링 내역 관리
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <Link href="/journal">
                  <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-3" />
                      내 저널 관리
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                </Link>
                
                <Link href="/profile/edit">
                  <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-3" />
                      프로필 편집
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* 커피 쿠폰 영역 */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">커피 쿠폰 관리</h3>
              <div className="space-y-3">
                <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 mr-3" />
                    받은 쿠폰 내역
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 mr-3" />
                    보낸 쿠폰 내역
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <Link href="/coffee/charge">
                  <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center">
                      <Coffee className="w-5 h-5 mr-3" />
                      충전 내역
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">내 활동</h3>
              
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">아직 활동 내역이 없습니다</h4>
                <p className="text-gray-600 mb-6">질문을 작성하거나 답변을 달아보세요!</p>
                <Link href="/questions">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                    질문 목록 보기
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}