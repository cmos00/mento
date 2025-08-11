'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const coffeePackages = [
  {
    id: 'basic',
    name: '기본 패키지',
    amount: 5,
    price: 25000,
    bonus: 0,
    popular: false
  },
  {
    id: 'popular',
    name: '인기 패키지',
    amount: 12,
    price: 55000,
    bonus: 2,
    popular: true
  },
  {
    id: 'premium',
    name: '프리미엄 패키지',
    amount: 25,
    price: 100000,
    bonus: 8,
    popular: false
  }
]

export default function CoffeePage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string>('popular')
  const [currentBalance, setCurrentBalance] = useState(8) // 임시 데이터

  const handlePurchase = () => {
    // TODO: 결제 로직 구현
    console.log('Purchasing package:', selectedPackage)
    alert('결제 기능은 추후 구현 예정입니다.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-primary-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">커피 쿠폰</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mobile-content">
        {/* 현재 잔액 */}
        <div className="px-4 py-6">
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="text-center">
              <h2 className="text-lg font-medium mb-2">현재 커피 쿠폰 잔액</h2>
              <div className="text-3xl font-bold mb-2">{currentBalance}개</div>
              <p className="text-primary-100 text-sm">
                멘토에게 감사의 마음을 전달하세요
              </p>
            </div>
          </div>
        </div>

        {/* 패키지 선택 */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">패키지 선택</h3>
          <div className="space-y-3">
            {coffeePackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full text-left card transition-all ${
                  selectedPackage === pkg.id
                    ? 'ring-2 ring-primary-500 border-primary-500'
                    : 'hover:shadow-md'
                } ${pkg.popular ? 'border-primary-500 bg-primary-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                      {pkg.popular && (
                        <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                          인기
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>☕ {pkg.amount}개</span>
                      {pkg.bonus > 0 && (
                        <span className="text-primary-600">+ {pkg.bonus}개 보너스</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {pkg.price.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-500">
                      개당 {(pkg.price / (pkg.amount + pkg.bonus)).toLocaleString()}원
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 구매 버튼 */}
        <div className="px-4 pb-6">
          <button
            onClick={handlePurchase}
            className="btn-primary w-full"
          >
            선택한 패키지 구매하기
          </button>
        </div>

        {/* 사용 내역 */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">사용 내역</h3>
          <div className="space-y-3">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">김성민 멘토님께 전달</div>
                  <div className="text-sm text-gray-500">2024.01.15</div>
                </div>
                <div className="text-primary-600 font-semibold">-2개</div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">이지은 멘토님께 전달</div>
                  <div className="text-sm text-gray-500">2024.01.10</div>
                </div>
                <div className="text-primary-600 font-semibold">-1개</div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">패키지 구매</div>
                  <div className="text-sm text-gray-500">2024.01.05</div>
                </div>
                <div className="text-green-600 font-semibold">+12개</div>
              </div>
            </div>
          </div>
        </div>

        {/* 안내사항 */}
        <div className="px-4 pb-6">
          <div className="card bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">안내사항</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 커피 쿠폰은 멘토에게만 전달할 수 있습니다</li>
              <li>• 전달받은 쿠폰은 다른 사람에게 이전할 수 없습니다</li>
              <li>• 실제 카페에서 사용 가능한 쿠폰으로 교환됩니다</li>
              <li>• 구매한 쿠폰은 환불되지 않습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
