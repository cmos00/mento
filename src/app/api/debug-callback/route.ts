import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Dynamic route로 설정하여 정적 렌더링 방지
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [OAuth Callback Debug] LinkedIn 콜백 처리 상태 확인')
    
    const session = await getServerSession(authOptions)
    
    console.log('📋 [OAuth Callback Debug] 현재 세션:', JSON.stringify(session, null, 2))
    
    // URL 파라미터 확인
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    console.log('🔍 [OAuth Callback Debug] URL 파라미터:', {
      hasCode: !!code,
      hasState: !!state,
      hasError: !!error,
      codeLength: code?.length,
      stateLength: state?.length
    })
    
    return NextResponse.json({
      success: true,
      callbackStatus: {
        hasSession: !!session,
        sessionUser: session?.user,
        urlParams: {
          hasCode: !!code,
          hasState: !!state,
          hasError: !!error,
          codeLength: code?.length,
          stateLength: state?.length
        }
      },
      diagnosis: {
        step1: 'LinkedIn에서 인증 코드를 성공적으로 받아왔습니다 (code 파라미터 존재)',
        step2: 'NextAuth.js가 콜백을 처리하는 과정에서 문제가 발생했습니다',
        step3: '브라우저 개발자 도구 콘솔에서 상세한 로그를 확인하세요',
        step4: '특히 LinkedIn 프로필 함수와 signIn 콜백의 로그를 확인하세요'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [OAuth Callback Debug] 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
