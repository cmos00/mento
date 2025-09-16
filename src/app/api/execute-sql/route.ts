import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json()
    
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL 쿼리가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase 환경 변수가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    console.log('🔄 [SQL Execute] SQL 실행 시작:', sql.substring(0, 100) + '...')

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

    // SQL 직접 실행 시도
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ [SQL Execute] 실행 실패:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: error
        },
        { status: 400 }
      )
    }

    console.log('✅ [SQL Execute] 실행 성공')
    
    return NextResponse.json({
      success: true,
      message: 'SQL이 성공적으로 실행되었습니다.',
      data
    })

  } catch (error) {
    console.error('❌ [SQL Execute] API 오류:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'SQL 실행 중 오류가 발생했습니다.',
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
