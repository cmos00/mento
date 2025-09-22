import { Database, supabase } from './supabase'

export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type QuestionUpdate = Database['public']['Tables']['questions']['Update']

export type QuestionWithAuthor = Question & {
  author: Database['public']['Tables']['users']['Row']
}

// 질문 생성
export async function createQuestion(questionData: Omit<QuestionInsert, 'id' | 'created_at' | 'updated_at'>, userInfo?: { name: string; email: string; image?: string; isLinkedIn?: boolean }) {
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
          image,
          company,
          position,
          linkedin_url
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
    console.log('🔍 [DEBUG] 질문 조회 시작:', id)
    
    // 먼저 질문만 조회해보기
    const { data: basicQuestion, error: basicError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single()

    console.log('🔍 [DEBUG] 기본 질문 조회 결과:', { basicQuestion, basicError })

    if (basicError) {
      console.error('❌ [DEBUG] 기본 질문 조회 실패:', basicError)
      // PGRST116 (not found) 에러도 정상적으로 처리
      if (basicError.code === 'PGRST116') {
        return { data: null, error: new Error('질문을 찾을 수 없습니다.') }
      }
      throw new Error(`기본 질문 조회 실패: ${basicError.message}`)
    }

    // users 조인 포함 조회
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        users!questions_user_id_fkey (
          id,
          name,
          avatar_url,
          image,
          company,
          position,
          linkedin_url
        )
      `)
      .eq('id', id)
      .single()

    console.log('🔍 [DEBUG] 조인 질문 조회 결과:', { data, error })

    if (error) {
      console.error('❌ [DEBUG] 조인 질문 조회 오류:', error)
      // 조인에 실패해도 기본 질문은 반환
      return { data: basicQuestion, error: null }
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
          image,
          company,
          position,
          linkedin_url
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
          image,
          company,
          position,
          linkedin_url
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
    // 먼저 현재 조회수를 가져온 후 1 증가
    const { data: currentQuestion, error: fetchError } = await supabase
      .from('questions')
      .select('views')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('현재 조회수 조회 오류:', fetchError)
      throw new Error(fetchError.message)
    }

    const newViews = (currentQuestion?.views || 0) + 1

    const { data, error } = await supabase
      .from('questions')
      .update({ views: newViews })
      .eq('id', id)
      .select('views')

    if (error) {
      console.error('조회수 증가 오류:', error)
      throw new Error(error.message)
    }

    // 통계 업데이트 (조회수 증가)
    updateQuestionStats(id, 'view')

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

// 페이지네이션으로 질문 조회
export async function getQuestionsWithPagination(page: number = 0, limit: number = 10) {
  try {
    const offset = page * limit
    
    const { data: questions, error } = await supabase
      .from('questions')
              .select(`
                *,
                users!questions_user_id_fkey (
                  id,
                  name,
                  avatar_url,
                  image,
                  company,
                  position
                )
              `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('페이지네이션 질문 조회 오류:', error)
      return { data: null, error }
    }

    // 각 질문의 답변 수 조회
    const questionsWithStats = await Promise.all(
      (questions || []).map(async (question) => {
        const result = await getAnswerCountByQuestionId(question.id)
        return {
          ...question,
          answerCount: result.data || 0
        }
      })
    )

    return { data: questionsWithStats, error: null }
  } catch (error) {
    console.error('페이지네이션 질문 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
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
          image,
          company,
          position,
          linkedin_url
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

// 인기 질문 조회 (120시간 기준 트렌딩 스코어로 정렬)
export async function getTrendingQuestions(limit: number = 3) {
  try {
    // 최근 120시간 동안의 통계를 계산
    const fiveDaysAgo = new Date()
    fiveDaysAgo.setTime(fiveDaysAgo.getTime() - (120 * 60 * 60 * 1000))
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select(`
        *,
        users!questions_user_id_fkey (
          id,
          name,
          avatar_url,
          image,
          company,
          position,
          linkedin_url
        )
      `)
      .eq('status', 'active')
      .gte('created_at', fiveDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('인기 질문 조회 오류:', error)
      throw new Error(error.message)
    }

    // 각 질문별로 트렌딩 스코어 계산
    const questionsWithTrendingScore = await Promise.all(
      (questions || []).map(async (question) => {
        const { data: answerCount } = await getAnswerCountByQuestionId(question.id)
        const { data: recentAnswerCount } = await getRecentAnswerCount(question.id, 120) // 120시간 이내 답변 수
        
        // 트렌딩 스코어 계산 (댓글 > 좋아요 > 조회수 순)
        const viewsWeight = 1        // 조회수: 1배 가중치
        const likesWeight = 3        // 좋아요: 3배 가중치  
        const answersWeight = 5      // 댓글(답변): 5배 가중치
        
        const views = question.views || 0
        const totalAnswers = answerCount || 0
        const likes = 0 // TODO: 좋아요 수 구현 후 실제 값으로 변경
        
        const trendingScore = (views * viewsWeight) + 
                            (likes * likesWeight) + 
                            (totalAnswers * answersWeight)

        return {
          ...question,
          answerCount: totalAnswers,
          recentAnswerCount: recentAnswerCount || 0,
          trendingScore
        }
      })
    )

    // 트렌딩 스코어로 정렬하고 상위 결과만 반환
    const trendingQuestions = questionsWithTrendingScore
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit)

    return { data: trendingQuestions, error: null }
  } catch (error) {
    console.error('인기 질문 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 최근 N시간 이내 답변 수 조회
export async function getRecentAnswerCount(questionId: string, hours: number = 24) {
  try {
    const hoursAgo = new Date()
    hoursAgo.setHours(hoursAgo.getHours() - hours)

    const { count, error } = await supabase
      .from('feedbacks')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId)
      .gte('created_at', hoursAgo.toISOString())

    if (error) {
      console.error('최근 답변 수 조회 오류:', error)
      throw new Error(error.message)
    }

    return { data: count || 0, error: null }
  } catch (error) {
    console.error('최근 답변 수 조회 중 예외 발생:', error)
    return { data: 0, error: error as Error }
  }
}

// 질문 통계 업데이트 (일일 통계 기록)
export async function updateQuestionStats(questionId: string, type: 'view' | 'answer') {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD 형식

    // 오늘 날짜의 통계 레코드 조회 또는 생성
    const { data: existingStats, error: fetchError } = await supabase
      .from('question_stats')
      .select('*')
      .eq('question_id', questionId)
      .eq('date', today)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116은 "no rows found" 에러
      console.error('기존 통계 조회 오류:', fetchError)
      throw new Error(fetchError.message)
    }

    if (existingStats) {
      // 기존 레코드 업데이트
      const updateData = type === 'view' 
        ? { daily_views: existingStats.daily_views + 1 }
        : { daily_answers: existingStats.daily_answers + 1 }

      const { error: updateError } = await supabase
        .from('question_stats')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('question_id', questionId)
        .eq('date', today)

      if (updateError) {
        console.error('통계 업데이트 오류:', updateError)
        throw new Error(updateError.message)
      }
    } else {
      // 새 레코드 생성
      const { error: insertError } = await supabase
        .from('question_stats')
        .insert({
          question_id: questionId,
          date: today,
          daily_views: type === 'view' ? 1 : 0,
          daily_answers: type === 'answer' ? 1 : 0
        })

      if (insertError) {
        console.error('통계 생성 오류:', insertError)
        throw new Error(insertError.message)
      }
    }

    return { data: true, error: null }
  } catch (error) {
    console.error('질문 통계 업데이트 중 예외 발생:', error)
    return { data: false, error: error as Error }
  }
}

// 질문 수정
export async function updateQuestion(questionId: string, updates: Partial<QuestionUpdate>, userId: string) {
  try {
    // 먼저 질문이 존재하고 사용자가 작성자인지 확인
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('user_id')
      .eq('id', questionId)
      .single()

    if (fetchError) {
      console.error('질문 조회 오류:', fetchError)
      return { success: false, error: '질문을 찾을 수 없습니다.' }
    }

    if (question.user_id !== userId) {
      return { success: false, error: '본인이 작성한 질문만 수정할 수 있습니다.' }
    }

    // 질문 업데이트
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', questionId)
      .eq('user_id', userId) // 추가 보안: 사용자 ID도 확인

    if (updateError) {
      console.error('질문 수정 오류:', updateError)
      return { success: false, error: '질문 수정에 실패했습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('질문 수정 실패:', error)
    return { success: false, error: '질문 수정 중 오류가 발생했습니다.' }
  }
}

// 질문 삭제 (소프트 삭제)
export async function deleteQuestion(questionId: string, userId: string) {
  try {
    // 먼저 질문이 존재하고 사용자가 작성자인지 확인
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('user_id')
      .eq('id', questionId)
      .single()

    if (fetchError) {
      console.error('질문 조회 오류:', fetchError)
      return { success: false, error: '질문을 찾을 수 없습니다.' }
    }

    if (question.user_id !== userId) {
      return { success: false, error: '본인이 작성한 질문만 삭제할 수 있습니다.' }
    }

    // 소프트 삭제: 제목과 내용을 삭제 메시지로 변경
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        title: '삭제된 질문입니다.',
        content: '삭제된 질문입니다.',
        updated_at: new Date().toISOString()
      })
      .eq('id', questionId)
      .eq('user_id', userId) // 추가 보안: 사용자 ID도 확인

    if (updateError) {
      console.error('질문 삭제 오류:', updateError)
      return { success: false, error: '질문 삭제에 실패했습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('질문 삭제 실패:', error)
    return { success: false, error: '질문 삭제 중 오류가 발생했습니다.' }
  }
}
