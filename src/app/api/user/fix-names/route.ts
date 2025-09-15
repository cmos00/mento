import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    console.log('🔧 [Fix Names] 사용자 이름 수정 시작')

    // 모든 사용자 조회
    const { data: users, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, name')
      .not('name', 'eq', null)

    if (fetchError) {
      console.error('❌ [Fix Names] 사용자 조회 오류:', fetchError)
      return NextResponse.json(
        { error: `사용자 조회 실패: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        message: '수정할 사용자가 없습니다.',
        updated: 0
      })
    }

    let updateCount = 0
    
    for (const user of users) {
      const currentName = user.name
      
      // 이미 성 이름 순인지 확인 (한글 성이 뒤에 있는 경우)
      const parts = currentName.split(' ')
      if (parts.length === 2) {
        const [first, last] = parts
        
        // 영어 이름 + 한글 성 패턴 감지 (예: "동현 김" → "김 동현")
        const koreanRegex = /[가-힣]/
        const isFirstKorean = koreanRegex.test(first)
        const isLastKorean = koreanRegex.test(last)
        
        if (!isFirstKorean && isLastKorean) {
          // 첫 번째가 영어, 두 번째가 한글인 경우 순서 바꿈
          const newName = `${last} ${first}`
          
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ name: newName })
            .eq('id', user.id)
          
          if (updateError) {
            console.error(`❌ [Fix Names] ${user.id} 업데이트 실패:`, updateError)
          } else {
            console.log(`✅ [Fix Names] ${currentName} → ${newName}`)
            updateCount++
          }
        }
      }
    }

    console.log(`🎉 [Fix Names] 완료: ${updateCount}명 업데이트`)
    return NextResponse.json({ 
      message: `${updateCount}명의 사용자 이름이 수정되었습니다.`,
      updated: updateCount,
      total: users.length
    })

  } catch (error) {
    console.error('❌ [Fix Names] API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
