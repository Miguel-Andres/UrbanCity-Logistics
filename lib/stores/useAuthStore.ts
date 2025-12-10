/**
 * Store para manejar autenticación y datos del usuario
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@supabase/supabase-js'

interface AuthState {
  // Estado del usuario
  user: User | null
  storeName: string | null // Mantener camelCase para consistencia del frontend
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Acciones
  setUser: (user: User | null) => void
  setStoreName: (storeName: string | null) => void
  setAuth: (user: User, storeName?: string) => void // storeName puede venir como store_name de DB
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Getter computado para obtener store_name en formato DB
  getStoreNameForDB: () => string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      storeName: null,
      isAuthenticated: false,
      isLoading: true, // Inicia en true mientras carga
      error: null,

      // Acciones
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null
      }),

      setStoreName: (storeName) => set({ storeName }),

      setAuth: (user, storeName) => {
        console.log('🔍 [useAuthStore] setAuth called with:', {
          user_id: user?.id,
          storeName: storeName,
          storeName_type: typeof storeName,
          storeName_final: storeName || null
        })
        set({ 
          user, 
          storeName: storeName || null,
          isAuthenticated: !!user,
          error: null
        })
      },

      logout: () => set({ 
        user: null, 
        storeName: null, 
        isAuthenticated: false,
        error: null
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Getter computado para store_name en formato DB
      getStoreNameForDB: () => {
        const state = get()
        return state.storeName || 'Mi Tienda'
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        storeName: state.storeName,
        isAuthenticated: state.isAuthenticated,
      }),
      // No persistir isLoading porque debe volver a true en cada carga
    }
  )
)