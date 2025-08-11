'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'mentors' | 'private'>('public')
  const [coffeeBalance, setCoffeeBalance] = useState(8)

  const handleSignOut = () => {
    // TODO: 로그아웃 로직 구현
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-900">프로필</h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mobile-content">
        {/* 프로필 정보 */}
        <div className="px-4 py-6">
          <div className="card">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary-600">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {session?.user?.name || '사용자'}
                </h2>
                <p className="text-gray-600">
                  {session?.user?.email || 'email@example.com'}
                </p>
                <p className="text-sm text-gray-500">
                  LinkedIn 연동됨
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회사
                </label>
                <input
                  type="text"
                  placeholder="회사명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직무
                </label>
                <input
                  type="text"
                  placeholder="직무를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  경력
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">경력을 선택하세요</option>
                  <option value="1-2">1-2년</option>
                  <option value="3-5">3-5년</option>
                  <option value="6-8">6-8년</option>
                  <option value="9+">9년 이상</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 프로필 공개 설정 */}
        <div className="px-4 pb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">프로필 공개 설정</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={profileVisibility === 'public'}
                  onChange={(e) => setProfileVisibility(e.target.value as any)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-gray-900">전체 공개</div>
                  <div className="text-sm text-gray-500">모든 사용자가 프로필을 볼 수 있습니다</div>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="visibility"
                  value="mentors"
                  checked={profileVisibility === 'mentors'}
                  onChange={(e) => setProfileVisibility(e.target.value as any)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-gray-900">멘토에게만 공개</div>
                  <div className="text-sm text-gray-500">멘토링을 진행하는 멘토에게만 프로필이 공개됩니다</div>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={profileVisibility === 'private'}
                  onChange={(e) => setProfileVisibility(e.target.value as any)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-gray-900">비공개</div>
                  <div className="text-sm text-gray-500">프로필 정보가 공개되지 않습니다</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 커피 쿠폰 */}
        <div className="px-4 pb-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">커피 쿠폰</h3>
              <Link href="/coffee" className="text-primary-600 text-sm font-medium">
                충전하기
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">☕</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{coffeeBalance}개</div>
                <div className="text-sm text-gray-500">보유 중</div>
              </div>
            </div>
          </div>
        </div>

        {/* 기타 설정 */}
        <div className="px-4 pb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기타 설정</h3>
            <div className="space-y-4">
              <Link href="/notifications" className="flex items-center justify-between py-2">
                <span className="text-gray-900">알림 설정</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/privacy" className="flex items-center justify-between py-2">
                <span className="text-gray-900">개인정보 처리방침</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/terms" className="flex items-center justify-between py-2">
                <span className="text-gray-900">이용약관</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/help" className="flex items-center justify-between py-2">
                <span className="text-gray-900">도움말</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="px-4 pb-6">
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="mobile-bottom-nav">
        <div className="flex items-center justify-around">
          <Link href="/questions" className="flex flex-col items-center space-y-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-medium">질문</span>
          </Link>
          <Link href="/mentors" className="flex flex-col items-center space-y-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium">멘토</span>
          </Link>
          <Link href="/journal" className="flex flex-col items-center space-y-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-medium">저널</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-primary-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">프로필</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
