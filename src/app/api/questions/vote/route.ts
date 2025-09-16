import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { questionId } = await request.json()
    
    if (!questionId) {
      return NextResponse.json(
        { error: '질문 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase 환경 변수가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 사용자 정보 조회
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 기존 투표 확인
    const { data: existingVote } = await supabaseAdmin
      .from('question_votes')
      .select('id')
      .eq('question_id', questionId)
      .eq('user_id', user.id)
      .single()

    let isVoted = false

    if (existingVote) {
      // 투표 취소
      const { error } = await supabaseAdmin
        .from('question_votes')
        .delete()
        .eq('question_id', questionId)
        .eq('user_id', user.id)

      if (error) {
        console.error('투표 취소 오류:', error)
        return NextResponse.json(
          { error: '투표 취소에 실패했습니다.' },
          { status: 500 }
        )
      }
      isVoted = false
    } else {
      // 새 투표 추가
      const { error } = await supabaseAdmin
        .from('question_votes')
        .insert([{
          question_id: questionId,
          user_id: user.id
        }])

      if (error) {
        console.error('투표 추가 오류:', error)
        return NextResponse.json(
          { error: '투표에 실패했습니다.' },
          { status: 500 }
        )
      }
      isVoted = true
    }

    // 총 투표 수 조회
    const { count: voteCount } = await supabaseAdmin
      .from('question_votes')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId)

    // 질문 통계 업데이트 (24시간 내 투표 수)
    const { count: votes24h } = await supabaseAdmin
      .from('question_votes')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // question_stats 업데이트
    const { error: statsError } = await supabaseAdmin
      .from('question_stats')
      .upsert([{
        question_id: questionId,
        votes_24h: votes24h || 0,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'question_id'
      })

    if (statsError) {
      console.error('통계 업데이트 오류:', statsError)
    }

    return NextResponse.json({
      success: true,
      isVoted,
      voteCount: voteCount || 0,
      votes24h: votes24h || 0
    })

  } catch (error) {
    console.error('Vote API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
