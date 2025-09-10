"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Coffee, Plus, Gift, Download, CreditCard, History, ArrowRight, Star } from 'lucide-react'
import MobileBottomNav from '@/components/MobileBottomNav'

interface CoffeeCoupon {
  id: number
  type: 'received' | 'sent' | 'purchased'
  amount: number
  from?: string
  to?: string
  message?: string
  date: string
  status: 'active' | 'used' | 'expired'
  mentoringTitle?: string
}

export default function CoffeePage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock 데이터
  const coffeeCoupons: CoffeeCoupon[] = [
    {
      id: 1,
      type: 'received',
      amount: 5000,
      from: '김시니어',
      message: '멘토링에 감사드립니다!',
      date: '2024-03-15',
      status: 'active',
      mentoringTitle: '백엔드 아키텍처 설계'
    },
    {
      id: 2,
      type: 'sent',
      amount: 10000,
      to: '박매니저',
      message: '정말 도움이 많이 되었습니다!',
      date: '2024-03-10',
      status: 'active',
      mentoringTitle: '프로덕트 기획 방법론'
    },
    {
      id: 3,
      type: 'purchased',
      amount: 20000,
      date: '2024-03-01',
      status: 'active'
    },
    {
      id: 4,
      type: 'received',
      amount: 5000,
      from: '이디자이너',
      message: '좋은 조언 감사합니다!',
      date: '2024-02-28',
      status: 'used',
      mentoringTitle: 'UI/UX 디자인 리뷰'
    }
  ]

  const purchasedAmount = coffeeCoupons
    .filter(coupon => coupon.type === 'purchased' && coupon.status === 'active')
    .reduce((sum, coupon) => sum + coupon.amount, 0)

  const receivedAmount = coffeeCoupons
    .filter(coupon => coupon.type === 'received' && coupon.status === 'active')
    .reduce((sum, coupon) => sum + coupon.amount, 0)

  const totalAvailable = purchasedAmount + receivedAmount

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-2 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'received'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              받은 쿠폰
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              보낸 쿠폰
            </button>
            <button
              onClick={() => setActiveTab('purchased')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'purchased'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              충전 내역
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">사용 가능</h3>
                <p className="text-2xl font-bold text-purple-600">{totalAvailable.toLocaleString()}원</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">직접 충전</h3>
                <p className="text-2xl font-bold text-green-600">{purchasedAmount.toLocaleString()}원</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">받은 쿠폰</h3>
                <p className="text-2xl font-bold text-yellow-600">{receivedAmount.toLocaleString()}원</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/coffee/charge">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    커피쿠폰 충전하기
                  </button>
                </Link>
                
                <Link href="/coffee/send">
                  <button className="w-full border border-purple-300 text-purple-600 py-4 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center">
                    <Gift className="w-5 h-5 mr-2" />
                    커피쿠폰 보내기
                  </button>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
              <div className="space-y-3">
                {coffeeCoupons.slice(0, 3).map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        coupon.type === 'received' ? 'bg-green-100' : 
                        coupon.type === 'sent' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {coupon.type === 'received' ? <Download className="w-4 h-4 text-green-600" /> :
                         coupon.type === 'sent' ? <Gift className="w-4 h-4 text-blue-600" /> :
                         <CreditCard className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {coupon.type === 'received' ? `${coupon.from}님으로부터 받음` :
                           coupon.type === 'sent' ? `${coupon.to}님에게 전송` :
                           '커피쿠폰 충전'}
                        </p>
                        {coupon.mentoringTitle && (
                          <p className="text-sm text-gray-600">{coupon.mentoringTitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{coupon.amount.toLocaleString()}원</p>
                      <p className="text-sm text-gray-500">{coupon.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Received Tab */}
        {activeTab === 'received' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">받은 커피쿠폰</h2>
            <div className="space-y-4">
              {coffeeCoupons.filter(c => c.type === 'received').map((coupon) => (
                <div key={coupon.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{coupon.from}님으로부터</h3>
                      {coupon.mentoringTitle && (
                        <p className="text-sm text-gray-600">{coupon.mentoringTitle}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      coupon.status === 'active' ? 'bg-green-100 text-green-700' :
                      coupon.status === 'used' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {coupon.status === 'active' ? '사용 가능' :
                       coupon.status === 'used' ? '사용 완료' : '만료됨'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{coupon.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">{coupon.amount.toLocaleString()}원</div>
                    <div className="text-sm text-gray-500">{coupon.date}</div>
                  </div>
                  
                  {coupon.status === 'active' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <Link href={`/coffee/use/${coupon.id}`}>
                        <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all">
                          사용하기
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent Tab */}
        {activeTab === 'sent' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">보낸 커피쿠폰</h2>
            <div className="space-y-4">
              {coffeeCoupons.filter(c => c.type === 'sent').map((coupon) => (
                <div key={coupon.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{coupon.to}님에게</h3>
                      {coupon.mentoringTitle && (
                        <p className="text-sm text-gray-600">{coupon.mentoringTitle}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      전송 완료
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{coupon.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">{coupon.amount.toLocaleString()}원</div>
                    <div className="text-sm text-gray-500">{coupon.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchased Tab */}
        {activeTab === 'purchased' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">충전 내역</h2>
            <div className="space-y-4">
              {coffeeCoupons.filter(c => c.type === 'purchased').map((coupon) => (
                <div key={coupon.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">커피쿠폰 충전</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      coupon.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {coupon.status === 'active' ? '사용 가능' : '사용 완료'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">{coupon.amount.toLocaleString()}원</div>
                    <div className="text-sm text-gray-500">{coupon.date}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/coffee/charge">
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center">
                  <Plus className="w-5 h-5 mr-2" />
                  추가 충전하기
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
