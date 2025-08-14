"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Bell, MessageCircle, Coffee, Star, Calendar, ArrowRight, Check, X } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

interface Notification {
  id: number
  type: 'mentoring' | 'answer' | 'coffee' | 'system'
  title: string
  message: string
  timeAgo: string
  isRead: boolean
  actionUrl?: string
  actionText?: string
}

export default function NotificationsPage() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'mentoring',
      title: '멘토링 신청이 수락되었습니다',
      message: '김시니어 멘토님이 3월 15일 오후 2시 멘토링을 수락했습니다.',
      timeAgo: '10분 전',
      isRead: false,
      actionUrl: '/mentors/1',
      actionText: '멘토 프로필 보기'
    },
    {
      id: 2,
      type: 'answer',
      title: '질문에 새로운 답변이 달렸습니다',
      message: '"3년차 개발자, 이직 타이밍이 맞을까요?" 질문에 박매니저님이 답변을 달았습니다.',
      timeAgo: '1시간 전',
      isRead: false,
      actionUrl: '/questions/1',
      actionText: '답변 보기'
    },
    {
      id: 3,
      type: 'coffee',
      title: '커피 쿠폰을 받았습니다',
      message: '이신입님이 멘토링에 감사한 마음을 담아 커피 쿠폰을 보내주셨습니다.',
      timeAgo: '2시간 전',
      isRead: true,
      actionUrl: '/profile',
      actionText: '쿠폰 확인'
    },
    {
      id: 4,
      type: 'system',
      title: '프로필 인증이 완료되었습니다',
      message: 'LinkedIn 연동을 통한 프로필 인증이 성공적으로 완료되었습니다.',
      timeAgo: '1일 전',
      isRead: true
    },
    {
      id: 5,
      type: 'mentoring',
      title: '멘토링 일정이 변경되었습니다',
      message: '3월 15일 오후 2시로 예정된 멘토링이 오후 3시로 변경되었습니다.',
      timeAgo: '1일 전',
      isRead: true,
      actionUrl: '/profile',
      actionText: '일정 확인'
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
      case 'mentoring':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'answer':
        return <MessageCircle className="w-5 h-5 text-green-600" />
      case 'coffee':
        return <Coffee className="w-5 h-5 text-yellow-600" />
      case 'system':
        return <Bell className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'mentoring':
        return 'bg-blue-50 border-blue-200'
      case 'answer':
        return 'bg-green-50 border-green-200'
      case 'coffee':
        return 'bg-yellow-50 border-yellow-200'
      case 'system':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

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
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                {unreadCount}
              </span>
            )}
            <button
              onClick={markAllAsRead}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              모두 읽음
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Notification Stats */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notifications.filter(n => n.type === 'mentoring').length}</div>
              <div className="text-sm text-gray-600">멘토링</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.type === 'answer').length}</div>
              <div className="text-sm text-gray-600">답변</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{notifications.filter(n => n.type === 'coffee').length}</div>
              <div className="text-sm text-gray-600">커피쿠폰</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{notifications.filter(n => n.type === 'system').length}</div>
              <div className="text-sm text-gray-600">시스템</div>
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
                      <h3 className={`text-lg font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{notification.timeAgo}</span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
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
                <p className="font-medium text-gray-900">멘토링 관련 알림</p>
                <p className="text-sm text-gray-600">멘토링 신청, 수락, 일정 변경 등</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">답변 알림</p>
                <p className="text-sm text-gray-600">질문에 새로운 답변이 달렸을 때</p>
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
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">시스템 알림</p>
                <p className="text-sm text-gray-600">프로필 인증, 정책 변경 등</p>
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
