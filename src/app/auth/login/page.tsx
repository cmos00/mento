"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Sparkles, User } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDemoLogin = async () => {
    setIsLoading(true)
    
    try {
      // 간단한 지연 후 홈으로 리다이렉트
      setTimeout(() => {
        router.push('/')
      }, 500)
    } catch (error) {
      console.error('데모 로그인 오류:', error)
      alert('데모 로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
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
            {/* 데모 로그인 버튼만 */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                  로그인 중...
                </>
              ) : (
                <>
                  <User className="w-6 h-6 mr-2 inline" />
                  데모로 로그인
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
