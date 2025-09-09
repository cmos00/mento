import { NextRequest, NextResponse } from 'next/server'

// Dynamic route로 설정하여 정적 렌더링 방지
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [Logout] 로그아웃 처리 시작')
    
    const response = NextResponse.json({
      success: true,
      message: '로그아웃 성공'
    })
    
    // 세션 쿠키 삭제
    response.cookies.set('linkedin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // 즉시 만료
    })
    
    console.log('✅ [Logout] 로그아웃 완료')
    return response
    
  } catch (error) {
    console.error('❌ [Logout] 로그아웃 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
