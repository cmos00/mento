import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Dynamic route로 설정하여 정적 렌더링 방지
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Debug Session] 세션 디버깅 시작')
    
    const session = await getServerSession(authOptions)
    
    console.log('📋 [Debug Session] 서버 세션:', JSON.stringify(session, null, 2))
    
    return NextResponse.json({
      success: true,
      session: session,
      timestamp: new Date().toISOString(),
      debug: {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userName: session?.user?.name,
        userEmail: session?.user?.email,
        provider: (session?.user as any)?.provider,
        isDemo: (session?.user as any)?.isDemo
      }
    })
  } catch (error) {
    console.error('❌ [Debug Session] 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
