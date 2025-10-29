import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 1. 세션 확인
    const session = await getServerSession(authOptions)
    
    console.log('📊 [Test Update] 세션 정보:', {
      hasSession: !!session,
      user: session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })

    if (!session || !session.user) {
      return NextResponse.json({
        error: '세션이 없습니다',
        hasSession: false,
        recommendation: '로그인이 필요합니다'
      }, { status: 401 })
    }

    // 2. Supabase 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        error: 'Supabase 환경 변수가 없습니다',
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }, { status: 500 })
    }

    // 3. Supabase 클라이언트 생성
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

    // 4. 요청 본문 파싱
    const body = await request.json()
    const newValue = body.mentoring_enabled

    console.log('📝 [Test Update] 업데이트 요청:', {
      email: session.user.email,
      currentValue: body.currentValue,
      newValue: newValue
    })

    // 5. 기존 사용자 찾기
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from('users')
      .select('id, email, mentoring_enabled')
      .eq('email', session.user.email)
      .single()

    console.log('🔍 [Test Update] 사용자 조회:', {
      success: !findError,
      user: existingUser,
      error: findError
    })

    if (findError || !existingUser) {
      return NextResponse.json({
        error: '사용자를 찾을 수 없습니다',
        email: session.user.email,
        findError: findError,
        recommendation: 'users 테이블에 해당 이메일이 존재하는지 확인하세요'
      }, { status: 404 })
    }

    // 6. 업데이트 시도
    const updateData = {
      mentoring_enabled: newValue,
      updated_at: new Date().toISOString()
    }

    console.log('🔄 [Test Update] 업데이트 시도:', {
      userId: existingUser.id,
      updateData
    })

    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', existingUser.id)
      .select()

    console.log('📊 [Test Update] 업데이트 결과:', {
      success: !updateError,
      data: updatedData,
      error: updateError
    })

    if (updateError) {
      return NextResponse.json({
        error: '업데이트 실패',
        details: {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        },
        userId: existingUser.id,
        updateData
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: '업데이트 성공',
      before: {
        mentoring_enabled: existingUser.mentoring_enabled
      },
      after: updatedData?.[0] || null
    })

  } catch (error: any) {
    console.error('❌ [Test Update] 예외 발생:', error)
    return NextResponse.json({
      error: '예외 발생',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

