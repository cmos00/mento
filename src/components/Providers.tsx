'use client'

import { SupabaseAuthProvider } from './SupabaseAuthProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      {children}
    </SupabaseAuthProvider>
  )
}
