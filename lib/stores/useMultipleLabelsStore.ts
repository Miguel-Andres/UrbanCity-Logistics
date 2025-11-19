/**
 * Zustand store para manejar múltiples etiquetas
 */
import { create } from 'zustand'
import { FormData } from '@/app/etiquetas/types'

interface LabelWithId extends FormData {
  id: string
}

interface MultipleLabelsStore {
  // Estado
  labels: LabelWithId[]
  selectedIds: string[]
  isGeneratingAll: boolean
  
  // Acciones
  addLabel: (data: FormData) => void
  updateLabel: (id: string, data: Partial<FormData>) => void
  removeLabel: (id: string) => void
  clearLabels: () => void
  toggleLabelSelection: (id: string) => void
  selectAllLabels: () => void
  deselectAllLabels: () => void
  setGeneratingAll: (isGenerating: boolean) => void
  batchUpdateLabels: (updates: Array<{ id: string; data: Partial<FormData> }>) => void
}

export const useMultipleLabelsStore = create<MultipleLabelsStore>((set, get) => ({
  labels: [],
  selectedIds: [],
  isGeneratingAll: false,

  addLabel: (data) =>
    set((state) => ({
      labels: [
        ...state.labels,
        {
          ...data,
          id: `label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      ]
    })),

  updateLabel: (id, data) =>
    set((state) => ({
      labels: state.labels.map((label) =>
        label.id === id ? { ...label, ...data } : label
      )
    })),

  removeLabel: (id) =>
    set((state) => ({
      labels: state.labels.filter((label) => label.id !== id),
      selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id)
    })),

  clearLabels: () =>
    set({
      labels: [],
      selectedIds: []
    }),

  toggleLabelSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id]
    })),

  selectAllLabels: () =>
    set((state) => ({
      selectedIds: state.labels.map((label) => label.id)
    })),

  deselectAllLabels: () =>
    set({ selectedIds: [] }),

  setGeneratingAll: (isGenerating) =>
    set({ isGeneratingAll: isGenerating }),

  batchUpdateLabels: (updates) =>
    set((state) => {
      const labelsMap = new Map(state.labels.map(label => [label.id, label]))
      
      updates.forEach(({ id, data }) => {
        if (labelsMap.has(id)) {
          labelsMap.set(id, { ...labelsMap.get(id)!, ...data })
        }
      })
      
      return {
        labels: Array.from(labelsMap.values())
      }
    })
}))

// Selectores
export const useLabels = () => useMultipleLabelsStore((state) => state.labels)
export const useSelectedLabels = () => useMultipleLabelsStore((state) => {
  const { labels, selectedIds } = state
  return labels.filter(label => selectedIds.includes(label.id))
})
export const useSelectedIds = () => useMultipleLabelsStore((state) => state.selectedIds)
export const useIsGeneratingAll = () => useMultipleLabelsStore((state) => state.isGeneratingAll)