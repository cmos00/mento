import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 세션 초기화 요청')
    
    // 응답 헤더에 쿠키 삭제 명령 추가
    const response = NextResponse.json({ 
      success: true, 
      message: '세션이 초기화되었습니다.' 
    })
    
    // NextAuth 관련 쿠키들 삭제
    const cookiesToDelete = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token'
    ]
    
    cookiesToDelete.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })
    
    console.log('✅ 세션 초기화 완료')
    return response
    
  } catch (error) {
    console.error('❌ 세션 초기화 오류:', error)
    return NextResponse.json(
      { success: false, error: '세션 초기화 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
