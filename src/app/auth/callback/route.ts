import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    try {
      // Supabase Auth 콜백 처리
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth 콜백 처리 실패:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=callback_error`)
      }

      // 사용자 정보가 있으면 users 테이블에 저장/업데이트
      if (data.user) {
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'Unknown User',
            avatar_url: data.user.user_metadata?.avatar_url,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (upsertError) {
          console.error('사용자 정보 저장 실패:', upsertError)
          // 에러가 있어도 로그인은 성공으로 처리
        }
      }

      // 성공적으로 로그인된 경우 리다이렉트
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (error) {
      console.error('Auth 콜백 처리 중 예외:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=callback_exception`)
    }
  }

  // 코드가 없는 경우 에러 페이지로 리다이렉트
  return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=no_code`)
}
