/**
 * Zustand store para el formulario de etiqueta individual
 */
import { create } from 'zustand'
import { FormData } from '@/app/etiquetas/types'

interface LabelStore {
  // Estado
  formData: FormData
  
  // Acciones
  updateField: (field: keyof FormData, value: any) => void
  updateMultipleFields: (fields: Partial<FormData>) => void
  resetForm: () => void
  setFormData: (data: FormData) => void
}

const initialFormData: FormData = {
  tipoEtiqueta: '10x15',
  tipoEnvio: 'VENTA',
  nombre: '',
  telefono: '',
  direccion: '',
  localidad: '',
  entreCalles: '',
  observaciones: '',
  tipoEntrega: 'PAGADO',
  montoACobrar: 0,
  fecha: new Date().toISOString().split('T')[0]
}

export const useLabelStore = create<LabelStore>((set) => ({
  formData: initialFormData,

  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),

  updateMultipleFields: (fields) =>
    set((state) => ({
      formData: { ...state.formData, ...fields }
    })),

  resetForm: () =>
    set({
      formData: { ...initialFormData }
    }),

  setFormData: (data) =>
    set({
      formData: data
    })
}))

// Hook para obtener solo los datos del formulario (sin acciones)
export const useFormData = () => useLabelStore((state) => state.formData)