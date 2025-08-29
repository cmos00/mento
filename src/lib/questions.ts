import { supabase } from './supabase'
import { Database } from './supabase'

export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type QuestionUpdate = Database['public']['Tables']['questions']['Update']

export type QuestionWithAuthor = Question & {
  author: Database['public']['Tables']['users']['Row']
}

// 질문 생성
export async function createQuestion(questionData: Omit<QuestionInsert, 'id' | 'created_at' | 'updated_at'>, userInfo?: { name: string; email: string; isDemo?: boolean }) {
  try {
    // 사용자 정보가 제공된 경우, 먼저 users 테이블에 사용자를 생성하거나 업데이트
    if (userInfo) {
      console.log('사용자 정보 생성/업데이트 중...', { userId: questionData.user_id, userInfo })
      
      const { error: userError } = await supabase
        .from('users')
        .upsert([{
          id: questionData.user_id,
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
        throw new Error(`사용자 생성 실패: ${userError.message}`)
      }
      
      console.log('사용자 정보 생성/업데이트 성공')
    }

    // 질문 생성
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
      .eq('status', 'open')
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
      .eq('status', 'open')
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
      .eq('status', 'open')
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
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('사용자별 질문 조회 중 예외 발생:', error)
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    console.error('사용자별 질문 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 질문 조회수 증가 (현재는 로그만 출력)
export async function incrementQuestionViews(id: string) {
  try {
    // 조회수 증가 기능은 향후 구현 예정
    console.log(`질문 ${id} 조회됨`)
    return { data: null, error: null }
  } catch (error) {
    console.error('조회수 증가 중 예외 발생:', error)
    return { data: null, error: null }
  }
}
