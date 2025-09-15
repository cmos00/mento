import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    // Supabase 환경 변수 검증
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase 환경 변수가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 서버 사이드 Supabase 클라이언트
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

    console.log('🗑️ [User Delete] 사용자 탈퇴 처리 시작:', {
      userEmail: session.user.email
    })

    // 기존 사용자 찾기
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, is_deleted')
      .eq('email', session.user.email)
      .single()

    if (!existingUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (existingUser.is_deleted) {
      return NextResponse.json(
        { error: '이미 탈퇴한 사용자입니다.' },
        { status: 400 }
      )
    }

    // 사용자를 탈퇴 처리 (실제 삭제하지 않고 플래그만 설정)
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        // 개인정보 제거
        name: '탈퇴한 사용자',
        email: `deleted_${existingUser.id}@deleted.local`,
        avatar_url: null,
        image: null,
        linkedin_url: null,
        website: null,
        bio: null,
        company: null,
        position: null,
        experience: null,
        skills: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingUser.id)

    if (deleteError) {
      console.error('❌ [User Delete] 사용자 탈퇴 처리 오류:', deleteError)
      return NextResponse.json(
        { error: `사용자 탈퇴 처리 실패: ${deleteError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ [User Delete] 사용자 탈퇴 처리 완료')
    return NextResponse.json({ 
      success: true,
      message: '사용자 탈퇴 처리가 완료되었습니다.'
    })

  } catch (error) {
    console.error('❌ [User Delete] API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
