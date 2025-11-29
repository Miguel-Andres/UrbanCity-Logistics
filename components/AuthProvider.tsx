'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useAuthStore } from '@/lib/stores/useAuthStore'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const { setAuth, setUser, setLoading, setStoreName } = useAuthStore()

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
          console.log('🔍 [AuthProvider] Buscando store_name para usuario:', session.user.id)
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('store_name')
            .eq('id', session.user.id)
            .single()
          
          console.log('📊 [AuthProvider] Profile data:', {
            profile,
            profileError,
            store_name: profile?.store_name,
            userId: session.user.id
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
        console.log('Auth state changed:', event, session?.user?.email, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Usuario se acaba de loguear
          console.log('🔑 [AuthProvider] Usuario logueado, actualizando store...')
          try {
            console.log('🔍 [AuthProvider] Buscando store_name para SIGNED_IN:', session.user.id)
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('store_name')
              .eq('id', session.user.id)
              .single()
            
            console.log('📊 [AuthProvider] Profile SIGNED_IN data:', {
              profile,
              profileError,
              store_name: profile?.store_name,
              userId: session.user.id
            })
            
            setAuth(session.user, profile?.store_name)
          } catch (error) {
            console.error('❌ [AuthProvider] Error obteniendo profile en SIGNED_IN:', error)
            setAuth(session.user, undefined)
          }
        } else if (event === 'SIGNED_OUT') {
          // Usuario se deslogueó
          console.log('🔓 [AuthProvider] Usuario deslogueado, limpiando store y redirigiendo...')
          setUser(null)
          
          // Redirigir automáticamente a access si no estamos ya allí
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/access')) {
            console.log('🔄 [AuthProvider] Redirigiendo a /access...')
            router.push('/access')
          }
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token se refrescó - actualizar el usuario en el store
          console.log('Token refrescado, actualizando usuario...')
          setUser(session.user)
          
          // También obtener store_name por si cambió
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('store_name')
              .eq('id', session.user.id)
              .single()
            
            if (profile?.store_name) {
              setStoreName(profile.store_name)
            }
          } catch (error) {
            console.error('Error obteniendo profile en refresh:', error)
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