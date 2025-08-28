import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import LinkedInProvider from 'next-auth/providers/linkedin'

// 환경 변수 검증 (개발 환경에서는 경고만 출력)
if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
  console.warn('⚠️  LinkedIn OAuth 환경 변수가 설정되지 않았습니다. LinkedIn 로그인 기능이 제한됩니다.')
} else {
  console.log('✅ LinkedIn OAuth 환경 변수 확인됨')
  console.log('🔑 Client ID:', process.env.LINKEDIN_CLIENT_ID?.slice(0, 6) + '...')
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️  NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다. 프로덕션에서는 설정이 필요합니다.')
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET ? [
      LinkedInProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        authorization: {
          params: {
            scope: 'openid profile email'
          }
        },
      profile(profile, tokens) {
        try {
          console.log('🔍 [LinkedIn Debug] Profile 함수 호출됨')
          console.log('📋 Raw Profile:', JSON.stringify(profile, null, 2))
          console.log('🎫 Tokens:', JSON.stringify(tokens, null, 2))
          
          // 안전한 프로필 데이터 추출
          const id = profile.sub || profile.id || `linkedin_${Date.now()}`
          let name = 'LinkedIn User'
          
          if (profile.name) {
            name = profile.name
          } else if (profile.given_name || profile.family_name) {
            name = `${profile.given_name || ''} ${profile.family_name || ''}`.trim()
          } else if (profile.localizedFirstName || profile.localizedLastName) {
            name = `${profile.localizedFirstName || ''} ${profile.localizedLastName || ''}`.trim()
          }
          
          const email = profile.email || profile.emailAddress || `${id}@linkedin.placeholder`
          const image = profile.picture || profile.profilePicture || profile.avatar || 
                       `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
          
          const userProfile = {
            id,
            name,
            email,
            image
          }
          
          console.log('✅ [LinkedIn Debug] 최종 프로필:', JSON.stringify(userProfile, null, 2))
          return userProfile
          
        } catch (error) {
          console.error('❌ [LinkedIn Debug] Profile 처리 오류:', error)
          console.error('❌ [LinkedIn Debug] 원본 Profile:', profile)
          
          // 오류 시 최소한의 기본값 반환
          return {
            id: `linkedin_error_${Date.now()}`,
            name: 'LinkedIn User',
            email: `error_${Date.now()}@linkedin.placeholder`,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=error`
          }
        }
      }
    })
    ] : []),
    
    CredentialsProvider({
      id: 'demo-login',
      name: 'Demo Login',
      credentials: {
        email: { label: "이메일", type: "email", placeholder: "demo@example.com" },
        name: { label: "이름", type: "text", placeholder: "데모 사용자" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name) {
          return null
        }

        try {
          const demoUserId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          return {
            id: demoUserId,
            email: credentials.email,
            name: credentials.name,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name}`,
            isDemo: true
          }
        } catch (error) {
          console.error('데모 사용자 생성 오류:', error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 [Auth Debug] signIn 콜백 시작')
      console.log('👤 User:', JSON.stringify(user, null, 2))
      console.log('🔑 Account:', JSON.stringify(account, null, 2))
      console.log('📋 Profile:', JSON.stringify(profile, null, 2))
      
      if (account?.provider === 'linkedin') {
        console.log('✅ [LinkedIn] LinkedIn provider 확인됨')
        
        if (profile) {
          console.log('✅ [LinkedIn] Profile 정보 존재')
        } else {
          console.log('⚠️ [LinkedIn] Profile 정보 없음')
        }
      }
      
      console.log('🔐 [Auth Debug] signIn 콜백 완료')
      return true
    },
    
    async jwt({ token, user, account, profile }) {
      console.log('🎫 [Auth Debug] JWT 콜백 시작')
      console.log('🎫 Token:', JSON.stringify(token, null, 2))
      console.log('👤 User:', JSON.stringify(user, null, 2))
      console.log('🔑 Account:', JSON.stringify(account, null, 2))
      console.log('📋 Profile:', JSON.stringify(profile, null, 2))
      
      if (account && user) {
        console.log('✅ [Auth Debug] Account와 User 모두 존재')
        token.id = user.id
        
        if (account.provider === 'linkedin' && profile) {
          console.log('✅ [LinkedIn] JWT에 LinkedIn 정보 추가')
        }
        
        if ((user as any).isDemo) {
          token.isDemo = true
        }
      }
      
      console.log('🎫 [Auth Debug] JWT 콜백 완료')
      return token
    },
    
    async session({ session, user, token }) {
      console.log('🔄 [Auth Debug] Session 콜백 시작')
      console.log('📋 Session:', JSON.stringify(session, null, 2))
      console.log('👤 User:', JSON.stringify(user, null, 2))
      console.log('🎫 Token:', JSON.stringify(token, null, 2))
      
      if (session.user) {
        session.user.id = token.id as string
        
        if (token.isDemo) {
          (session.user as any).isDemo = true
        }
      }
      
      console.log('🔄 [Auth Debug] Session 콜백 완료')
      return session
    }
  },
  
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error'
  },
  
  session: {
    strategy: 'jwt'
  },
  
  debug: process.env.NODE_ENV === 'development'
}
