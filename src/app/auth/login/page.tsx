"use client"

import { MessageCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// LinkedIn 아이콘 컴포넌트
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function LoginPage() {
  const [linkedinLoading, setLinkedinLoading] = useState(false)
  const [clearingSession, setClearingSession] = useState(false)

  const handleClearSession = async () => {
    setClearingSession(true)
    try {
      console.log('🧹 세션 초기화 중...')
      
      // 세션 초기화 API 호출
      await fetch('/api/auth/clear-session', { method: 'POST' })
      
      // 페이지 새로고침
      window.location.reload()
      
    } catch (error) {
      console.error('세션 초기화 오류:', error)
      alert('세션 초기화 중 오류가 발생했습니다.')
    } finally {
      setClearingSession(false)
    }
  }

  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true)
    
    try {
      console.log('🔗 LinkedIn 로그인 시도 중...')
      
      // LinkedIn OAuth URL 생성 (Client ID 하드코딩)
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=869opboyzlkrhb&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback/linkedin`)}&scope=openid%20profile%20email&state=${Date.now()}`
      
      console.log('🔗 LinkedIn OAuth URL:', linkedinAuthUrl)
      
      // LinkedIn OAuth 페이지로 리다이렉트
      window.location.href = linkedinAuthUrl
      
    } catch (error) {
      console.error('LinkedIn 로그인 예외:', error)
      alert(`LinkedIn 로그인 중 오류가 발생했습니다: ${error}`)
      setLinkedinLoading(false)
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
              disabled={linkedinLoading}
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
            
            {/* 세션 초기화 버튼 (디버깅용) */}
            <button
              onClick={handleClearSession}
              disabled={clearingSession}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {clearingSession ? '세션 초기화 중...' : '세션 초기화 (문제 해결용)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
