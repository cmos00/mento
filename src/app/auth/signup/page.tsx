"use client"

import Link from 'next/link'
import { MessageCircle, ArrowLeft, LogIn } from 'lucide-react'

export default function SignupPage() {
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
              <LogIn className="w-6 h-6 text-purple-500 mr-2" />
              <h1 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                회원가입
              </h1>
            </div>
            <p className="text-gray-600 px-6">
              CareerTalk은 LinkedIn 로그인을 통해 간편하게 시작할 수 있습니다
            </p>
          </div>
          
          <div className="space-y-4 px-6 pb-6">
            {/* 안내 메시지 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>간편 로그인:</strong> LinkedIn 계정으로 로그인하거나 데모 계정을 사용해보세요.
              </p>
            </div>

            {/* 로그인 페이지로 이동 버튼 */}
            <Link href="/auth/login">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-medium transition-colors hover:from-purple-600 hover:to-pink-600 text-lg flex items-center justify-center">
                <LogIn className="w-6 h-6 mr-3" />
                로그인 페이지로 이동
              </button>
            </Link>

            {/* 홈으로 돌아가기 */}
            <Link href="/">
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium transition-colors hover:bg-gray-200 text-lg flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                홈으로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
