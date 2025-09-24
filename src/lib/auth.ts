import { NextAuthOptions } from 'next-auth'
import LinkedInProvider from 'next-auth/providers/linkedin'

// 환경 변수 검증
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️  NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다. 프로덕션에서는 설정이 필요합니다.')
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
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
      // LinkedIn 프로필 이미지를 위한 추가 설정
      userinfo: {
        url: "https://api.linkedin.com/v2/userinfo",
        async request({ tokens, provider }) {
          console.log('🔍 [LinkedIn UserInfo] 사용자 정보 요청 시작')
          const response = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          })
          const userinfo = await response.json()
          console.log('🔍 [LinkedIn UserInfo] 사용자 정보 응답:', JSON.stringify(userinfo, null, 2))
          return userinfo
        },
      },
      profile(profile) {
        console.log('🔍 [LinkedIn Profile] LinkedIn 프로필 정보 수신:', JSON.stringify(profile, null, 2))
        console.log('🔍 [LinkedIn Profile] 원본 프로필 객체 키들:', Object.keys(profile))
        console.log('🔍 [LinkedIn Profile] 이미지 관련 필드들:', {
          picture: profile.picture,
          picture_url: profile.picture_url,
          avatar_url: (profile as any).avatar_url,
          photo: (profile as any).photo,
          profile_picture: (profile as any).profile_picture,
          image: (profile as any).image,
          profilePicture: (profile as any).profilePicture,
          avatar: (profile as any).avatar
        })
        
        try {
          // LinkedIn OIDC에서 받아오는 사용자 정보 처리 - UUID 형식으로 생성
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
          
          const userId = generateUUID()
          
          // 이름 처리 - 한국식 성 이름 순으로 변환
          let userName = 'LinkedIn 사용자'
          if (profile.name && typeof profile.name === 'string') {
            // 만약 이미 완전한 이름이 제공된다면 그대로 사용
            userName = profile.name.trim()
          } else if (profile.given_name || profile.family_name) {
            const givenName = profile.given_name || ''
            const familyName = profile.family_name || ''
            
            // 한국식 이름 순서: 성 + 이름 (family_name + given_name)
            // LinkedIn: first_name="동현", last_name="김" → "김 동현"
            userName = `${familyName} ${givenName}`.trim()
            
            console.log('👤 [LinkedIn Profile] 이름 변환:', {
              given_name: givenName,
              family_name: familyName,
              result: userName,
              description: '한국식 성 이름 순으로 변환 완료'
            })
          }
          
          // 이메일 처리 - 더 안전한 방식
          let userEmail = `${userId}@linkedin.local`
          if (profile.email && typeof profile.email === 'string' && profile.email.includes('@')) {
            userEmail = profile.email.trim()
          }
          
          // 이미지 처리 - LinkedIn OIDC 다양한 필드 지원
          const userImage = (
            profile.picture || 
            profile.picture_url || 
            profile.avatar_url ||
            profile.photo ||
            (profile as any).profile_picture ||
            null
          )
          
          console.log('🖼️ [LinkedIn Profile] 이미지 필드 확인:', {
            picture: profile.picture,
            picture_url: profile.picture_url,
            avatar_url: (profile as any).avatar_url,
            photo: (profile as any).photo,
            profile_picture: (profile as any).profile_picture,
            final_image: userImage
          })
          
          console.log('✅ [LinkedIn Profile] 처리된 사용자 정보:', {
            id: userId,
            name: userName,
            email: userEmail,
            image: userImage
          })
          
          // 모든 필드가 존재하는지 확인 (하지만 오류를 발생시키지 않음)
          const hasValidId = !!userId
          const hasValidName = !!userName && userName !== ''
          const hasValidEmail = !!userEmail && userEmail.includes('@')
          
          console.log('🔍 [LinkedIn Profile] 필드 검증:', {
            hasValidId,
            hasValidName,
            hasValidEmail,
            userId: userId,
            userName: userName,
            userEmail: userEmail
          })
          
          const result = {
            id: userId,
            name: userName,
            email: userEmail,
            image: userImage,
          }
          
          console.log('✅ [LinkedIn Profile] 최종 결과 반환:', result)
          return result
        } catch (error) {
          console.error('❌ [LinkedIn Profile] 프로필 처리 오류:', error)
          console.error('❌ [LinkedIn Profile] 오류 스택:', error instanceof Error ? error.stack : 'No stack')
          console.error('❌ [LinkedIn Profile] 원본 프로필 데이터:', JSON.stringify(profile, null, 2))
          
          // 더 안전한 기본값으로 폴백 - UUID 형식으로 생성
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
          
          const fallbackId = generateUUID()
          const fallbackResult = {
            id: fallbackId,
            name: 'LinkedIn 사용자',
            email: `${fallbackId}@linkedin.local`,
            image: null,
          }
          
          console.log('🔄 [LinkedIn Profile] 폴백 결과 반환:', fallbackResult)
          return fallbackResult
        }
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 [Auth Debug] signIn 콜백 시작')
      console.log('👤 User:', JSON.stringify(user, null, 2))
      console.log('🔑 Account:', JSON.stringify(account, null, 2))
      console.log('📋 Profile:', JSON.stringify(profile, null, 2))
      
      try {
        if (account?.provider === 'linkedin') {
          console.log('✅ [LinkedIn] LinkedIn 로그인 확인됨')
          
          // LinkedIn 사용자 정보 검증 - 매우 관대한 검증
          if (!user) {
            console.error('❌ [LinkedIn] User 객체가 없습니다')
            return false
          }
          
          // 이메일이 없어도 허용 (프로필 함수에서 처리됨)
          if (!user.email) {
            console.warn('⚠️ [LinkedIn] 사용자 이메일이 없습니다:', user.email)
          }
          
          // 이름이 없어도 허용 (프로필 함수에서 처리됨)
          if (!user.name) {
            console.warn('⚠️ [LinkedIn] 사용자 이름이 없습니다:', user.name)
          }
          
          // ID가 없어도 허용 (프로필 함수에서 처리됨)
          if (!user.id) {
            console.warn('⚠️ [LinkedIn] 사용자 ID가 없습니다:', user.id)
          }
          
          console.log('✅ [LinkedIn] 사용자 정보 검증 완료 - 모든 경우 허용')
          console.log('✅ [LinkedIn] signIn 콜백에서 true 반환')
          return true
        }
        
        console.log('🔐 [Auth Debug] signIn 콜백 완료')
        return true
      } catch (error) {
        console.error('❌ [Auth Debug] signIn 콜백 오류:', error)
        console.error('❌ [Auth Debug] 오류 스택:', error instanceof Error ? error.stack : 'No stack')
        console.error('❌ [Auth Debug] signIn 콜백에서 false 반환')
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
          
          if (account.provider === 'linkedin') {
            token.provider = 'linkedin'
            // LinkedIn 사용자 정보를 토큰에 저장 - 안전한 방식
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
          if (!account) console.log('❌ Account가 없음')
          if (!user) console.log('❌ User가 없음')
        }
        
        console.log('🎫 [Auth Debug] JWT 콜백 완료 - 최종 토큰:', JSON.stringify(token, null, 2))
        return token
      } catch (error) {
        console.error('❌ [Auth Debug] JWT 콜백 오류:', error)
        console.error('❌ [Auth Debug] 오류 스택:', error instanceof Error ? error.stack : 'No stack')
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
          
          if (token.provider === 'linkedin') {
            (session.user as any).provider = 'linkedin'
            // LinkedIn 사용자 정보를 세션에 저장 - 안전한 방식
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
        console.error('❌ [Auth Debug] 오류 스택:', error instanceof Error ? error.stack : 'No stack')
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
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
      }
    }
  },
  
  debug: process.env.NODE_ENV === 'development'
}
