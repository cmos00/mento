import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tpfamzghtqjwqahsddml.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다. Supabase 기능이 제한될 수 있습니다.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          user_id: string
          content: string
          is_anonymous: boolean
          helpful_votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          content: string
          is_anonymous?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string
          content?: string
          is_anonymous?: boolean
          helpful_votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      mentors: {
        Row: {
          id: string
          user_id: string
          title: string
          company: string
          experience: string
          specialties: string[]
          bio: string
          hourly_rate: number
          rating: number
          total_mentoring: number
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          company: string
          experience: string
          specialties?: string[]
          bio: string
          hourly_rate: number
          rating?: number
          total_mentoring?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          company?: string
          experience?: string
          specialties?: string[]
          bio?: string
          hourly_rate?: number
          rating?: number
          total_mentoring?: number
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      mentoring_requests: {
        Row: {
          id: string
          mentee_id: string
          mentor_id: string
          topic: string
          description: string
          preferred_date?: string
          preferred_time?: string
          duration: number
          status: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mentee_id: string
          mentor_id: string
          topic: string
          description: string
          preferred_date?: string
          preferred_time?: string
          duration: number
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mentee_id?: string
          mentor_id?: string
          topic?: string
          description?: string
          preferred_date?: string
          preferred_time?: string
          duration?: number
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      coffee_coupons: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          amount: number
          message: string
          mentoring_id?: string
          status: 'active' | 'used' | 'expired'
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          amount: number
          message: string
          mentoring_id?: string
          status?: 'active' | 'used' | 'expired'
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          amount?: number
          message?: string
          mentoring_id?: string
          status?: 'active' | 'used' | 'expired'
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      journals: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: string
          tags: string[]
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mood: string
          tags?: string[]
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mood?: string
          tags?: string[]
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
