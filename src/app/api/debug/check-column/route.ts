import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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

    // 1. users 테이블에서 샘플 데이터 조회
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    if (userError) {
      return NextResponse.json({
        error: 'users 테이블 조회 실패',
        details: userError,
        recommendation: 'Supabase에서 users 테이블이 존재하는지 확인하세요.'
      }, { status: 500 })
    }

    // 2. 첫 번째 사용자의 컬럼 확인
    const availableColumns = userData && userData.length > 0 
      ? Object.keys(userData[0]) 
      : []

    const hasMentoringColumn = availableColumns.includes('mentoring_enabled')

    // 3. mentoring_enabled 컬럼으로 조회 시도
    let mentoringTest = null
    let mentoringError = null

    if (hasMentoringColumn) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, mentoring_enabled')
        .limit(5)
      
      mentoringTest = data
      mentoringError = error
    }

    return NextResponse.json({
      success: true,
      checks: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        availableColumns,
        hasMentoringColumn,
        mentoringColumnTest: {
          success: !mentoringError,
          data: mentoringTest,
          error: mentoringError
        },
        sampleUser: userData?.[0] || null
      },
      recommendation: hasMentoringColumn 
        ? '✅ mentoring_enabled 컬럼이 존재합니다.'
        : '❌ mentoring_enabled 컬럼이 없습니다. Supabase SQL Editor에서 다음을 실행하세요:\n\nALTER TABLE users ADD COLUMN IF NOT EXISTS mentoring_enabled BOOLEAN DEFAULT false;\nCREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled ON users(mentoring_enabled);'
    })

  } catch (error: any) {
    console.error('❌ [Column Check] 오류:', error)
    return NextResponse.json(
      { 
        error: '컬럼 체크 중 오류 발생', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}

