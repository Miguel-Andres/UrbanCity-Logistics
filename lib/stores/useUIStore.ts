/**
 * Zustand store para el estado de la UI
 */
import { create } from 'zustand'
import { TabType, PDFGenerationState } from '@/app/etiquetas/types'

interface UIStore {
  // Estado de las tabs
  activeTab: TabType
  
  // Estado de generación
  pdfGeneration: PDFGenerationState
  
  // Mensajes de error globales
  globalError: string | null
  
  // Acciones
  setActiveTab: (tab: TabType) => void
  setPdfGeneration: (state: Partial<PDFGenerationState>) => void
  setGlobalError: (error: string | null) => void
  clearError: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'single',
  
  pdfGeneration: {
    isGenerating: false,
    pdfUrl: null,
    error: null,
    progress: 0
  },
  
  globalError: null,

  setActiveTab: (tab) =>
    set({ activeTab: tab }),

  setPdfGeneration: (newState) =>
    set((state) => ({
      pdfGeneration: { ...state.pdfGeneration, ...newState }
    })),

  setGlobalError: (error) =>
    set({ globalError: error }),

  clearError: () =>
    set({ globalError: null })
}))

// Selectores
export const useActiveTab = () => useUIStore((state) => state.activeTab)
export const usePdfGeneration = () => useUIStore((state) => state.pdfGeneration)
export const useGlobalError = () => useUIStore((state) => state.globalError)