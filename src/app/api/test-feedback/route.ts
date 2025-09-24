import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Test Feedback API] 테스트 요청 시작')
    
    const session = await getServerSession(authOptions)
    console.log('🔍 [Test Feedback API] 세션 조회 결과:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })
    
    return NextResponse.json({
      success: true,
      session: {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      }
    })
  } catch (error) {
    console.error('Test Feedback API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [Test Feedback API] POST 요청 시작')
    
    const session = await getServerSession(authOptions)
    console.log('🔍 [Test Feedback API] 세션 조회 결과:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })
    
    const body = await request.json()
    console.log('🔍 [Test Feedback API] 요청 본문:', body)
    
    if (!session?.user?.id) {
      console.log('❌ [Test Feedback API] 세션이 없거나 사용자 정보가 없음')
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: '테스트 성공',
      session: {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      },
      body: body
    })
  } catch (error) {
    console.error('Test Feedback API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
