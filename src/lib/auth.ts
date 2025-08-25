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
          // Supabase에 사용자 정보 저장/업데이트
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', credentials.email)
            .single()

          if (!existingUser) {
            // 새 사용자 생성
            const { data: newUser, error } = await supabase
              .from('users')
              .insert({
                email: credentials.email,
                name: credentials.name,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name}`,
                linkedin_url: '',
                company: '데모 회사',
                position: '데모 직책',
                experience: '3년',
                bio: '데모 사용자입니다.',
                skills: ['데모 스킬 1', '데모 스킬 2']
              })
              .select()
              .single()

            if (error) {
              console.error('데모 사용자 생성 오류:', error)
              return null
            }

            return {
              id: newUser.id,
              email: credentials.email,
              name: credentials.name,
              image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name}`
            }
          } else {
            return {
              id: existingUser.id,
              email: credentials.email,
              name: credentials.name,
              image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name}`
            }
          }
        } catch (error) {
          console.error('데모 사용자 정보 저장 오류:', error)
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
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        token.id = user.id
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
