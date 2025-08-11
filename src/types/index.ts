import { User, Question, Feedback, MentoringSession, CareerJournalEntry, Reward } from '@prisma/client'

export type UserWithProfile = User & {
  mentorProfile?: MentorProfile | null
}

export type QuestionWithAuthor = Question & {
  author: User
  feedbacks: Feedback[]
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
