"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Coffee, ArrowLeft, CreditCard, Building2, Smartphone, Check, Lock, Shield } from 'lucide-react'
import { mockAuth, MockUser } from '@/lib/mockAuth'
import MobileBottomNav from '@/components/MobileBottomNav'

interface CoffeePackage {
  id: string
  name: string
  amount: number
  price: number
  bonus: number
  popular: boolean
  originalPrice?: number
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

export default function CoffeeChargePage() {
  const [mockUser] = useState<MockUser | null>(mockAuth.getUser())
  const [selectedPackage, setSelectedPackage] = useState<string>('popular')
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'package' | 'payment' | 'complete'>('package')

  const coffeePackages: CoffeePackage[] = [
    {
      id: 'basic',
      name: '기본 패키지',
      amount: 5000,
      price: 5000,
      bonus: 0,
      popular: false
    },
    {
      id: 'popular',
      name: '인기 패키지',
      amount: 10000,
      price: 10000,
      bonus: 1000,
      popular: true
    },
    {
      id: 'premium',
      name: '프리미엄 패키지',
      amount: 20000,
      price: 20000,
      bonus: 3000,
      popular: false
    },
    {
      id: 'enterprise',
      name: '기업 패키지',
      amount: 50000,
      price: 50000,
      bonus: 10000,
      popular: false,
      originalPrice: 60000
    }
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: '신용카드',
      icon: <CreditCard className="w-5 h-5" />,
      description: '모든 신용카드 및 체크카드'
    },
    {
      id: 'bank',
      name: '계좌이체',
      icon: <Building2 className="w-5 h-5" />,
      description: '실시간 계좌이체'
    },
    {
      id: 'kakao',
      name: '카카오페이',
      icon: <Smartphone className="w-5 h-5" />,
      description: '카카오페이 잔액 및 카드'
    },
    {
      id: 'naver',
      name: '네이버페이',
      icon: <Smartphone className="w-5 h-5" />,
      description: '네이버페이 잔액 및 카드'
    }
  ]

  const selectedPackageData = coffeePackages.find(pkg => pkg.id === selectedPackage)
  const selectedPaymentData = paymentMethods.find(pay => pay.id === selectedPayment)

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
  }

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId)
  }

  const handleNextStep = () => {
    if (step === 'package') {
      setStep('payment')
    } else if (step === 'payment' && selectedPayment) {
      setStep('complete')
    }
  }

  const handlePayment = async () => {
    if (!selectedPayment) return
    
    setIsProcessing(true)
    
    // TODO: 실제 결제 로직 구현
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setStep('complete')
  }

  const handleBackToPackage = () => {
    setStep('package')
    setSelectedPayment('')
  }

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
        {/* Progress Steps */}
        <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${step === 'package' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'package' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <span className="text-sm font-medium">1</span>
              </div>
              <span className="font-medium">패키지 선택</span>
            </div>
            
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="font-medium">결제 수단</span>
            </div>
            
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            
            <div className={`flex items-center space-x-2 ${step === 'complete' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'complete' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="font-medium">완료</span>
            </div>
          </div>
        </div>

        {/* Package Selection Step */}
        {step === 'package' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">커피쿠폰 패키지 선택</h1>
              <p className="text-gray-600">멘토에게 감사의 마음을 전달할 커피쿠폰을 충전하세요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coffeePackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={`relative p-6 border-2 rounded-2xl transition-all text-left ${
                    selectedPackage === pkg.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                        인기
                      </span>
                    </div>
                  )}
                  
                  {pkg.originalPrice && (
                    <div className="absolute -top-3 right-4">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        할인
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-purple-600">{pkg.amount.toLocaleString()}원</span>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{pkg.originalPrice.toLocaleString()}원</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">커피쿠폰</span>
                      <span className="font-medium">{pkg.amount.toLocaleString()}원</span>
                    </div>
                    {pkg.bonus > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">보너스</span>
                        <span className="font-medium text-green-600">+{pkg.bonus.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">총 금액</span>
                        <span className="text-lg font-bold text-purple-600">{pkg.price.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={!selectedPackage}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                다음 단계
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Payment Method Step */}
        {step === 'payment' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 수단 선택</h1>
              <p className="text-gray-600">편리한 결제 수단을 선택해주세요</p>
            </div>

            {/* Selected Package Summary */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">선택한 패키지</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedPackageData?.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedPackageData?.amount.toLocaleString()}원
                    {selectedPackageData?.bonus && selectedPackageData.bonus > 0 && ` + ${selectedPackageData.bonus.toLocaleString()}원 보너스`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">{selectedPackageData?.price.toLocaleString()}원</p>
                  <button
                    onClick={handleBackToPackage}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentSelect(method.id)}
                  className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                    selectedPayment === method.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedPayment === method.id ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {selectedPayment === method.id && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">보안 안내</p>
                  <ul className="space-y-1">
                    <li>• 모든 결제 정보는 암호화되어 안전하게 처리됩니다</li>
                    <li>• 결제 내역은 개인정보처리방침에 따라 관리됩니다</li>
                    <li>• 문제가 발생하면 고객센터로 연락해주세요</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBackToPackage}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                이전 단계
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedPayment || isProcessing}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    결제 중...
                  </>
                ) : (
                  <>
                    {selectedPackageData?.price.toLocaleString()}원 결제하기
                    <Lock className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
              <p className="text-gray-600">커피쿠폰이 성공적으로 충전되었습니다.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">충전 내역</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">패키지</span>
                  <span className="font-medium">{selectedPackageData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">충전 금액</span>
                  <span className="font-medium">{selectedPackageData?.amount.toLocaleString()}원</span>
                </div>
                {selectedPackageData?.bonus && selectedPackageData.bonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">보너스</span>
                    <span className="font-medium text-green-600">+{selectedPackageData.bonus.toLocaleString()}원</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-medium">총 충전</span>
                    <span className="font-bold text-purple-600">
                      {(selectedPackageData?.amount || 0) + (selectedPackageData?.bonus || 0)}원
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/coffee">
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                  커피쿠폰 관리로 이동
                </button>
              </Link>
              
              <Link href="/coffee/send">
                <button className="w-full border border-purple-300 text-purple-600 py-3 px-6 rounded-xl font-medium hover:bg-purple-50 transition-colors">
                  멘토에게 커피쿠폰 보내기
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
