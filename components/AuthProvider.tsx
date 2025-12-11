'use client'

import { useEffect, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuthStore } from '@/lib/stores/useAuthStore'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider simplificado
 * - Maneja solo autenticación de usuario (login/logout)
 * - NO obtiene profile data (eso se hace en Server Components)
 * - Mantiene el estado de autenticación en useAuthStore
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      }
    )

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          if (session?.user) {
            setAuth(session.user, undefined) // Solo user, profile viene del servidor
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('AuthProvider: Error getting session:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return

        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              setAuth(session.user, undefined)
            }
            break
          
          case 'SIGNED_OUT':
            setUser(null)
            break
          
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              setAuth(session.user, undefined)
            }
            break
        }
      }
    )

    getInitialSession()

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [setAuth, setUser, setLoading])

  return <>{children}</>
}