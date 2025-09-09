import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import LinkedInProvider from 'next-auth/providers/linkedin'

// 환경 변수 검증
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️  NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다. 프로덕션에서는 설정이 필요합니다.')
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
  },
  
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
      profile(profile) {
        console.log('🔍 [LinkedIn Profile] LinkedIn 프로필 정보 수신:', JSON.stringify(profile, null, 2))
        
        try {
          // LinkedIn OIDC에서 받아오는 사용자 정보 처리
          const userId = profile.sub || profile.id || `linkedin_${Date.now()}`
          
          // 이름 처리 - 더 안전한 방식
          let userName = 'LinkedIn 사용자'
          if (profile.name) {
            userName = profile.name
          } else if (profile.given_name || profile.family_name) {
            userName = `${profile.given_name || ''} ${profile.family_name || ''}`.trim()
          }
          
          // 이메일 처리 - 더 안전한 방식
          let userEmail = `${userId}@linkedin.local`
          if (profile.email && typeof profile.email === 'string') {
            userEmail = profile.email
          }
          
          const userImage = profile.picture || profile.picture_url || null
          
          console.log('✅ [LinkedIn Profile] 처리된 사용자 정보:', {
            id: userId,
            name: userName,
            email: userEmail,
            image: userImage
          })
          
          // 필수 필드 검증
          if (!userId || !userName || !userEmail) {
            console.error('❌ [LinkedIn Profile] 필수 사용자 정보가 누락됨:', {
              userId: !!userId,
              userName: !!userName,
              userEmail: !!userEmail
            })
            throw new Error('필수 사용자 정보가 누락되었습니다')
          }
          
          const result = {
            id: userId,
            name: userName,
            email: userEmail,
            image: userImage,
          }
          
          console.log('✅ [LinkedIn Profile] 최종 결과:', result)
          return result
        } catch (error) {
          console.error('❌ [LinkedIn Profile] 프로필 처리 오류:', error)
          
          // 더 안전한 기본값으로 폴백
          const fallbackId = `linkedin_${Date.now()}`
          const fallbackResult = {
            id: fallbackId,
            name: 'LinkedIn 사용자',
            email: `${fallbackId}@linkedin.local`,
            image: null,
          }
          
          console.log('🔄 [LinkedIn Profile] 폴백 결과:', fallbackResult)
          return fallbackResult
        }
      },
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
          console.log('Generated demo user ID:', demoUserId)
          
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
      
      try {
        if (account?.provider === 'demo-login') {
          console.log('✅ [Demo] 데모 로그인 확인됨')
          return true
        } else if (account?.provider === 'linkedin') {
          console.log('✅ [LinkedIn] LinkedIn 로그인 확인됨')
          
          // LinkedIn 사용자 정보 검증 - 더 관대한 검증
          if (!user?.email || user.email.includes('@linkedin.local')) {
            console.warn('⚠️ [LinkedIn] 사용자 이메일이 없거나 기본값입니다:', user?.email)
            // 이메일이 없어도 로그인 허용 (프로필 함수에서 처리됨)
          }
          
          if (!user?.name || user.name === 'LinkedIn 사용자') {
            console.warn('⚠️ [LinkedIn] 사용자 이름이 없거나 기본값입니다:', user?.name)
            // 이름이 없어도 로그인 허용 (프로필 함수에서 처리됨)
          }
          
          console.log('✅ [LinkedIn] 사용자 정보 검증 완료')
          return true
        }
        
        console.log('🔐 [Auth Debug] signIn 콜백 완료')
        return true
      } catch (error) {
        console.error('❌ [Auth Debug] signIn 콜백 오류:', error)
        return false
      }
    },
    
    async redirect({ url, baseUrl }) {
      console.log('🔄 [Auth Debug] Redirect 콜백 시작')
      console.log('🔗 URL:', url)
      console.log('🏠 Base URL:', baseUrl)
      
      // 로그인 성공 후 메인페이지로 리다이렉트
      if (url === baseUrl || url.startsWith(baseUrl + '/auth/') || url.includes('/api/auth/')) {
        const redirectUrl = baseUrl + '/'
        console.log('✅ 메인페이지로 리다이렉트:', redirectUrl)
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
      
      try {
        if (account && user) {
          console.log('✅ [Auth Debug] Account와 User 모두 존재')
          token.id = user.id
          
          if ((user as any).isDemo) {
            token.isDemo = true
            console.log('✅ [Demo] 데모 사용자 토큰 설정')
          }
          
          if (account.provider === 'linkedin') {
            token.provider = 'linkedin'
            // LinkedIn 사용자 정보를 토큰에 저장
            token.name = user.name || 'LinkedIn 사용자'
            token.email = user.email || `${user.id}@linkedin.local`
            token.image = user.image || null
            console.log('✅ [LinkedIn] LinkedIn 사용자 토큰 설정:', {
              name: token.name,
              email: token.email,
              image: token.image
            })
          }
        } else {
          console.log('⚠️ [Auth Debug] Account 또는 User가 없음')
        }
        
        console.log('🎫 [Auth Debug] JWT 콜백 완료 - 최종 토큰:', JSON.stringify(token, null, 2))
        return token
      } catch (error) {
        console.error('❌ [Auth Debug] JWT 콜백 오류:', error)
        return token
      }
    },
    
    async session({ session, user, token }) {
      console.log('🔄 [Auth Debug] Session 콜백 시작')
      console.log('📋 Session:', JSON.stringify(session, null, 2))
      console.log('👤 User:', JSON.stringify(user, null, 2))
      console.log('🎫 Token:', JSON.stringify(token, null, 2))
      
      try {
        if (session.user) {
          session.user.id = token.id as string
          
          if (token.isDemo) {
            (session.user as any).isDemo = true
            console.log('✅ [Demo] 데모 사용자 세션 설정')
          }
          
          if (token.provider === 'linkedin') {
            (session.user as any).provider = 'linkedin'
            // LinkedIn 사용자 정보를 세션에 저장
            session.user.name = token.name as string || 'LinkedIn 사용자'
            session.user.email = token.email as string || `${token.id}@linkedin.local`
            session.user.image = token.image as string || null
            console.log('✅ [LinkedIn] LinkedIn 사용자 세션 설정:', {
              name: session.user.name,
              email: session.user.email,
              image: session.user.image
            })
          }
        } else {
          console.log('⚠️ [Auth Debug] Session.user가 없음')
        }
        
        console.log('🔄 [Auth Debug] Session 콜백 완료 - 최종 세션:', JSON.stringify(session, null, 2))
        return session
      } catch (error) {
        console.error('❌ [Auth Debug] Session 콜백 오류:', error)
        return session
      }
    }
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  
  debug: process.env.NODE_ENV === 'development'
}
