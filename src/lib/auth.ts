import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import LinkedInProvider from 'next-auth/providers/linkedin'

// 환경변수 검증
if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
  console.warn('⚠️ LinkedIn 환경변수가 설정되지 않았습니다!')
}

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: {
          scope: "r_liteprofile r_emailaddress",
          response_type: "code"
        }
      },
      token: "https://www.linkedin.com/oauth/v2/accessToken",
      userinfo: {
        url: "https://api.linkedin.com/v2/people/~",
        params: {
          projection: "(id,firstName,lastName,profilePicture(displayImage~:playableStreams))"
        }
      },
      profile(profile, tokens) {
        const defaultName = `${profile.firstName?.localized?.ko_KR || profile.firstName?.localized?.en_US || 'LinkedIn'} ${profile.lastName?.localized?.ko_KR || profile.lastName?.localized?.en_US || 'User'}`
        
        return {
          id: profile.id,
          name: defaultName,
          email: tokens.email || `${profile.id}@linkedin.com`,
          image: profile.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]?.identifier || null
        }
      }
    }),
    
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
      // LinkedIn 로그인 시 이메일 정보 추가 가져오기
      if (account?.provider === 'linkedin' && account.access_token) {
        try {
          const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddresses?q=members&projection=(elements*(handle~))', {
            headers: {
              Authorization: `Bearer ${account.access_token}`
            }
          })
          
          if (emailResponse.ok) {
            const emailData = await emailResponse.json()
            const email = emailData.elements?.[0]?.['handle~']?.emailAddress
            if (email && user) {
              user.email = email
            }
          }
        } catch (error) {
          console.warn('LinkedIn 이메일 가져오기 실패:', error)
        }
        
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
