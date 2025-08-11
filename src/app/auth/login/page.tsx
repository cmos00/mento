'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLinkedInLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('linkedin', { 
        callbackUrl: '/questions',
        redirect: false 
      })
      
      if (result?.ok) {
        router.push('/questions')
      } else {
        console.error('Login failed:', result?.error)
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-900">로그인</h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mobile-content flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Career Mentor에 오신 것을 환영합니다
            </h2>
            <p className="text-gray-600">
              LinkedIn 계정으로 간편하게 로그인하고<br />
              커리어 고민을 해결해보세요
            </p>
          </div>

          {/* 로그인 버튼 */}
          <button
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-3 mb-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn으로 로그인</span>
              </>
            )}
          </button>

          {/* 약관 동의 */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              로그인 시{' '}
              <Link href="/terms" className="text-primary-600 underline">
                이용약관
              </Link>
              과{' '}
              <Link href="/privacy" className="text-primary-600 underline">
                개인정보처리방침
              </Link>
              에 동의하게 됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
