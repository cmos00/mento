import { NextRequest, NextResponse } from 'next/server'

// Dynamic route로 설정하여 정적 렌더링 방지
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [OAuth Debug] OAuthCallback 오류 진단 시작')
    
    const linkedinClientId = process.env.LINKEDIN_CLIENT_ID
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const nextAuthSecret = process.env.NEXTAUTH_SECRET
    
    // 현재 설정된 콜백 URI
    const callbackUri = `${nextAuthUrl}/api/auth/callback/linkedin`
    
    // LinkedIn OAuth URL 생성
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(callbackUri)}&scope=openid%20profile%20email&state=test`
    
    console.log('📋 [OAuth Debug] 현재 설정:', {
      hasClientId: !!linkedinClientId,
      hasNextAuthUrl: !!nextAuthUrl,
      hasNextAuthSecret: !!nextAuthSecret,
      callbackUri: callbackUri,
      linkedinAuthUrl: linkedinAuthUrl
    })
    
    return NextResponse.json({
      success: true,
      diagnosis: {
        environment: {
          hasClientId: !!linkedinClientId,
          hasNextAuthUrl: !!nextAuthUrl,
          hasNextAuthSecret: !!nextAuthSecret,
          nextAuthUrl: nextAuthUrl,
          clientId: linkedinClientId?.substring(0, 8) + '...' // 보안을 위해 일부만 표시
        },
        callbackUri: callbackUri,
        linkedinAuthUrl: linkedinAuthUrl,
        steps: [
          '1. LinkedIn Developer Portal에서 다음 URL이 Authorized redirect URLs에 있는지 확인:',
          callbackUri,
          '2. LinkedIn Developer Portal URL: https://www.linkedin.com/developers/',
          '3. 앱 선택 → Auth 탭 → Authorized redirect URLs 섹션',
          '4. 위의 callbackUri가 정확히 추가되어 있는지 확인',
          '5. 설정 저장 후 LinkedIn 로그인 재시도'
        ],
        commonIssues: [
          'LinkedIn Developer Portal에 올바른 리다이렉트 URI가 설정되지 않음',
          'LinkedIn 앱의 권한 설정 문제',
          'LinkedIn OAuth 앱이 비활성화됨',
          'Client ID/Secret 불일치',
          'NextAuth.js 콜백 처리 중 예외 발생'
        ]
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [OAuth Debug] 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
