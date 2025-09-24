import { authOptions } from '@/lib/auth'
import { deleteFeedback, updateFeedback } from '@/lib/feedbacks'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 [Feedback PUT API] 요청 시작:', { feedbackId: params.id })
    
    const session = await getServerSession(authOptions)
    console.log('🔍 [Feedback PUT API] 세션 조회 결과:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })
    
    if (!session?.user?.id) {
      console.log('❌ [Feedback PUT API] 세션이 없거나 사용자 정보가 없음')
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const feedbackId = params.id
    const { content, actualUserId } = await request.json()
    
    console.log('🔍 [Feedback PUT API] 요청 데이터:', {
      feedbackId,
      content: content ? `${content.substring(0, 50)}...` : 'empty',
      actualUserId,
      sessionUserId: session.user.id
    })

    if (!content) {
      return NextResponse.json(
        { error: '내용은 필수입니다.' },
        { status: 400 }
      )
    }

    // actualUserId가 제공되면 사용, 아니면 session.user.id 사용
    const userId = actualUserId || session.user.id
    
    console.log('🔍 [Feedback PUT API] 사용할 userId:', { userId, source: actualUserId ? 'actualUserId' : 'session.user.id' })

    const result = await updateFeedback(feedbackId, { content }, userId)
    
    console.log('🔍 [Feedback PUT API] updateFeedback 결과:', { success: !!result, error: !result })

    if (!result) {
      return NextResponse.json(
        { error: '답변 수정에 실패했습니다.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('답변 수정 API 오류:', error)
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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const feedbackId = params.id

    const result = await deleteFeedback(feedbackId, session.user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('답변 삭제 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
