import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user?.id || 'mock-user-id'
      }
      return session
    },
    async jwt({ token, user, account }) {
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
