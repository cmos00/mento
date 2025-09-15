'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function DebugProfilePage() {
  const { data: session, status } = useSession()
  const [dbUser, setDbUser] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`🔍 [Debug] ${message}`)
  }

  useEffect(() => {
    if (session) {
      addLog('세션 감지됨')
      addLog(`세션 사용자 이름: ${session.user?.name}`)
      addLog(`세션 사용자 이메일: ${session.user?.email}`)
      addLog(`세션 사용자 이미지: ${session.user?.image || '없음'}`)
      addLog(`세션 프로바이더: ${(session.user as any)?.provider || '알 수 없음'}`)
    }
  }, [session])

  const testUpdateUser = async () => {
    addLog('사용자 정보 업데이트 테스트 시작...')
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        addLog('✅ 사용자 정보 업데이트 성공')
      } else {
        addLog(`❌ 사용자 정보 업데이트 실패: ${response.status}`)
      }
    } catch (error) {
      addLog(`❌ 사용자 정보 업데이트 오류: ${error}`)
    }
  }

  const testGetUser = async () => {
    addLog('DB에서 사용자 정보 조회 테스트 시작...')
    try {
      const response = await fetch('/api/user/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setDbUser(userData.user)
        addLog('✅ DB에서 사용자 정보 조회 성공')
        addLog(`DB 사용자 이름: ${userData.user?.name || '없음'}`)
        addLog(`DB 사용자 이미지: ${userData.user?.image || '없음'}`)
        addLog(`DB 사용자 avatar_url: ${userData.user?.avatar_url || '없음'}`)
      } else {
        addLog(`❌ DB 사용자 정보 조회 실패: ${response.status}`)
      }
    } catch (error) {
      addLog(`❌ DB 사용자 정보 조회 오류: ${error}`)
    }
  }

  const testLinkedInLogout = () => {
    addLog('LinkedIn 로그아웃 후 재로그인 권장')
    addLog('1. 로그아웃')
    addLog('2. LinkedIn으로 다시 로그인')
    addLog('3. 콘솔에서 LinkedIn 프로필 정보 확인')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">LinkedIn 프로필 이미지 디버깅</h1>

        {/* 현재 상태 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">현재 상태</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">세션 정보</h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>상태:</strong> {status}</p>
                <p><strong>이름:</strong> {session?.user?.name || '없음'}</p>
                <p><strong>이메일:</strong> {session?.user?.email || '없음'}</p>
                <p><strong>이미지:</strong> {session?.user?.image || '없음'}</p>
                <p><strong>프로바이더:</strong> {(session?.user as any)?.provider || '알 수 없음'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">DB 정보</h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>이름:</strong> {dbUser?.name || '조회 필요'}</p>
                <p><strong>이미지:</strong> {dbUser?.image || '없음'}</p>
                <p><strong>Avatar URL:</strong> {dbUser?.avatar_url || '없음'}</p>
                <p><strong>업데이트:</strong> {dbUser?.updated_at || '알 수 없음'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 테스트 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">이미지 테스트</h2>
          <div className="flex space-x-4">
            {/* 세션 이미지 */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">세션 이미지</h3>
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden">
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="세션 이미지"
                    className="w-full h-full object-cover"
                    onError={() => addLog('❌ 세션 이미지 로딩 실패')}
                    onLoad={() => addLog('✅ 세션 이미지 로딩 성공')}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                    없음
                  </div>
                )}
              </div>
            </div>

            {/* DB 이미지 */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">DB 이미지</h3>
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden">
                {dbUser?.image ? (
                  <img 
                    src={dbUser.image} 
                    alt="DB 이미지"
                    className="w-full h-full object-cover"
                    onError={() => addLog('❌ DB 이미지 로딩 실패')}
                    onLoad={() => addLog('✅ DB 이미지 로딩 성공')}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                    조회 필요
                  </div>
                )}
              </div>
            </div>

            {/* DB Avatar URL */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">DB Avatar URL</h3>
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden">
                {dbUser?.avatar_url ? (
                  <img 
                    src={dbUser.avatar_url} 
                    alt="DB Avatar"
                    className="w-full h-full object-cover"
                    onError={() => addLog('❌ DB Avatar URL 로딩 실패')}
                    onLoad={() => addLog('✅ DB Avatar URL 로딩 성공')}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
                    조회 필요
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 테스트 버튼들 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">테스트 액션</h2>
          <div className="space-y-3">
            <button
              onClick={testUpdateUser}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-3 hover:bg-blue-600"
            >
              사용자 정보 업데이트 테스트
            </button>
            <button
              onClick={testGetUser}
              className="bg-green-500 text-white px-4 py-2 rounded mr-3 hover:bg-green-600"
            >
              DB에서 사용자 정보 조회
            </button>
            <button
              onClick={testLinkedInLogout}
              className="bg-purple-500 text-white px-4 py-2 rounded mr-3 hover:bg-purple-600"
            >
              재로그인 가이드
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              페이지 새로고침
            </button>
          </div>
        </div>

        {/* 로그 */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">디버깅 로그</h2>
          <div className="bg-black text-green-400 p-4 rounded text-sm font-mono h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
            {logs.length === 0 && <div>로그가 없습니다...</div>}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            로그 지우기
          </button>
        </div>

        {/* 권장 테스트 절차 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">권장 테스트 절차</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>현재 페이지에서 "DB에서 사용자 정보 조회" 버튼 클릭</li>
            <li>콘솔에서 LinkedIn 프로필 수집 로그 확인</li>
            <li>이미지가 없다면 "사용자 정보 업데이트 테스트" 클릭</li>
            <li>여전히 없다면 로그아웃 후 LinkedIn으로 재로그인</li>
            <li>재로그인 시 콘솔에서 "🔍 [LinkedIn Profile]" 로그 확인</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
