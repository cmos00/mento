import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { questionId, userId, action } = await request.json()

    if (!questionId || !userId || !action) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // Supabase 서비스 클라이언트 생성 (RLS 우회)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (action === 'like') {
      // 좋아요 추가
      const { error: insertError } = await supabaseAdmin
        .from('question_likes')
        .insert({
          question_id: questionId,
          user_id: userId
        })

      if (insertError) {
        console.error('좋아요 추가 오류:', insertError)
        if (insertError.code === '42P01') {
          return NextResponse.json(
            { error: 'question_likes 테이블이 존재하지 않습니다. 데이터베이스 설정을 확인해주세요.' },
            { status: 500 }
          )
        }
        return NextResponse.json(
          { error: `좋아요 추가에 실패했습니다: ${insertError.message}` },
          { status: 500 }
        )
      }
    } else if (action === 'unlike') {
      // 좋아요 취소
      const { error: deleteError } = await supabaseAdmin
        .from('question_likes')
        .delete()
        .eq('question_id', questionId)
        .eq('user_id', userId)

      if (deleteError) {
        console.error('좋아요 취소 오류:', deleteError)
        return NextResponse.json(
          { error: '좋아요 취소에 실패했습니다.' },
          { status: 500 }
        )
      }
    }

    // 현재 좋아요 수 조회
    const { count, error: countError } = await supabaseAdmin
      .from('question_likes')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId)

    if (countError) {
      console.error('좋아요 수 조회 오류:', countError)
      return NextResponse.json(
        { error: '좋아요 수 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      likeCount: count || 0,
      action
    })

  } catch (error) {
    console.error('좋아요 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const questionId = url.searchParams.get('questionId')
    const userId = url.searchParams.get('userId')

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId가 필요합니다.' },
        { status: 400 }
      )
    }

    // Supabase 서비스 클라이언트 생성
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 좋아요 수 조회
    const { count, error: countError } = await supabaseAdmin
      .from('question_likes')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId)

    if (countError) {
      console.error('좋아요 수 조회 오류:', countError)
      return NextResponse.json(
        { error: '좋아요 수 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 사용자가 좋아요 했는지 확인
    let isLiked = false
    if (userId) {
      const { data: likeData, error: likeError } = await supabaseAdmin
        .from('question_likes')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', userId)
        .single()

      if (!likeError && likeData) {
        isLiked = true
      }
    }

    return NextResponse.json({
      likeCount: count || 0,
      isLiked
    })

  } catch (error) {
    console.error('좋아요 조회 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
