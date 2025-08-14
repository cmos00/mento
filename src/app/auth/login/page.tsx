"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Linkedin, Sparkles } from 'lucide-react'
import { mockAuth, defaultMockUser } from '@/lib/mockAuth'

export default function LoginPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">CareerTalk</span>
          </Link>
        </div>

        <div className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
          <div className="text-center pb-6 pt-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
              <h1 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                로그인
              </h1>
            </div>
            <p className="text-gray-600 px-6">
              커리어 멘토링 커뮤니티에 오신 것을 환영합니다 ✨
            </p>
          </div>
          <div className="space-y-6 px-6 pb-6">
            {/* LinkedIn Login */}
            <button
              onClick={handleLinkedInLogin}
              disabled={isLoading}
              className="w-full bg-[#0077B5] hover:bg-[#006097] text-white py-3 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                  로그인 중...
                </>
              ) : (
                <>
                  <Linkedin className="w-5 h-5 mr-2 inline" />
                  LinkedIn으로 로그인
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              아직 계정이 없으신가요?{" "}
              <Link href="/auth/signup" className="text-purple-600 hover:underline font-medium">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
