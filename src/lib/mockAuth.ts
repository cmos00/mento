// Mock 인증 상태 관리 유틸리티

export interface MockUser {
  id: string
  name: string
  email: string
  company: string
  jobTitle: string
  experience: string
  linkedinId: string
  linkedinUrl: string
}

export const mockAuth = {
  // 로그인 상태 확인
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('isLoggedIn') === 'true'
  },

  // 사용자 정보 가져오기
  getUser: (): MockUser | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('mockUser')
    return user ? JSON.parse(user) : null
  },

  // 로그인
  login: (user: MockUser): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('mockUser', JSON.stringify(user))
    localStorage.setItem('isLoggedIn', 'true')
  },

  // 로그아웃
  logout: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('mockUser')
    localStorage.removeItem('isLoggedIn')
  },

  // 사용자 정보 업데이트
  updateUser: (updates: Partial<MockUser>): void => {
    if (typeof window === 'undefined') return
    const currentUser = mockAuth.getUser()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      localStorage.setItem('mockUser', JSON.stringify(updatedUser))
    }
  }
}

// 기본 Mock 사용자 데이터
export const defaultMockUser: MockUser = {
  id: 'mock-user-123',
  name: '김멘티',
  email: 'mentee@example.com',
  company: '테크컴퍼니',
  jobTitle: '시니어 개발자',
  experience: '5년',
  linkedinId: 'mock-linkedin-123',
  linkedinUrl: 'https://www.linkedin.com/in/mock-user'
}
