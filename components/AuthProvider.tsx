'use client'

import { useEffect, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuthStore } from '@/lib/stores/useAuthStore'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, setUser, setLoading, setStoreName } = useAuthStore()
  
  console.log('🚀 [AuthProvider] Component rendered')

  useEffect(() => {
    console.log('🚀 [AuthProvider] useEffect started')
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
          
          console.log('🔍 [AuthProvider] Profile data:', {
            user_id: session.user.id,
            profile: profile,
            store_name: profile?.store_name
          })
          
          if (mounted) {
            setAuth(session.user, profile?.store_name)
          }
        } else {
          if (mounted) {
            setUser(null)
          }
        }
      } catch (error) {
        console.error('🚨 [AuthProvider] Error getting initial session:', error)
        console.error('🚨 [AuthProvider] Initial session error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          error_object: error
        })
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Usuario se acaba de loguear
          console.log('Usuario logueado, actualizando store...')
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('store_name')
              .eq('id', session.user.id)
              .single()
            
            console.log('🔍 [AuthProvider] Profile query result onAuthStateChange:', {
              profile: profile,
              error: error,
              store_name: profile?.store_name,
              user_id: session.user.id,
              query: `SELECT store_name FROM profiles WHERE id = '${session.user.id}'`
            })
            setAuth(session.user, profile?.store_name)
          } catch (error) {
            console.error('🚨 [AuthProvider] Error obteniendo profile SIGNED_IN:', error)
            console.error('🚨 [AuthProvider] Error details:', {
              message: error instanceof Error ? error.message : 'Unknown error',
              user_id: session.user.id,
              error_object: error
            })
            setAuth(session.user, undefined)
          }
        } else if (event === 'SIGNED_OUT') {
          // Usuario se deslogueó
          console.log('Usuario deslogueado, limpiando store...')
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token se refrescó - actualizar el usuario en el store
          console.log('Token refrescado, actualizando usuario...')
          setUser(session.user)
          
          // También obtener store_name por si cambió (usar setAuth para consistencia)
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('store_name')
              .eq('id', session.user.id)
              .single()
            
            // Usar setAuth para mantener consistencia y persistencia
            console.log('🔍 [AuthProvider] Profile obtenido TOKEN_REFRESHED:', {
              profile: profile,
              store_name: profile?.store_name,
              user_id: session.user.id
            })
            setAuth(session.user, profile?.store_name)
          } catch (error) {
            console.error('🚨 [AuthProvider] Error obteniendo profile TOKEN_REFRESHED:', error)
            console.error('🚨 [AuthProvider] Error details TOKEN_REFRESHED:', {
              message: error instanceof Error ? error.message : 'Unknown error',
              user_id: session.user.id,
              error_object: error
            })
            setAuth(session.user, undefined)
          }
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