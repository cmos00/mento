import { NextRequest, NextResponse } from 'next/server'

// Dynamic route로 설정하여 정적 렌더링 방지
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [LinkedIn OAuth] 콜백 처리 시작')
    
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    console.log('📋 [LinkedIn OAuth] URL 파라미터:', {
      hasCode: !!code,
      hasState: !!state,
      hasError: !!error,
      codeLength: code?.length,
      stateLength: state?.length
    })
    
    // 오류가 있는 경우
    if (error) {
      console.error('❌ [LinkedIn OAuth] LinkedIn에서 오류 반환:', error)
      return NextResponse.redirect(new URL(`/auth/login?error=${error}`, request.url))
    }
    
    // 인증 코드가 없는 경우
    if (!code) {
      console.error('❌ [LinkedIn OAuth] 인증 코드가 없습니다')
      return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
    }
    
    // LinkedIn에서 액세스 토큰 요청
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`,
      }),
    })
    
    if (!tokenResponse.ok) {
      console.error('❌ [LinkedIn OAuth] 토큰 요청 실패:', tokenResponse.status, tokenResponse.statusText)
      const errorText = await tokenResponse.text()
      console.error('❌ [LinkedIn OAuth] 오류 응답:', errorText)
      return NextResponse.redirect(new URL('/auth/login?error=token_failed', request.url))
    }
    
    const tokenData = await tokenResponse.json()
    console.log('✅ [LinkedIn OAuth] 토큰 받기 성공:', {
      hasAccessToken: !!tokenData.access_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in
    })
    
    // LinkedIn에서 사용자 정보 요청
    const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })
    
    if (!userResponse.ok) {
      console.error('❌ [LinkedIn OAuth] 사용자 정보 요청 실패:', userResponse.status, userResponse.statusText)
      return NextResponse.redirect(new URL('/auth/login?error=userinfo_failed', request.url))
    }
    
    const userData = await userResponse.json()
    console.log('✅ [LinkedIn OAuth] 사용자 정보 받기 성공:', {
      id: userData.sub,
      name: userData.name,
      email: userData.email,
      picture: userData.picture
    })
    
    // 세션 생성 (간단한 JWT 토큰 사용)
    const sessionData = {
      user: {
        id: userData.sub,
        name: userData.name || 'LinkedIn 사용자',
        email: userData.email || `${userData.sub}@linkedin.local`,
        image: userData.picture || null,
        provider: 'linkedin'
      },
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000)
    }
    
    // 세션을 쿠키에 저장
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // 간단한 세션 쿠키 설정 (실제로는 더 안전한 방법 사용 권장)
    response.cookies.set('linkedin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in
    })
    
    console.log('✅ [LinkedIn OAuth] 로그인 성공, 메인페이지로 리다이렉트')
    return response
    
  } catch (error) {
    console.error('❌ [LinkedIn OAuth] 콜백 처리 오류:', error)
    return NextResponse.redirect(new URL('/auth/login?error=callback_error', request.url))
  }
}
