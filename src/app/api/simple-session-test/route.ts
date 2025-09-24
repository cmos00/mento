import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Simple Session Test] 요청 시작')
    
    // 쿠키에서 세션 토큰 확인
    const cookies = request.cookies
    console.log('🔍 [Simple Session Test] 쿠키들:', Object.keys(cookies))
    
    const sessionToken = cookies.get('next-auth.session-token')
    console.log('🔍 [Simple Session Test] 세션 토큰 존재:', !!sessionToken)
    
    if (sessionToken) {
      console.log('🔍 [Simple Session Test] 세션 토큰 값:', sessionToken.value.substring(0, 20) + '...')
    }
    
    return NextResponse.json({
      success: true,
      message: '간단한 세션 테스트',
      cookies: Object.keys(cookies),
      hasSessionToken: !!sessionToken,
      sessionTokenPreview: sessionToken ? sessionToken.value.substring(0, 20) + '...' : null
    })
  } catch (error) {
    console.error('Simple Session Test 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
