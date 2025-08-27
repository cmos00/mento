import { User, Question, Feedback, MentoringSession, CareerJournalEntry, Reward } from '@prisma/client'

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

export type UserWithProfile = User & {
  mentorProfile?: MentorProfile | null
}

export type QuestionWithAuthor = Question & {
  author: User
  feedbacks: Feedback[]
}

// Prisma 기반 타입 정의
export type QuestionWithAuthorAndFeedbacks = Question & {
  author: User
  feedbacks: (Feedback & {
    mentor: User
  })[]
}

export type FeedbackWithMentor = Feedback & {
  mentor: User
  question: Question
  upvotes: Upvote[]
  bestAnswers: BestAnswer[]
}

export type MentoringSessionWithDetails = MentoringSession & {
  question: Question
  mentee: User
  mentor: User
}

export type CareerJournalEntryWithFeedback = CareerJournalEntry & {
  feedback?: Feedback | null
}

export type RewardWithUser = Reward & {
  user: User
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
  mentor: UserWithProfile
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
