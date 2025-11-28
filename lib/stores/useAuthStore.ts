/**
 * Store para manejar autenticación y datos del usuario
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@supabase/supabase-js'

interface AuthState {
  // Estado del usuario
  user: User | null
  storeName: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Acciones
  setUser: (user: User | null) => void
  setStoreName: (storeName: string | null) => void
  setAuth: (user: User, storeName?: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
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

      setAuth: (user, storeName) => set({ 
        user, 
        storeName: storeName || null,
        isAuthenticated: !!user,
        error: null
      }),

      logout: () => set({ 
        user: null, 
        storeName: null, 
        isAuthenticated: false,
        error: null
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        storeName: state.storeName,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)