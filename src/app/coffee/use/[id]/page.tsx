"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Coffee, ArrowLeft, QrCode, MapPin, Clock, CheckCircle, Download, Share2 } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

interface CoffeeCoupon {
  id: number
  amount: number
  from: string
  message: string
  date: string
  status: 'active' | 'used' | 'expired'
  mentoringTitle: string
  qrCode: string
  cafeLocations: string[]
  expiryDate: string
}

export default function CoffeeUsePage({ params }: { params: { id: string } }) {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [coupon, setCoupon] = useState<CoffeeCoupon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    // Mock 데이터 로딩 시뮬레이션
    const loadCoupon = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock 커피쿠폰 데이터
      const mockCoupon: CoffeeCoupon = {
        id: parseInt(params.id),
        amount: 5000,
        from: '김시니어',
        message: '멘토링에 감사드립니다! 백엔드 아키텍처 설계에 대한 조언이 정말 도움이 많이 되었습니다.',
        date: '2024-03-15',
        status: 'active',
        mentoringTitle: '백엔드 아키텍처 설계',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=coffee-coupon-12345',
        cafeLocations: [
          '스타벅스 강남점 (서울 강남구 테헤란로 123)',
          '투썸플레이스 강남점 (서울 강남구 역삼동 456)',
          '할리스 강남점 (서울 강남구 논현동 789)',
          '이디야 강남점 (서울 강남구 삼성동 101)'
        ],
        expiryDate: '2024-06-15'
      }
      
      setCoupon(mockCoupon)
      setIsLoading(false)
    }

    loadCoupon()
  }, [params.id])

  const handleUseCoupon = async () => {
    if (!coupon) return
    
    // TODO: 실제 API 호출 로직 구현
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setCoupon(prev => prev ? { ...prev, status: 'used' as const } : null)
    alert('커피쿠폰이 성공적으로 사용되었습니다!')
  }

  const handleDownloadQR = () => {
    // TODO: 실제 QR코드 다운로드 로직 구현
    alert('QR코드 다운로드 기능은 추후 구현 예정입니다.')
  }

  const handleShare = () => {
    // TODO: 실제 공유 로직 구현
    if (navigator.share) {
      navigator.share({
        title: 'CareerTalk 커피쿠폰',
        text: `${coupon?.from}님으로부터 받은 ${coupon?.amount.toLocaleString()}원 커피쿠폰입니다.`,
        url: window.location.href
      })
    } else {
      alert('공유 기능은 지원되지 않는 브라우저입니다.')
    }
  }

  if (!mockUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A5ACD] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!coupon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">커피쿠폰을 찾을 수 없습니다</h3>
          <p className="text-gray-600">잘못된 접근이거나 만료된 쿠폰입니다.</p>
          <Link href="/coffee" className="mt-4 inline-block text-purple-600 hover:text-purple-700">
            커피쿠폰 관리로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/coffee" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerTalk</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Coupon Header */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {coupon.from.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {coupon.from}님으로부터 받은 커피쿠폰
            </h1>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {coupon.amount.toLocaleString()}원
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>받은 날짜: {coupon.date}</span>
              <span>•</span>
              <span>만료일: {coupon.expiryDate}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center mb-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              coupon.status === 'active' ? 'bg-green-100 text-green-700' :
              coupon.status === 'used' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {coupon.status === 'active' ? '사용 가능' :
               coupon.status === 'used' ? '사용 완료' : '만료됨'}
            </span>
          </div>

          {/* Message */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-gray-700 text-center italic">"{coupon.message}"</p>
          </div>

          {/* Mentoring Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              멘토링: <span className="font-medium text-gray-900">{coupon.mentoringTitle}</span>
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        {coupon.status === 'active' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">커피쿠폰 사용하기</h2>
            
            <div className="text-center mb-6">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 max-w-sm mx-auto">
                {showQR ? (
                  <div className="space-y-4">
                    <img 
                      src={coupon.qrCode} 
                      alt="QR Code" 
                      className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      카페에서 이 QR코드를 스캔하여 커피쿠폰을 사용하세요
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                      <QrCode className="w-24 h-24 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      QR코드를 보려면 아래 버튼을 클릭하세요
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowQR(!showQR)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {showQR ? 'QR코드 숨기기' : 'QR코드 보기'}
              </button>
              
              <button
                onClick={handleDownloadQR}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </button>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        {coupon.status === 'active' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">사용 방법</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">QR코드 확인</p>
                  <p className="text-sm text-gray-600">위의 QR코드 버튼을 클릭하여 코드를 확인하세요</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">카페 방문</p>
                  <p className="text-sm text-gray-600">아래 안내된 카페 중 편리한 곳을 방문하세요</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">QR코드 스캔</p>
                  <p className="text-sm text-gray-600">카페 직원에게 QR코드를 보여주거나 스캔해주세요</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">커피 수령</p>
                  <p className="text-sm text-gray-600">쿠폰 금액에 해당하는 커피를 받으세요</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cafe Locations */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-purple-600" />
            사용 가능한 카페
          </h2>
          <div className="space-y-3">
            {coupon.cafeLocations.map((location, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{location}</p>
                  <p className="text-sm text-gray-600">영업시간: 07:00 - 22:00</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {coupon.status === 'active' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUseCoupon}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                커피쿠폰 사용하기
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                공유하기
              </button>
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">중요 안내사항</p>
              <ul className="space-y-1">
                <li>• 커피쿠폰은 만료일까지 사용 가능합니다</li>
                <li>• 한 번 사용하면 재사용할 수 없습니다</li>
                <li>• 다른 사람에게 양도할 수 없습니다</li>
                <li>• 사용 후에는 환불되지 않습니다</li>
                <li>• 문제가 발생하면 고객센터로 연락해주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
