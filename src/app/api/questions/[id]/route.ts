import { authOptions } from '@/lib/auth'
import { deleteQuestion, updateQuestion } from '@/lib/questions'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const questionId = params.id
    const { title, content, category, actualUserId } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // actualUserId가 제공되면 사용, 아니면 session.user.id 사용
    const userId = actualUserId || session.user.id

    const result = await updateQuestion(
      questionId,
      { title, content, category },
      userId
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('질문 수정 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🗑️ [Question Delete] 세션 정보:', {
      hasSession: !!session,
      user: session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // session.user.id가 없으면 email로 사용자 조회
    let userId = session.user.id
    
    if (!userId && session.user.email) {
      console.log('🔍 [Question Delete] user.id가 없어서 email로 조회:', session.user.email)
      
      // Supabase에서 사용자 ID 조회
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()
      
      if (error || !user) {
        console.error('❌ [Question Delete] 사용자 조회 실패:', error)
        return NextResponse.json(
          { error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        )
      }
      
      userId = user.id
      console.log('✅ [Question Delete] 사용자 ID 조회 성공:', userId)
    }

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID를 확인할 수 없습니다.' },
        { status: 401 }
      )
    }

    const questionId = params.id
    console.log('🗑️ [Question Delete] 삭제 시도:', { questionId, userId })

    const result = await deleteQuestion(questionId, userId)

    if (!result.success) {
      console.error('❌ [Question Delete] 삭제 실패:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    console.log('✅ [Question Delete] 삭제 성공')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ [Question Delete] API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
