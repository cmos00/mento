import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [Debug Feedback Update] 디버깅 시작')
    
    const { feedbackId, userId, content } = await request.json()
    
    console.log('🔍 [Debug Feedback Update] 요청 데이터:', { 
      feedbackId, 
      userId, 
      content,
      contentLength: content?.length 
    })
    
    if (!supabase) {
      console.error('❌ [Debug Feedback Update] Supabase client가 초기화되지 않았습니다.')
      return NextResponse.json({ error: 'Supabase client 초기화 실패' }, { status: 500 })
    }

    // 1. 답변 존재 여부 확인
    console.log('🔍 [Debug Feedback Update] 답변 조회 시작')
    const { data: feedback, error: fetchError } = await supabase
      .from('feedbacks')
      .select('id, user_id, content, created_at, updated_at')
      .eq('id', feedbackId)
      .single()

    if (fetchError) {
      console.error('❌ [Debug Feedback Update] 답변 조회 오류:', fetchError)
      return NextResponse.json({ 
        error: '답변 조회 실패', 
        details: fetchError 
      }, { status: 400 })
    }

    console.log('🔍 [Debug Feedback Update] 답변 조회 성공:', {
      id: feedback.id,
      userId: feedback.user_id,
      requestUserId: userId,
      isOwner: feedback.user_id === userId,
      currentContent: feedback.content,
      newContent: content
    })

    // 2. 권한 확인
    if (feedback.user_id !== userId) {
      console.error('❌ [Debug Feedback Update] 권한 없음')
      return NextResponse.json({ 
        error: '권한 없음', 
        details: {
          feedbackUserId: feedback.user_id,
          requestUserId: userId,
          match: feedback.user_id === userId
        }
      }, { status: 403 })
    }

    // 3. 업데이트 시도
    console.log('🔍 [Debug Feedback Update] 업데이트 시도 시작')
    const { data: updatedData, error: updateError } = await supabase
      .from('feedbacks')
      .update({ content: content })
      .eq('id', feedbackId)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ [Debug Feedback Update] 업데이트 오류:', updateError)
      return NextResponse.json({ 
        error: '업데이트 실패', 
        details: {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        }
      }, { status: 400 })
    }

    console.log('✅ [Debug Feedback Update] 업데이트 성공:', updatedData)
    return NextResponse.json({ 
      success: true, 
      data: updatedData 
    })

  } catch (error) {
    console.error('❌ [Debug Feedback Update] 예외 발생:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', details: error },
      { status: 500 }
    )
  }
}
