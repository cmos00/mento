import { NextRequest, NextResponse } from 'next/server'

// Dynamic route로 설정하여 정적 렌더링 방지
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Session Check] 세션 확인 시작')
    
    const sessionCookie = request.cookies.get('linkedin_session')
    
    if (!sessionCookie) {
      console.log('❌ [Session Check] 세션 쿠키가 없습니다')
      return NextResponse.json({
        success: true,
        session: null,
        isAuthenticated: false
      })
    }
    
    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (error) {
      console.error('❌ [Session Check] 세션 쿠키 파싱 오류:', error)
      return NextResponse.json({
        success: true,
        session: null,
        isAuthenticated: false
      })
    }
    
    // 세션 만료 확인
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      console.log('❌ [Session Check] 세션이 만료되었습니다')
      return NextResponse.json({
        success: true,
        session: null,
        isAuthenticated: false
      })
    }
    
    console.log('✅ [Session Check] 유효한 세션 확인:', {
      userId: sessionData.user?.id,
      userName: sessionData.user?.name,
      userEmail: sessionData.user?.email,
      provider: sessionData.user?.provider
    })
    
    return NextResponse.json({
      success: true,
      session: sessionData,
      isAuthenticated: true,
      user: sessionData.user
    })
    
  } catch (error) {
    console.error('❌ [Session Check] 세션 확인 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      session: null,
      isAuthenticated: false
    }, { status: 500 })
  }
}
