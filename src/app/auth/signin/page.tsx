'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/questions'

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Callback':
        return 'LinkedIn 로그인 중 문제가 발생했습니다. 다시 시도해주세요.'
      case 'OAuthCallback':
        return 'LinkedIn 인증 과정에서 오류가 발생했습니다. 권한 설정을 확인해주세요.'
      default:
        return '인증 과정에서 오류가 발생했습니다.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                인증 오류
              </h1>
              
              <p className="text-gray-600 mb-6">
                {getErrorMessage(error)}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                로그인
              </h1>
              
              <p className="text-gray-600 mb-6">
                계속하려면 로그인해주세요
              </p>
            </>
          )}
          
          <div className="space-y-3">
            <Link 
              href="/auth/login" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 block"
            >
              LinkedIn으로 로그인
            </Link>
            
            <Link 
              href="/" 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200 block"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
