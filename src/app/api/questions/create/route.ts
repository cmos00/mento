import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { questionData, userInfo } = await request.json()
    
    // Supabase 환경 변수 검증
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.' },
        { status: 500 }
      )
    }
    
    // 서버 사이드 Supabase 클라이언트 (RLS 우회)
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
    
    // 사용자 정보 생성/업데이트 (서버 사이드에서 RLS 우회)
    if (userInfo) {
      try {
        console.log('받은 userInfo:', userInfo)
        
        // userInfo.id가 없으면 UUID 생성
        const userId = userInfo.id || crypto.randomUUID()
        console.log('사용할 userId:', userId)
        
        // 기존 사용자가 있는지 확인
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', userInfo.email)
          .single()

        const finalUserId = existingUser?.id || userId
        console.log('최종 사용할 userId:', finalUserId)

        const { error: userError } = await supabaseAdmin
          .from('users')
          .upsert([{
            id: finalUserId,
            email: userInfo.email,
            name: userInfo.name,
            company: userInfo.isDemo ? '데모 회사' : undefined,
            position: userInfo.isDemo ? '데모 직책' : undefined
          }], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })

        if (userError) {
          console.error('사용자 생성/업데이트 오류:', userError)
          return NextResponse.json(
            { error: `사용자 생성 실패: ${userError.message}` },
            { status: 500 }
          )
        }
      } catch (userError) {
        console.error('사용자 생성/업데이트 중 예외 발생:', userError)
        return NextResponse.json(
          { error: '사용자 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }
    }

    // 질문 생성
    try {
      // 사용자 생성 단계에서 결정된 finalUserId 재사용
      let questionUserId = userInfo?.id || crypto.randomUUID()
      
      if (userInfo) {
        // 기존 사용자가 있는지 확인 (사용자 생성 단계와 동일한 로직)
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', userInfo.email)
          .single()
        questionUserId = existingUser?.id || questionUserId
      }
      
      const finalQuestionData = {
        ...questionData,
        user_id: questionUserId
      }
      
      console.log('생성할 질문 데이터:', finalQuestionData)
      
      const { data, error } = await supabaseAdmin
        .from('questions')
        .insert([finalQuestionData])
        .select()
        .single()

      if (error) {
        console.error('질문 생성 오류:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ data, error: null })
    } catch (dbError) {
      console.error('질문 생성 중 예외 발생:', dbError)
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
