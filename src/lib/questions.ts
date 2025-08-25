import { supabase } from './supabase'
import { Database } from './supabase'

export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type QuestionUpdate = Database['public']['Tables']['questions']['Update']

// 질문 생성
export async function createQuestion(questionData: Omit<QuestionInsert, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([questionData])
      .select()
      .single()

    if (error) {
      console.error('질문 생성 오류:', error)
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    console.error('질문 생성 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 모든 질문 조회 (최신순)
export async function getAllQuestions() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        users!questions_user_id_fkey (
          id,
          name,
          avatar_url,
          company,
          position
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('질문 조회 오류:', error)
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    console.error('질문 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 특정 질문 조회
export async function getQuestionById(id: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        users!questions_user_id_fkey (
          id,
          name,
          avatar_url,
          company,
          position
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('질문 조회 오류:', error)
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    console.error('질문 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 카테고리별 질문 조회
export async function getQuestionsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        users!questions_user_id_fkey (
          id,
          name,
          avatar_url,
          company,
          position
        )
      `)
      .eq('category', category)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('카테고리별 질문 조회 오류:', error)
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    console.error('카테고리별 질문 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 사용자별 질문 조회
export async function getQuestionsByUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        users!questions_user_id_fkey (
          id,
          name,
          avatar_url,
          company,
          position
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('사용자별 질문 조회 오류:', error)
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    console.error('사용자별 질문 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 질문 조회수 증가
export async function incrementQuestionViews(id: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .update({ views: supabase.rpc('increment', { row_id: id, table_name: 'questions', column_name: 'views' }) })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('조회수 증가 오류:', error)
      // 조회수 증가 실패해도 에러를 던지지 않음 (사용자 경험상)
      return { data: null, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error('조회수 증가 중 예외 발생:', error)
    return { data: null, error: null }
  }
}
