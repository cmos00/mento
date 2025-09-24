import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [Debug Feedback] 디버깅 시작')
    
    const { feedbackId, userId } = await request.json()
    
    console.log('🔍 [Debug Feedback] 요청 데이터:', { feedbackId, userId })
    
    // 직접 SQL 쿼리로 답변 조회
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/feedbacks`, {
      method: 'GET',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      // URL에 쿼리 파라미터 추가
    })
    
    const data = await response.text()
    console.log('🔍 [Debug Feedback] Supabase 응답:', data)
    
    return NextResponse.json({
      success: true,
      message: '디버깅 완료',
      feedbackId,
      userId,
      supabaseResponse: data
    })
  } catch (error) {
    console.error('Debug Feedback 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
