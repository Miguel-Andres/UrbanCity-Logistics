'use client'

import { useEffect, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuthStore } from '@/lib/stores/useAuthStore'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    let mounted = true

    // Crear cliente con configuración explícita
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          flowType: 'pkce'
        }
      }
    )

    // Función para obtener la sesión inicial
    const getInitialSession = async () => {
      try {
        setLoading(true)
        
        // Obtener sesión actual
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting initial session:', error)
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }
        
        if (session?.user) {
          // Obtener store_name del perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('store_name')
            .eq('id', session.user.id)
            .single()
          
          if (mounted) {
            setAuth(session.user, profile?.store_name)
          }
        } else {
          if (mounted) {
            setUser(null)
          }
        }
      } catch (error) {
        console.error('AuthProvider: Error getting initial session:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Usuario se acaba de loguear
          const { data: profile } = await supabase
            .from('profiles')
            .select('store_name')
            .eq('id', session.user.id)
            .single()
          
          setAuth(session.user, profile?.store_name)
        } else if (event === 'SIGNED_OUT') {
          // Usuario se deslogueó
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token se refrescó
          // Actualizar estado si es necesario
        }
      }
    )

    // Obtener sesión inicial al cargar
    getInitialSession()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setAuth, setUser, setLoading])

  return <>{children}</>
}