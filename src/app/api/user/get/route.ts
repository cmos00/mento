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

    console.log('📥 [User Get] 사용자 정보 조회 시작:', {
      userEmail: session.user.email
    })

    // 사용자 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (userError) {
      console.error('❌ [User Get] 사용자 조회 오류:', userError)
      return NextResponse.json(
        { error: `사용자 조회 실패: ${userError.message}` },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    console.log('✅ [User Get] 사용자 정보 조회 완료:', {
      hasImage: !!user.image,
      hasAvatarUrl: !!user.avatar_url,
      imageUrl: user.image,
      avatarUrl: user.avatar_url
    })

    return NextResponse.json({ 
      user: user,
      success: true 
    })

  } catch (error) {
    console.error('❌ [User Get] API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
