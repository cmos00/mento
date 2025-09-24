import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Session Debug] 세션 디버깅 시작')
    
    // 쿠키 정보
    const cookies = request.cookies
    const sessionToken = cookies.get('next-auth.session-token')
    
    console.log('🔍 [Session Debug] 쿠키 정보:', {
      allCookies: Object.keys(cookies),
      hasSessionToken: !!sessionToken,
      sessionTokenValue: sessionToken ? sessionToken.value.substring(0, 50) + '...' : null
    })
    
    // NextAuth 세션 조회
    const session = await getServerSession(authOptions)
    
    console.log('🔍 [Session Debug] NextAuth 세션:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userName: session?.user?.name
    })
    
    // 환경 변수 확인
    const envInfo = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV
    }
    
    console.log('🔍 [Session Debug] 환경 변수:', envInfo)
    
    return NextResponse.json({
      success: true,
      message: '세션 디버깅 완료',
      cookies: {
        allCookies: Object.keys(cookies),
        hasSessionToken: !!sessionToken,
        sessionTokenPreview: sessionToken ? sessionToken.value.substring(0, 50) + '...' : null
      },
      session: {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userName: session?.user?.name
      },
      environment: envInfo
    })
  } catch (error) {
    console.error('Session Debug 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
