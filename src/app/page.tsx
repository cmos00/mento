"use client"

import Link from "next/link"
import { MessageCircle, ArrowRight, Shield, Clock, Sparkles, Heart } from "lucide-react"
import { useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  image?: string
  provider: string
}

interface Session {
  user: User
  isAuthenticated: boolean
}

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      
      if (data.success && data.isAuthenticated) {
        setSession({
          user: data.user,
          isAuthenticated: true
        })
      } else {
        setSession(null)
      }
    } catch (error) {
      console.error('세션 확인 오류:', error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setSession(null)
      window.location.href = '/'
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CareerTalk</span>
          </div>
          
          {/* PC 네비게이션 */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-white/80 transition-colors">
              홈
            </Link>
            <Link href="/mentors" className="text-white hover:text-white/80 transition-colors">
              멘토
            </Link>
            <Link href="/journal" className="text-white hover:text-white/80 transition-colors">
              저널
            </Link>
            <Link href="/notifications" className="text-white hover:text-white/80 transition-colors">
              알림
            </Link>
            <Link href="/profile" className="text-white hover:text-white/80 transition-colors">
              프로필
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="text-white text-sm">로딩 중...</div>
            ) : session?.isAuthenticated ? (
              <>
                {/* 사용자 정보 표시 */}
                <div className="text-white text-sm">
                  안녕하세요, {session.user.name || session.user.email || '사용자'}님!
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  로그아웃
                </button>
                <Link href="/questions">
                  <button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-6 py-2 font-medium transition-colors">
                    질문하기
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                    로그인
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-6 py-2 font-medium transition-colors">
                    시작하기
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
            <span className="text-white text-sm font-medium">믿을 수 있는 커리어 멘토링</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            내 고민을 진지하게 들어주는
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              진짜 커리어 멘토
            </span>
          </h1>

          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            익명으로 안전하게, 하지만 신뢰할 수 있는 시니어들에게
            <br />
            커리어 고민에 대한 진정성 있는 조언을 받아보세요 ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-8 py-4 text-lg font-semibold shadow-lg transition-colors">
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </Link>
            <Link href="/questions">
              <button className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-4 text-lg bg-transparent border-2 transition-colors">
                질문 둘러보기
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">왜 CareerTalk일까요?</h2>
          <p className="text-white/80 text-lg">기존 커뮤니티와는 다른 차별화된 가치를 제공해요</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md border-white/20 rounded-3xl overflow-hidden p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">신뢰할 수 있는 멘토</h3>
            <p className="text-white/70 leading-relaxed">
              LinkedIn 연동을 통한 검증된 경력과 후기 기반의 신뢰도 시스템
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border-white/20 rounded-3xl overflow-hidden p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">24시간 언제든</h3>
            <p className="text-white/70 leading-relaxed">
              비동기 방식으로 언제든 질문하고 답변받을 수 있어요
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border-white/20 rounded-3xl overflow-hidden p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">익명으로 안전하게</h3>
            <p className="text-white/70 leading-relaxed">
              개인정보 노출 없이 솔직한 고민을 나눌 수 있어요
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">지금 바로 시작해보세요</h2>
          <p className="text-white/80 mb-8 text-lg">
            수많은 멘토들이 여러분의 커리어 성장을 기다리고 있어요
          </p>
          <Link href="/auth/login">
            <button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-8 py-4 text-lg font-semibold shadow-lg transition-colors">
              무료로 가입하기
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
