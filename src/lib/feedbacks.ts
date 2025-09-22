import { updateQuestionStats } from '@/lib/questions'
import { supabase } from '@/lib/supabase'

export interface Feedback {
  id: string
  question_id: string
  user_id: string
  content: string
  examples?: string
  advice?: string
  resources?: string[]
  created_at: string
  updated_at: string
}

export interface FeedbackWithAuthor extends Feedback {
  users: {
    id: string
    name: string
    email: string
    company?: string
    position?: string
    avatar_url?: string
  } | null
}

// supabase 인스턴스는 이미 import되어 있음

// 피드백 생성
export async function createFeedback(feedbackData: Partial<Feedback>): Promise<Feedback | null> {
  if (!supabase) {
    console.error('Supabase client가 초기화되지 않았습니다.')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([feedbackData])
      .select()
      .single()

    if (error) {
      console.error('피드백 생성 오류:', error)
      return null
    }

    // 답변 생성 시 통계 업데이트
    if (data && feedbackData.question_id) {
      updateQuestionStats(feedbackData.question_id, 'answer')
    }

    return data
  } catch (err) {
    console.error('피드백 생성 중 예외:', err)
    return null
  }
}

// 특정 질문의 모든 피드백 가져오기
export async function getFeedbacksByQuestionId(questionId: string): Promise<FeedbackWithAuthor[]> {
  if (!supabase) {
    console.error('Supabase client가 초기화되지 않았습니다.')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        users (
          id,
          name,
          email,
          company,
          position,
          avatar_url
        )
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('피드백 조회 오류:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('피드백 조회 중 예외:', err)
    return []
  }
}

// 사용자별 피드백 가져오기
export async function getFeedbacksByUserId(userId: string): Promise<FeedbackWithAuthor[]> {
  if (!supabase) {
    console.error('Supabase client가 초기화되지 않았습니다.')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        users (
          id,
          name,
          email,
          company,
          position,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('사용자 피드백 조회 오류:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('사용자 피드백 조회 중 예외:', err)
    return []
  }
}

// 피드백 수정
export async function updateFeedback(id: string, updates: Partial<Feedback>): Promise<Feedback | null> {
  if (!supabase) {
    console.error('Supabase client가 초기화되지 않았습니다.')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('피드백 수정 오류:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('피드백 수정 중 예외:', err)
    return null
  }
}

// 피드백 삭제
export async function deleteFeedback(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.error('Supabase client가 초기화되지 않았습니다.')
    return { success: false, error: '데이터베이스 연결 오류' }
  }

  try {
    // 먼저 답변이 존재하고 사용자가 작성자인지 확인
    const { data: feedback, error: fetchError } = await supabase
      .from('feedbacks')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('답변 조회 오류:', fetchError)
      return { success: false, error: '답변을 찾을 수 없습니다.' }
    }

    if (feedback.user_id !== userId) {
      return { success: false, error: '본인이 작성한 답변만 삭제할 수 있습니다.' }
    }

    // 소프트 삭제: 내용을 삭제 메시지로 변경
    const { error } = await supabase
      .from('feedbacks')
      .update({
        content: '삭제된 답변입니다.',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId) // 추가 보안: 사용자 ID도 확인

    if (error) {
      console.error('답변 삭제 오류:', error)
      return { success: false, error: '답변 삭제에 실패했습니다.' }
    }

    return { success: true }
  } catch (err) {
    console.error('답변 삭제 중 예외:', err)
    return { success: false, error: '답변 삭제 중 오류가 발생했습니다.' }
  }
}
