"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  MessageCircle,
  Award,
  MessageSquare,
  ThumbsUp,
  Coffee,
  Calendar,
  Briefcase,
  Star,
  TrendingUp,
  BookOpen,
  Sparkles,
  Users,
  Settings,
  LogOut
} from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function ProfilePage() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [activeTab, setActiveTab] = useState('overview')

  const userStats = {
    questionsAsked: 12,
    answersGiven: 28,
    helpfulVotes: 156,
    coffeeReceived: 8,
    mentoringSessions: 15,
  }

  const recentQuestions = [
    {
      id: 1,
      title: "3년차 개발자, 이직 타이밍이 맞을까요?",
      category: "이직",
      answers: 12,
      likes: 24,
      status: "해결됨",
      createdAt: "2일 전",
    },
    {
      id: 2,
      title: "팀 리드 역할 제안받았는데 준비가 될까요?",
      category: "리더십",
      answers: 8,
      likes: 18,
      status: "진행중",
      createdAt: "1주 전",
    },
  ]

  const recentAnswers = [
    {
      id: 1,
      questionTitle: "신입 개발자 온보딩 어떻게 하면 좋을까요?",
      category: "리더십",
      likes: 15,
      isBest: true,
      createdAt: "1일 전",
    },
    {
      id: 2,
      questionTitle: "코드 리뷰 문화 정착시키는 방법",
      category: "개발문화",
      likes: 22,
      isBest: false,
      createdAt: "3일 전",
    },
  ]

  if (!mockUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 ring-4 ring-purple-200">
                {mockUser.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{mockUser.name}</h2>
              <p className="text-gray-600 mb-4">백엔드 개발자 • 5년차</p>
              <div className="flex justify-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  활발한 멘토
                </span>
                <span className="px-3 py-1 border border-purple-200 text-purple-600 rounded-full text-sm flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  도움왕
                </span>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                프로필 편집
              </button>
            </div>

            {/* Activity Stats */}
            <div className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg text-purple-600 font-semibold mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                활동 통계
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">질문 수</span>
                  <span className="text-lg font-semibold text-gray-900">{userStats.questionsAsked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">답변 수</span>
                  <span className="text-lg font-semibold text-gray-900">{userStats.answersGiven}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">도움받은 표</span>
                  <span className="text-lg font-semibold text-gray-900">{userStats.helpfulVotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">받은 커피</span>
                  <span className="text-lg font-semibold text-gray-900">{userStats.coffeeReceived}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">멘토링 세션</span>
                  <span className="text-lg font-semibold text-gray-900">{userStats.mentoringSessions}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex space-x-1 mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  개요
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'questions'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  내 질문
                </button>
                <button
                  onClick={() => setActiveTab('answers')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'answers'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  내 답변
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">최근 질문</h4>
                        <div className="space-y-2">
                          {recentQuestions.slice(0, 2).map((question) => (
                            <div key={question.id} className="text-sm">
                              <p className="text-gray-900 font-medium">{question.title}</p>
                              <p className="text-gray-600">{question.answers}개 답변 • {question.likes}개 좋아요</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">최근 답변</h4>
                        <div className="space-y-2">
                          {recentAnswers.slice(0, 2).map((answer) => (
                            <div key={answer.id} className="text-sm">
                              <p className="text-gray-900 font-medium">{answer.questionTitle}</p>
                              <p className="text-gray-600">{answer.likes}개 좋아요 • {answer.isBest ? '베스트 답변' : '일반 답변'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">내 질문 ({recentQuestions.length})</h3>
                  {recentQuestions.map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{question.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{question.category}</span>
                            <span>{question.answers}개 답변</span>
                            <span>{question.likes}개 좋아요</span>
                            <span>{question.createdAt}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          question.status === '해결됨' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {question.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'answers' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">내 답변 ({recentAnswers.length})</h3>
                  {recentAnswers.map((answer) => (
                    <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{answer.questionTitle}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{answer.category}</span>
                            <span>{answer.likes}개 좋아요</span>
                            <span>{answer.createdAt}</span>
                          </div>
                        </div>
                        {answer.isBest && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            베스트 답변
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
