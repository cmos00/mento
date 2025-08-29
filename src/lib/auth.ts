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
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET ? [
      {
        id: "linkedin" as const,
        name: "LinkedIn",
        type: "oauth" as const,
        issuer: "https://www.linkedin.com/oauth",
        authorization: {
          url: "https://www.linkedin.com/oauth/v2/authorization",
          params: {
            scope: "openid profile email",
            response_type: "code",
          },
        },
        token: {
          url: "https://www.linkedin.com/oauth/v2/accessToken",
          params: {
            grant_type: "authorization_code",
          },
        },
        userinfo: {
          url: "https://api.linkedin.com/v2/userinfo",
          params: {},
        },

        clientId: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        client: {
          token_endpoint_auth_method: "client_secret_post" as const,
        },
        checks: ["state" as const],
        idToken: true,
        profile(profile: any) {
          console.log('🔍 [LinkedIn Debug] Profile 함수 호출됨')
          console.log('📋 Raw Profile:', JSON.stringify(profile, null, 2))
          
          return {
            id: profile.sub || profile.id || `linkedin_${Date.now()}`,
            name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'LinkedIn User',
            email: profile.email || `linkedin_${profile.sub || Date.now()}@example.com`,
            image: profile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'LinkedIn User')}`
          }
        }
      }
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
          // crypto를 사용하여 더 확실한 UUID v4 생성
          const generateUUID = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
              return crypto.randomUUID()
            }
            // 백업 방법: 더 정확한 UUID v4 형식
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }
          
          const demoUserId = generateUUID()
          console.log('Generated demo user ID:', demoUserId) // 디버깅용
          
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
    
    async redirect({ url, baseUrl }) {
      console.log('🔄 [Auth Debug] Redirect 콜백 시작')
      console.log('🔗 URL:', url)
      console.log('🏠 Base URL:', baseUrl)
      
      // 로그인 성공 후 홈페이지(질문 리스트)로 리다이렉트
      if (url === baseUrl || url.startsWith(baseUrl + '/auth/') || url.includes('/api/auth/')) {
        const redirectUrl = baseUrl + '/questions'
        console.log('✅ 홈페이지로 리다이렉트:', redirectUrl)
        return redirectUrl
      }
      
      console.log('✅ 기본 리다이렉트:', url)
      return url
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
  

  
  session: {
    strategy: 'jwt'
  },
  
  debug: process.env.NODE_ENV === 'development'
}
