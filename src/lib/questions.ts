import { Database, supabase } from './supabase'

export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type QuestionUpdate = Database['public']['Tables']['questions']['Update']

export type QuestionWithAuthor = Question & {
  author: Database['public']['Tables']['users']['Row']
}

// 질문 생성
export async function createQuestion(questionData: Omit<QuestionInsert, 'id' | 'created_at' | 'updated_at'>, userInfo?: { name: string; email: string; isLinkedIn?: boolean }) {
  try {
    console.log('API Route를 통한 질문 생성 시작...', { userId: questionData.user_id, userInfo })
    
    // API Route를 통해 서버 사이드에서 처리
    const response = await fetch('/api/questions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionData, userInfo }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || '질문 생성 중 오류가 발생했습니다.')
    }

    return result
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
      console.error('사용자별 질문 조회 중 예외 발생:', error)
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
      .update({ views: supabase.sql`views + 1` })
      .eq('id', id)
      .select('views')

    if (error) {
      console.error('조회수 증가 오류:', error)
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    console.error('조회수 증가 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 질문별 답변 수 조회
export async function getAnswerCountByQuestionId(questionId: string) {
  try {
    const { count, error } = await supabase
      .from('feedbacks')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId)

    if (error) {
      console.error('답변 수 조회 오류:', error)
      throw new Error(error.message)
    }

    return { data: count || 0, error: null }
  } catch (error) {
    console.error('답변 수 조회 중 예외 발생:', error)
    return { data: 0, error: error as Error }
  }
}

// 사용자 통계 조회
export async function getUserStats(userId: string) {
  try {
    // 질문 수 조회
    const { count: questionsCount, error: questionsError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active')

    if (questionsError) {
      console.error('질문 수 조회 오류:', questionsError)
      throw new Error(questionsError.message)
    }

    // 답변 수 조회
    const { count: answersCount, error: answersError } = await supabase
      .from('feedbacks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (answersError) {
      console.error('답변 수 조회 오류:', answersError)
      throw new Error(answersError.message)
    }

    // 멘토링 세션 수 (현재는 피드백 수로 대체)
    const mentoringSessions = answersCount || 0

    return {
      data: {
        questionsAsked: questionsCount || 0,
        answersGiven: answersCount || 0,
        mentoringSessions: mentoringSessions,
      },
      error: null
    }
  } catch (error) {
    console.error('사용자 통계 조회 중 예외 발생:', error)
    return { 
      data: { questionsAsked: 0, answersGiven: 0, mentoringSessions: 0 }, 
      error: error as Error 
    }
  }
}

// 질문과 답변 수를 함께 조회
export async function getAllQuestionsWithStats() {
  try {
    const { data: questions, error } = await supabase
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

    // 각 질문별로 답변 수 조회
    const questionsWithStats = await Promise.all(
      (questions || []).map(async (question) => {
        const { data: answerCount } = await getAnswerCountByQuestionId(question.id)
        return {
          ...question,
          answerCount: answerCount || 0
        }
      })
    )

    return { data: questionsWithStats, error: null }
  } catch (error) {
    console.error('질문 및 통계 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}
