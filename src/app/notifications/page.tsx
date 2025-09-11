"use client"

import MobileBottomNav from '@/components/MobileBottomNav'
import PCNavigation from '@/components/PCNavigation'
import { ArrowRight, Bell, BookOpen, Calendar, Check, Coffee, MessageCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface Notification {
  id: number
  type: 'question_answer' | 'journal_comment' | 'coffee_chat_request' | 'coffee_chat_accepted' | 'coffee_coupon' | 'system'
  title: string
  message: string
  timeAgo: string
  isRead: boolean
  actionUrl?: string
  actionText?: string
  sender?: {
    name: string
    avatar?: string
    company?: string
  }
  relatedContent?: {
    title: string
    type: 'question' | 'journal' | 'coffee_chat'
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'question_answer',
      title: '질문에 새로운 답변이 달렸습니다',
      message: '"3년차 개발자, 이직 타이밍이 맞을까요?" 질문에 김시니어님이 답변을 달았습니다.',
      timeAgo: '10분 전',
      isRead: false,
      actionUrl: '/questions/1',
      actionText: '답변 보기',
      sender: {
        name: '김시니어',
        company: '네이버'
      },
      relatedContent: {
        title: '3년차 개발자, 이직 타이밍이 맞을까요?',
        type: 'question'
      }
    },
    {
      id: 2,
      type: 'journal_comment',
      title: '저널 글에 댓글이 달렸습니다',
      message: '"팀 리드가 되기 전에 준비해야 할 것들" 글에 박매니저님이 댓글을 남겼습니다.',
      timeAgo: '1시간 전',
      isRead: false,
      actionUrl: '/journal/2',
      actionText: '댓글 보기',
      sender: {
        name: '박매니저',
        company: '카카오'
      },
      relatedContent: {
        title: '팀 리드가 되기 전에 준비해야 할 것들',
        type: 'journal'
      }
    },
    {
      id: 3,
      type: 'coffee_chat_request',
      title: '커피챗 요청이 들어왔습니다',
      message: '이신입님이 커피챗을 요청했습니다. "개발자 커리어 상담" 주제로 30분간 진행하고 싶어합니다.',
      timeAgo: '2시간 전',
      isRead: false,
      actionUrl: '/coffee/chat/3',
      actionText: '요청 확인',
      sender: {
        name: '이신입',
        company: '스타트업B'
      },
      relatedContent: {
        title: '개발자 커리어 상담',
        type: 'coffee_chat'
      }
    },
    {
      id: 4,
      type: 'coffee_coupon',
      title: '커피 쿠폰을 받았습니다',
      message: '최멘티님이 멘토링에 감사한 마음을 담아 커피 쿠폰을 보내주셨습니다.',
      timeAgo: '3시간 전',
      isRead: true,
      actionUrl: '/profile',
      actionText: '쿠폰 확인',
      sender: {
        name: '최멘티',
        company: '대기업C'
      }
    },
    {
      id: 5,
      type: 'coffee_chat_accepted',
      title: '커피챗 요청이 수락되었습니다',
      message: '김시니어님이 커피챗 요청을 수락했습니다. 3월 15일 오후 2시에 진행 예정입니다.',
      timeAgo: '1일 전',
      isRead: true,
      actionUrl: '/coffee/chat/5',
      actionText: '일정 확인',
      sender: {
        name: '김시니어',
        company: '네이버'
      },
      relatedContent: {
        title: '개발자 이직 상담',
        type: 'coffee_chat'
      }
    },
    {
      id: 6,
      type: 'system',
      title: '프로필 인증이 완료되었습니다',
      message: 'LinkedIn 연동을 통한 프로필 인증이 성공적으로 완료되었습니다.',
      timeAgo: '2일 전',
      isRead: true
    },
    {
      id: 7,
      type: 'question_answer',
      title: '질문에 새로운 답변이 달렸습니다',
      message: '"신입 개발자 온보딩 어떻게 하면 좋을까요?" 질문에 이디자이너님이 답변을 달았습니다.',
      timeAgo: '3일 전',
      isRead: true,
      actionUrl: '/questions/7',
      actionText: '답변 보기',
      sender: {
        name: '이디자이너',
        company: '토스'
      },
      relatedContent: {
        title: '신입 개발자 온보딩 어떻게 하면 좋을까요?',
        type: 'question'
      }
    }
  ])

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'question_answer':
        return <MessageCircle className="w-5 h-5 text-blue-600" />
      case 'journal_comment':
        return <BookOpen className="w-5 h-5 text-green-600" />
      case 'coffee_chat_request':
        return <Calendar className="w-5 h-5 text-purple-600" />
      case 'coffee_chat_accepted':
        return <Check className="w-5 h-5 text-green-600" />
      case 'coffee_coupon':
        return <Coffee className="w-5 h-5 text-yellow-600" />
      case 'system':
        return <Bell className="w-5 h-5 text-gray-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'question_answer':
        return 'bg-blue-50 border-blue-200'
      case 'journal_comment':
        return 'bg-green-50 border-green-200'
      case 'coffee_chat_request':
        return 'bg-purple-50 border-purple-200'
      case 'coffee_chat_accepted':
        return 'bg-green-50 border-green-200'
      case 'coffee_coupon':
        return 'bg-yellow-50 border-yellow-200'
      case 'system':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'question_answer':
        return '질문 답변'
      case 'journal_comment':
        return '저널 댓글'
      case 'coffee_chat_request':
        return '커피챗 요청'
      case 'coffee_chat_accepted':
        return '커피챗 수락'
      case 'coffee_coupon':
        return '커피쿠폰'
      case 'system':
        return '시스템'
      default:
        return '알림'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* PC Navigation */}
      <PCNavigation title="알림" icon={Bell} />
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">알림</span>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              모두 읽음
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Notification Stats */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notifications.filter(n => n.type === 'question_answer').length}</div>
              <div className="text-sm text-gray-600">질문 답변</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.type === 'journal_comment').length}</div>
              <div className="text-sm text-gray-600">저널 댓글</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{notifications.filter(n => n.type.includes('coffee_chat')).length}</div>
              <div className="text-sm text-gray-600">커피챗</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{notifications.filter(n => n.type === 'coffee_coupon').length}</div>
              <div className="text-sm text-gray-600">커피쿠폰</div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 transition-all ${
                  notification.isRead ? 'opacity-75' : 'border-l-4 border-l-purple-500'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-lg font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        {/* Sender Info */}
                        {notification.sender && (
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {notification.sender.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {notification.sender.name}
                              {notification.sender.company && ` • ${notification.sender.company}`}
                            </span>
                          </div>
                        )}
                        
                        {/* Related Content */}
                        {notification.relatedContent && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center space-x-2">
                              {notification.relatedContent.type === 'question' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                              {notification.relatedContent.type === 'journal' && <BookOpen className="w-4 h-4 text-green-600" />}
                              {notification.relatedContent.type === 'coffee_chat' && <Calendar className="w-4 h-4 text-purple-600" />}
                              <span className="text-sm text-gray-700 font-medium">{notification.relatedContent.title}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm text-gray-500">{notification.timeAgo}</span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {notification.actionUrl && notification.actionText && (
                          <Link href={notification.actionUrl}>
                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
                              {notification.actionText}
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                          </Link>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="읽음 표시"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">알림이 없습니다</h3>
              <p className="text-gray-600">새로운 알림이 오면 여기에 표시됩니다.</p>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 설정</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">질문 답변 알림</p>
                <p className="text-sm text-gray-600">질문에 새로운 답변이 달렸을 때</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">저널 댓글 알림</p>
                <p className="text-sm text-gray-600">저널 글에 새로운 댓글이 달렸을 때</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">커피챗 알림</p>
                <p className="text-sm text-gray-600">커피챗 요청과 승락 알림</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">커피쿠폰 알림</p>
                <p className="text-sm text-gray-600">커피쿠폰을 받았을 때</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
