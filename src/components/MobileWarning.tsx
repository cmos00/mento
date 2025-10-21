"use client"

import { useEffect, useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false)
  const [showDesktop, setShowDesktop] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 사용자 선택 확인
    const userPreference = localStorage.getItem('viewMode')
    if (userPreference === 'desktop') {
      setShowDesktop(true)
      
      // 뷰포트 설정 즉시 적용
      const viewport = document.querySelector('meta[name=viewport]')
      if (viewport) {
        viewport.setAttribute('content', 'width=1280, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes')
      }
      document.body.classList.add('desktop-mode')
      document.documentElement.style.minWidth = '1280px'
      
      return
    }

    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 768
      
      setIsMobile(isMobileDevice || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleShowDesktop = () => {
    // 사용자 선택을 로컬 스토리지에 저장
    localStorage.setItem('viewMode', 'desktop')
    
    // 뷰포트 메타 태그를 데스크톱 모드로 변경
    const viewport = document.querySelector('meta[name=viewport]')
    if (viewport) {
      viewport.setAttribute('content', 'width=1280, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes')
    }
    
    // body에 데스크톱 모드 클래스 추가
    document.body.classList.add('desktop-mode')
    document.documentElement.style.minWidth = '1280px'
    
    setShowDesktop(true)
  }

  // PC 화면으로 보기를 선택했거나 데스크톱이면 표시하지 않음
  if (!isMobile || showDesktop) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Monitor className="w-10 h-10 text-purple-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">죄송합니다</h1>
        <p className="text-gray-600 mb-2 text-lg font-medium">PC에서 접속해주세요</p>
        <p className="text-gray-500 mb-8 text-sm">
          모바일 버전은 현재 제공하고 있지 않습니다.
        </p>
        
        <button
          onClick={handleShowDesktop}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <Monitor className="w-5 h-5" />
          <span>PC 화면으로 보기</span>
        </button>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 mr-1" />
              모바일 제한
            </div>
            <div className="flex items-center">
              <Monitor className="w-4 h-4 mr-1" />
              PC 권장
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

