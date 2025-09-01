import { Database } from '@/lib/supabase'

// Supabase 타입 별칭
type User = Database['public']['Tables']['users']['Row']
type Question = Database['public']['Tables']['questions']['Row']
type Feedback = Database['public']['Tables']['feedbacks']['Row']  

// LinkedIn 관련 타입 확장
export interface LinkedInProfile {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
  locale: string
}

export interface ExtendedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  isDemo?: boolean
  linkedinId?: string
  linkedinProfile?: LinkedInProfile
}

// Supabase 기반 확장 타입 정의 (실제 존재하는 테이블만 사용)
export type QuestionWithAuthor = Question & {
  author: User
}

export type FeedbackWithAuthor = Feedback & {
  author: User
}

export type QuestionWithFeedbacks = Question & {
  author: User
  feedbacks: FeedbackWithAuthor[]
}

export interface QuestionTemplate {
  id: string
  title: string
  description: string
  fields: QuestionField[]
  category: string
  examples: string[]
}

export interface QuestionField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'multiselect'
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface MentorRecommendation {
  mentor: User
  score: number
  reasons: string[]
}

export interface FeedbackQuality {
  score: number
  criteria: {
    relevance: number
    specificity: number
    actionability: number
    examples: number
  }
}
