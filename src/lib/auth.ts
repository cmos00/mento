import { NextAuthOptions } from 'next-auth'
import LinkedInProvider from 'next-auth/providers/linkedin'

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'profile',
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.localizedFirstName + ' ' + profile.localizedLastName,
          email: null, // profile scope만 사용하므로 email은 null
          image: profile.profilePicture?.['displayImage~']?.elements?.[0]?.['identifiers']?.[0]?.identifier,
          linkedinId: profile.id,
          linkedinUrl: `https://www.linkedin.com/in/${profile.id}`,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.linkedinId = user.linkedinId
        token.linkedinUrl = user.linkedinUrl
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
