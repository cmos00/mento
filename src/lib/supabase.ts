import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// createClient 함수를 re-export (API 라우트에서 사용)
export { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.')
  } else {
    console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다. 일부 기능이 작동하지 않을 수 있습니다.')
  }
}

// Supabase 클라이언트 생성
export const supabase = createSupabaseClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url?: string
          company?: string
          position?: string
          experience?: string
          bio?: string
          skills?: string[]
          linkedin_url?: string
          website?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string
          company?: string
          position?: string
          experience?: string
          bio?: string
          skills?: string[]
          linkedin_url?: string
          website?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string
          company?: string
          position?: string
          experience?: string
          bio?: string
          skills?: string[]
          linkedin_url?: string
          website?: string
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string
          tags: string[]
          is_anonymous: boolean
          status: string
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: string
          tags?: string[]
          is_anonymous?: boolean
          status?: string
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          is_anonymous?: boolean
          status?: string
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      feedbacks: {
        Row: {
          id: string
          question_id: string
          user_id: string
          content: string
          examples?: string
          advice?: string
          resources: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          content: string
          examples?: string
          advice?: string
          resources?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string
          content?: string
          examples?: string
          advice?: string
          resources?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
