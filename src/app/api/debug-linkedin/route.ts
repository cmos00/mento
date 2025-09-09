import { NextRequest, NextResponse } from 'next/server'

// Dynamic route로 설정하여 정적 렌더링 방지
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [LinkedIn Debug] LinkedIn 설정 확인 시작')
    
    const linkedinClientId = process.env.LINKEDIN_CLIENT_ID
    const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const nextAuthSecret = process.env.NEXTAUTH_SECRET
    
    // LinkedIn OAuth URL 생성 테스트
    const redirectUri = `${nextAuthUrl}/api/auth/callback/linkedin`
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&state=test`
    
    console.log('📋 [LinkedIn Debug] 설정 정보:', {
      hasClientId: !!linkedinClientId,
      hasClientSecret: !!linkedinClientSecret,
      hasNextAuthUrl: !!nextAuthUrl,
      hasNextAuthSecret: !!nextAuthSecret,
      redirectUri: redirectUri,
      linkedinAuthUrl: linkedinAuthUrl
    })
    
    return NextResponse.json({
      success: true,
      config: {
        hasClientId: !!linkedinClientId,
        hasClientSecret: !!linkedinClientSecret,
        hasNextAuthUrl: !!nextAuthUrl,
        hasNextAuthSecret: !!nextAuthSecret,
        redirectUri: redirectUri,
        linkedinAuthUrl: linkedinAuthUrl,
        clientId: linkedinClientId?.substring(0, 8) + '...' // 보안을 위해 일부만 표시
      },
      instructions: {
        step1: 'LinkedIn Developer Portal에서 다음 URL을 Authorized redirect URLs에 추가하세요:',
        redirectUrl: redirectUri,
        step2: 'LinkedIn Developer Portal URL: https://www.linkedin.com/developers/',
        step3: '앱 선택 → Auth 탭 → Authorized redirect URLs 섹션'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [LinkedIn Debug] 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
