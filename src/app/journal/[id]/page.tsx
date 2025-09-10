"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BookOpen, ArrowLeft, Calendar, Clock, MessageSquare, ThumbsUp, Eye, User, Share2, Heart } from 'lucide-react'
import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'

interface JournalArticle {
  id: number
  title: string
  content: string
  excerpt: string
  category: string
  author: {
    name: string
    title: string
    company: string
    avatar?: string
    experience: string
  }
  publishedAt: string
  readTime: string
  views: number
  likes: number
  comments: number
  tags: string[]
  isFeatured: boolean
  isTrending: boolean
  image?: string
}

const mockJournalArticles: JournalArticle[] = [
  {
    id: 1,
    title: "3년차 개발자, 이직 타이밍과 준비 과정",
    content: `# 3년차 개발자, 이직 타이밍과 준비 과정

안녕하세요! 8년차 백엔드 개발자 김시니어입니다. 오늘은 3년차 개발자분들이 가장 많이 고민하는 "이직"에 대해 이야기해보려고 합니다.

## 이직을 고민하는 시점

3년차는 개발자로서 중요한 전환점입니다. 기본기를 다졌고, 어느 정도 독립적으로 업무를 수행할 수 있게 되었지만, 동시에 새로운 도전과 성장에 대한 갈증이 생기는 시기죠.

### 이직을 고려해야 하는 신호들

1. **성장의 정체감**: 현재 회사에서 더 이상 배울 것이 없다고 느낄 때
2. **커리어 방향성**: 현재 업무가 자신의 장기적 목표와 맞지 않을 때
3. **보상의 불균형**: 시장 대비 낮은 연봉이나 복리후생
4. **조직 문화**: 팀이나 회사의 문화가 맞지 않을 때

## 이직 준비 과정

### 1. 자기 분석
- 현재 보유한 기술 스택 정리
- 프로젝트 경험 및 성과 정리
- 강점과 약점 파악
- 장기적 커리어 목표 설정

### 2. 기술 스택 업데이트
- 시장에서 요구하는 기술 학습
- 사이드 프로젝트로 실전 경험 쌓기
- 오픈소스 기여
- 기술 블로그 운영

### 3. 포트폴리오 준비
- GitHub 프로필 정리
- 프로젝트 README 작성
- 기술 블로그 운영
- 컨퍼런스 발표나 세미나 참여

## 이직 시 주의사항

### 1. 너무 급하게 서두르지 말기
이직은 신중하게 결정해야 합니다. 충분한 준비 없이 이직하면 오히려 역효과가 날 수 있어요.

### 2. 현재 회사와의 관계 유지
이직을 결정했다고 해서 현재 회사와의 관계를 소홀히 하면 안 됩니다. 업계는 생각보다 좁아요.

### 3. 새로운 회사에 대한 충분한 조사
회사 문화, 기술 스택, 팀 분위기 등을 충분히 파악하고 결정하세요.

## 마무리

이직은 커리어의 중요한 결정입니다. 충분한 준비와 신중한 판단을 통해 성공적인 이직을 하시길 바랍니다. 

궁금한 점이 있으시면 언제든 댓글로 질문해주세요!`,
    excerpt: "3년차 개발자로서 이직을 고민하고 있는 분들에게 실제 경험을 바탕으로 한 조언을 드립니다...",
    category: "커리어 전환",
    author: {
      name: "김시니어",
      title: "시니어 백엔드 개발자",
      company: "네이버",
      experience: "8년차"
    },
    publishedAt: "2024-01-15",
    readTime: "5분",
    views: 1247,
    likes: 89,
    comments: 23,
    tags: ["이직", "개발자", "커리어"],
    isFeatured: true,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "팀 리드가 되기 전에 준비해야 할 것들",
    content: `# 팀 리드가 되기 전에 준비해야 할 것들

안녕하세요! 카카오에서 프로덕트 매니저로 일하고 있는 박매니저입니다. 오늘은 개발자에서 팀 리드로 성장하는 과정에서 필요한 것들에 대해 이야기해보겠습니다.

## 기술적 역량 vs 리더십 역량

많은 개발자들이 팀 리드가 되려면 기술적 역량만 있으면 된다고 생각하는데, 실제로는 리더십 역량이 더 중요합니다.

### 기술적 역량
- 코드 리뷰 능력
- 아키텍처 설계 경험
- 기술 트렌드 파악
- 문제 해결 능력

### 리더십 역량
- 커뮤니케이션 스킬
- 팀원 동기부여
- 갈등 해결
- 비전 제시

## 팀 리드가 되기 전 준비사항

### 1. 멘토링 경험 쌓기
- 주니어 개발자 멘토링
- 코드 리뷰 참여
- 기술 세미나 발표
- 온라인 커뮤니티 활동

### 2. 프로젝트 관리 경험
- 작은 프로젝트 리드
- 일정 관리 경험
- 리소스 배분 경험
- 위험 관리 경험

### 3. 커뮤니케이션 스킬 향상
- 발표 및 프레젠테이션 연습
- 글쓰기 능력 향상
- 갈등 상황 대처 연습
- 피드백 주고받기

## 팀 리드의 역할

### 1. 기술적 리더십
- 기술 방향성 제시
- 코드 품질 관리
- 기술 부채 해결
- 새로운 기술 도입

### 2. 팀 관리
- 팀원 성장 지원
- 업무 분배 및 조율
- 성과 평가 및 피드백
- 팀 문화 조성

### 3. 비즈니스 연계
- 요구사항 분석
- 우선순위 설정
- 이해관계자 소통
- 비즈니스 가치 창출

## 마무리

팀 리드는 기술적 역량과 리더십 역량을 모두 갖춰야 하는 역할입니다. 충분한 준비를 통해 성공적인 팀 리드가 되시길 바랍니다.`,
    excerpt: "개발자에서 팀 리드로 성장하는 과정에서 필요한 스킬과 마인드셋에 대해 이야기합니다...",
    category: "리더십",
    author: {
      name: "박매니저",
      title: "프로덕트 매니저",
      company: "카카오",
      experience: "6년차"
    },
    publishedAt: "2024-01-12",
    readTime: "7분",
    views: 892,
    likes: 67,
    comments: 18,
    tags: ["리더십", "팀관리", "성장"],
    isFeatured: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center"
  }
]

