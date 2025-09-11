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
export async function deleteFeedback(id: string): Promise<boolean> {
  if (!supabase) {
    console.error('Supabase client가 초기화되지 않았습니다.')
    return false
  }

  try {
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('피드백 삭제 오류:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('피드백 삭제 중 예외:', err)
    return false
  }
}
