'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockAuth, defaultMockUser } from '@/lib/mockAuth'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLinkedInLogin = async () => {
    setIsLoading(true)
    
    // Mock LinkedIn 로그인 과정 시뮬레이션
    try {
      // 1단계: LinkedIn 인증 요청 (1초)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 2단계: 사용자 정보 가져오기 (0.5초)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 3단계: 세션 생성 (0.5초)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock 사용자 정보로 로그인
      mockAuth.login(defaultMockUser)
      
      // 로그인 성공 후 질문 목록 페이지로 이동
      router.push('/questions')
      
    } catch (error) {
      console.error('Mock login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F5F5DC] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#6A5ACD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            로그인
          </h1>
          
          <p className="text-gray-600 mb-6">
            계속하려면 로그인해주세요
          </p>
          
          <button
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className="w-full bg-[#0077B5] hover:bg-[#006097] text-white font-medium py-4 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>LinkedIn으로 로그인 중...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn으로 로그인</span>
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-500">
            로그인하면 서비스 이용약관과 개인정보처리방침에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
