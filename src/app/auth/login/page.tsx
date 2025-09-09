"use client"

import { MessageCircle, Sparkles, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// LinkedIn 아이콘 컴포넌트
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const router = useRouter()

  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true)
    
    try {
      console.log('🔗 LinkedIn 로그인 시도 중...')
      
      // LinkedIn OAuth URL 생성
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/linkedin`)}&scope=openid%20profile%20email&state=${Date.now()}`
      
      console.log('🔗 LinkedIn OAuth URL:', linkedinAuthUrl)
      
      // LinkedIn OAuth 페이지로 리다이렉트
      window.location.href = linkedinAuthUrl
      
    } catch (error) {
      console.error('LinkedIn 로그인 예외:', error)
      alert(`LinkedIn 로그인 중 오류가 발생했습니다: ${error}`)
      setLinkedinLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    
    try {
      console.log('🎭 데모 로그인 시도 중...')
      
      // 데모 세션 생성
      const demoSession = {
        user: {
          id: 'demo_user_123',
          name: '김멘티',
          email: 'demo@example.com',
          image: null,
          provider: 'demo'
        },
        accessToken: 'demo_token',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24시간
      }
      
      // 세션을 쿠키에 저장
      document.cookie = `linkedin_session=${JSON.stringify(demoSession)}; path=/; max-age=${24 * 60 * 60}`
      
      console.log('✅ 데모 로그인 성공, 메인페이지로 이동...')
      router.push('/')
      
    } catch (error) {
      console.error('데모 로그인 예외:', error)
      alert('데모 로그인 중 예외가 발생했습니다. 다시 시도해주세요.')
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
          <div className="space-y-4 px-6 pb-6">
            {/* LinkedIn 로그인 버튼 */}
            <button
              onClick={handleLinkedInLogin}
              disabled={linkedinLoading || isLoading}
              className="w-full bg-[#0077b5] hover:bg-[#005885] text-white py-4 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center"
            >
              {linkedinLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  LinkedIn 로그인 중...
                </>
              ) : (
                <>
                  <LinkedInIcon className="w-6 h-6 mr-3 fill-white" />
                  LinkedIn으로 로그인
                </>
              )}
            </button>

            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 데모 로그인 버튼 */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading || linkedinLoading}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  로그인 중...
                </>
              ) : (
                <>
                  <User className="w-6 h-6 mr-3" />
                  데모로 로그인
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