export default function JournalDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<JournalArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const articleId = parseInt(params.id as string)
    const foundArticle = mockJournalArticles.find(a => a.id === articleId)
    
    if (foundArticle) {
      setArticle(foundArticle)
    }
    setLoading(false)
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '오늘'
    if (diffDays === 2) return '어제'
    if (diffDays <= 7) return `${diffDays - 1}일 전`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}주 전`
    return `${Math.floor(diffDays / 30)}개월 전`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">아티클을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">요청하신 아티클이 존재하지 않거나 삭제되었습니다.</p>
          <Link href="/journal">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
              저널로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* PC Navigation */}
      <PCNavigation title="저널" icon={BookOpen} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/journal" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>저널로 돌아가기</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Back Button (PC) */}
        <div className="hidden md:block mb-6">
          <Link href="/journal" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>저널로 돌아가기</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Featured Image */}
          {article.image && (
            <div className="h-64 md:h-80 w-full overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            {/* Article Meta */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-600">{article.author.company} • {article.author.experience}</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Article Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-6">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.views.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {article.likes}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {article.comments}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                <Heart className="w-4 h-4" />
                <span>좋아요</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>공유</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {article.content}
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">작성자 정보</h3>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {article.author.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">{article.author.name}</h4>
              <p className="text-gray-600 mb-2">{article.author.title}</p>
              <p className="text-gray-500">{article.author.company} • {article.author.experience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
