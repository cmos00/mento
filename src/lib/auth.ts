import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    // 데모 로그인을 위한 Credentials Provider
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
          // 데모 사용자용 임시 ID 생성
          const demoUserId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          // 데모 사용자 정보 반환 (실제 DB 저장 없이)
          return {
            id: demoUserId,
            email: credentials.email,
            name: credentials.name,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name}`,
            isDemo: true // 데모 사용자 플래그
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
      return true
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.id as string
        // 데모 사용자 정보 추가
        if (token.isDemo) {
          session.user.isDemo = true
        }
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.id = user.id
        // 데모 사용자 플래그 전달
        if ((user as any).isDemo) {
          token.isDemo = true
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}