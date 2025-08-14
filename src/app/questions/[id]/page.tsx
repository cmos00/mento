"use client"

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, ThumbsUp, MessageSquare, Clock, Award, Coffee, Send, Star, ArrowLeft } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [newAnswer, setNewAnswer] = useState('')

  const question = {
    id: parseInt(params.id),
    title: "3년차 개발자, 이직 타이밍이 맞을까요?",
    content: `현재 스타트업에서 3년째 근무 중인 백엔드 개발자입니다. 최근 대기업에서 제안이 왔는데, 지금 이직하는 것이 커리어에 도움이 될지 고민입니다.

현재 상황:
- 현재 회사: 시리즈 B 스타트업, 개발팀 5명
- 담당 업무: 백엔드 API 개발, 인프라 관리
- 연봉: 6000만원
- 성장: 기술적으로는 많이 배웠지만, 체계적인 프로세스는 부족

제안받은 회사:
- 대기업 계열사 IT 부서
- 연봉: 7500만원 (25% 인상)
- 복리후생: 확실히 좋음
- 우려: 업무가 루틴해질 수 있을까 걱정

고민 포인트:
1. 지금 이직하는 것이 커리어에 도움이 될까요?
2. 대기업 vs 스타트업, 어떤 경험이 더 가치있을까요?
3. 연봉 인상 vs 성장 기회, 어떤 것을 우선해야 할까요?

솔직한 조언 부탁드립니다.`,
    author: "익명의 개발자",
    authorInfo: "백엔드 개발자 • 3년차 • 스타트업",
    category: "이직",
    likes: 24,
    comments: 12,
    timeAgo: "2시간 전",
    tags: ["개발자", "이직", "스타트업", "대기업"],
  }

  const answers = [
    {
      id: 1,
      content: `비슷한 상황을 겪었던 시니어 개발자로서 조언드리겠습니다.

**결론부터 말씀드리면, 지금이 좋은 타이밍이라고 생각합니다.**

3년차는 주니어에서 미드레벨로 넘어가는 중요한 시점입니다. 스타트업에서 다양한 경험을 쌓으셨다면, 이제 체계적인 프로세스와 규모있는 시스템을 경험해보시는 것도 좋겠어요.

몇 가지 고려사항:

1. **커리어 다양성**: 스타트업 + 대기업 경험은 나중에 큰 자산이 됩니다
2. **기술 성장**: 대기업에서도 충분히 성장할 수 있어요. 오히려 더 체계적일 수 있습니다
3. **연봉**: 25% 인상은 상당한 수준입니다

다만, 대기업에서도 적극적으로 학습하고 도전하는 자세가 중요해요. 환경이 성장을 만들어주지는 않거든요.

궁금한 점 더 있으시면 1:1로 대화해요!`,
      author: "시니어 백엔드 개발자",
      authorInfo: "네이버 • 백엔드 개발 • 8년차",
      likes: 18,
      timeAgo: "1시간 전",
      isBest: true,
      badges: ["인기 멘토", "답변왕"],
    },
    {
      id: 2,
      content: `저는 반대 의견입니다. 3년차라면 아직 더 배울 게 많은 시점이에요.

스타트업에서의 경험이 아직 충분하지 않다고 생각해요. 특히 시리즈 B라면 앞으로 더 성장할 가능성이 높고, 그 과정에서 얻을 수 있는 경험이 매우 값질 거예요.

대기업은 언제든 갈 수 있지만, 스타트업의 성장 과정을 경험할 기회는 흔하지 않아요.

연봉보다는 경험을 우선하시길 추천드려요.`,
      author: "스타트업 CTO",
      authorInfo: "스타트업 CTO • 개발 • 12년차",
      likes: 12,
      timeAgo: "30분 전",
      isBest: false,
      badges: ["스타트업 전문가"],
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
            <Link href="/questions" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Question */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                {question.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {question.timeAgo}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
            
            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
              <span>{question.author}</span>
              <span>•</span>
              <span>{question.authorInfo}</span>
            </div>

            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{question.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {question.likes}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {question.comments}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="space-y-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">답변 ({answers.length})</h2>
          
          {answers.map((answer) => (
            <div key={answer.id} className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {answer.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{answer.author}</p>
                      <p className="text-sm text-gray-600">{answer.authorInfo}</p>
                    </div>
                  </div>
                  {answer.isBest && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      베스트 답변
                    </span>
                  )}
                </div>

                <div className="prose prose-gray max-w-none mb-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{answer.content}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {answer.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {answer.likes}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {answer.timeAgo}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                      <Coffee className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Answer Form */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">답변 작성</h3>
            <div className="space-y-4">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="질문자에게 도움이 되는 답변을 작성해주세요..."
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  답변 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
