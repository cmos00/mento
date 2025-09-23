'use client'

import { useState } from 'react'
import { auth } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLinkedInLogin = async () => {
    try {
      setLoading(true)
      setError('')
      
      await auth.signInWithLinkedIn()
      // 리다이렉트는 Supabase가 자동으로 처리
    } catch (err: any) {
      console.error('LinkedIn 로그인 실패:', err)
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    try {
      setLoading(true)
      setError('')
      
      // 데모 사용자로 로그인 (개발용)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo123456'
      })
      
      if (error) {
        // 데모 사용자가 없는 경우 생성
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'demo@example.com',
          password: 'demo123456',
          options: {
            data: {
              full_name: '데모 사용자',
              name: '데모 사용자'
            }
          }
        })
        
        if (signUpError) {
          throw signUpError
        }
        
        // 사용자 정보를 users 테이블에 저장
        if (signUpData.user) {
          await supabase
            .from('users')
            .upsert({
              id: signUpData.user.id,
              email: signUpData.user.email!,
              name: '데모 사용자',
              updated_at: new Date().toISOString()
            })
        }
      }
      
      router.push('/')
    } catch (err: any) {
      console.error('데모 로그인 실패:', err)
      setError(err.message || '데모 로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            계정에 로그인하여 서비스를 이용하세요
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <button
            onClick={handleLinkedInLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : 'LinkedIn으로 로그인'}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">또는</span>
            </div>
          </div>
          
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '데모로 로그인'}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            로그인하면{' '}
            <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
              이용약관
            </a>
            과{' '}
            <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}