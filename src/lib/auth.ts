import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// 환경변수 검증
if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
  console.warn('⚠️ LinkedIn 환경변수가 설정되지 않았습니다!')
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "linkedin",
      name: "LinkedIn",
      type: "oauth",
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: {
          scope: "r_liteprofile",
          response_type: "code"
        }
      },
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
        params: {
          grant_type: "authorization_code"
        }
      },
      userinfo: {
        url: "https://api.linkedin.com/v2/people/~",
      },
      profile(profile, tokens) {
        console.log('LinkedIn 프로필 데이터:', profile)
        
        const firstName = profile.firstName?.localized?.ko_KR || profile.firstName?.localized?.en_US || 'LinkedIn'
        const lastName = profile.lastName?.localized?.ko_KR || profile.lastName?.localized?.en_US || 'User'
        
        return {
          id: profile.id,
          name: `${firstName} ${lastName}`,
          email: `${profile.id}@linkedin.com`,
          image: null
        }
      },
      style: {
        logo: "/linkedin.svg",
        bg: "#0077B5", 
        text: "#fff"
      }
    },
    
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
      // LinkedIn 로그인 성공 로그
      if (account?.provider === 'linkedin') {
        console.log('✅ LinkedIn 로그인 성공:', { userId: user.id, email: user.email })
      }
      return true
    },
    
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id
        token.provider = account.provider
        
        if (account.provider === 'demo-login') {
          token.isDemo = true
        } else {
          token.isDemo = false
        }
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        
        if (token.isDemo) {
          (session.user as any).isDemo = true
        }
      }
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
