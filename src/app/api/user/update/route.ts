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

    // 요청 본문 파싱
    const body = await request.json()

    console.log('🔄 [User Update] 사용자 정보 업데이트 시작:', {
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      provider: (session.user as any)?.provider,
      mentoringEnabled: body.mentoring_enabled
    })

    // 기존 사용자 찾기
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!existingUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 업데이트할 데이터 구성
    const updateData: any = {
      name: session.user.name,
      avatar_url: session.user.image || null,
      image: session.user.image || null,
      updated_at: new Date().toISOString()
    }

    // mentoring_enabled가 제공된 경우 추가
    if (typeof body.mentoring_enabled === 'boolean') {
      updateData.mentoring_enabled = body.mentoring_enabled
    }

    // 사용자 정보 업데이트
    const { error: userError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', existingUser.id)

    if (userError) {
      console.error('❌ [User Update] 사용자 업데이트 오류:', userError)
      return NextResponse.json(
        { error: `사용자 업데이트 실패: ${userError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ [User Update] 사용자 정보 업데이트 완료')
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ [User Update] API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
