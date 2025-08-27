import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isDemo?: boolean
      provider?: string
      linkedinId?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    isDemo?: boolean
    provider?: string
    linkedinId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isDemo?: boolean
    provider?: string
    linkedinId?: string
  }
}
