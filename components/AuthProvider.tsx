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
          // Obtener store_name del perfil con timeout y manejo de errores mejorado
          try {
            console.log('🔍 [AuthProvider] Obteniendo profile para user:', session.user.id)
            
            const { data: profile, error: profileError } = await Promise.race([
              supabase
                .from('profiles')
                .select('store_name') // Solo el campo necesario
                .eq('id', session.user.id)
                .single(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile query timeout')), 5000)
              )
            ]) as any
            
            if (profileError) {
              console.warn('⚠️ [AuthProvider] Error obteniendo profile, usando fallback:', profileError.message)
            }
            
            const storeName = profile?.store_name || null
            console.log('🔍 [AuthProvider] Profile data obtenido:', {
              user_id: session.user.id,
              store_name: storeName,
              has_error: !!profileError
            })
            
            if (mounted) {
              setAuth(session.user, storeName)
            }
          } catch (profileFetchError) {
            console.error('🚨 [AuthProvider] Error crítico obteniendo profile:', profileFetchError)
            // Continuar con autenticación sin store_name
            if (mounted) {
              setAuth(session.user, undefined)
            }
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
            const { data: profile, error: profileError } = await Promise.race([
              supabase
                .from('profiles')
                .select('store_name')
                .eq('id', session.user.id)
                .single(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile query timeout')), 5000)
              )
            ]) as any
            
            if (profileError) {
              console.warn('⚠️ [AuthProvider] Error obteniendo profile SIGNED_IN:', profileError.message)
            }
            
            const storeName = profile?.store_name || null
            console.log('🔍 [AuthProvider] Profile query result onAuthStateChange:', {
              store_name: storeName,
              user_id: session.user.id,
              has_error: !!profileError
            })
            setAuth(session.user, storeName)
          } catch (error) {
            console.error('🚨 [AuthProvider] Error crítico obteniendo profile SIGNED_IN:', error)
            setAuth(session.user, undefined) // Usar null en lugar de undefined
          }
        } else if (event === 'SIGNED_OUT') {
          // Usuario se deslogueó
          console.log('Usuario deslogueado, limpiando store...')
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token se refrescó - actualizar el usuario en el store
          console.log('Token refrescado, actualizando usuario...')
          
          // Obtener store_name por si cambió (usar setAuth para consistencia)
          try {
            const { data: profile, error: profileError } = await Promise.race([
              supabase
                .from('profiles')
                .select('store_name')
                .eq('id', session.user.id)
                .single(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Profile query timeout')), 5000)
              )
            ]) as any
            
            if (profileError) {
              console.warn('⚠️ [AuthProvider] Error obteniendo profile TOKEN_REFRESHED:', profileError.message)
            }
            
            const storeName = profile?.store_name || null
            console.log('🔍 [AuthProvider] Profile obtenido TOKEN_REFRESHED:', {
              store_name: storeName,
              user_id: session.user.id,
              has_error: !!profileError
            })
            setAuth(session.user, storeName)
          } catch (error) {
            console.error('🚨 [AuthProvider] Error crítico obteniendo profile TOKEN_REFRESHED:', error)
            setAuth(session.user, undefined) // Usar null en lugar de undefined
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