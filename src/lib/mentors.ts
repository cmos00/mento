import { supabase } from './supabase'

export interface Mentor {
  id: string
  user_id: string | null
  title: string
  company: string
  experience: string
  specialties: string[]
  bio: string
  rating: number
  reviews_count: number
  response_rate: number
  avg_response_time: string
  badges: string[]
  hourly_rate: number
  is_available: boolean
  is_verified: boolean
  total_sessions: number
  created_at: string
  updated_at: string
}

// 모든 멘토 조회
export async function getAllMentors() {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('is_available', true)
      .order('rating', { ascending: false })

    if (error) {
      console.error('멘토 목록 조회 오류:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('멘토 목록 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 특정 멘토 조회
export async function getMentorById(id: string) {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('멘토 조회 오류:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('멘토 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 전문 분야별 멘토 조회
export async function getMentorsBySpecialty(specialty: string) {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .contains('specialties', [specialty])
      .eq('is_available', true)
      .order('rating', { ascending: false })

    if (error) {
      console.error('전문 분야별 멘토 조회 오류:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('전문 분야별 멘토 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 검색어로 멘토 조회
export async function searchMentors(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
      .eq('is_available', true)
      .order('rating', { ascending: false })

    if (error) {
      console.error('멘토 검색 오류:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('멘토 검색 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

// 인기 멘토 조회
export async function getPopularMentors(limit: number = 6) {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('is_available', true)
      .order('rating', { ascending: false })
      .order('reviews_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('인기 멘토 조회 오류:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('인기 멘토 조회 중 예외 발생:', error)
    return { data: null, error: error as Error }
  }
}

