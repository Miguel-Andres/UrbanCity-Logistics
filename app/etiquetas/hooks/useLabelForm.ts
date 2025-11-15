/**
 * Hook personalizado para manejar el estado del formulario de etiquetas
 */
import { useState } from 'react'
import { FormData, TipoEtiqueta, StepType } from '@/app/etiquetas/types'
import { DEFAULT_REMITENTE, DEFAULT_LOCALIDAD } from '@/app/etiquetas/constants'

const initialFormData: FormData = {
  // Datos del destinatario
  nombreDestinatario: '',
  telefonoDestinatario: '',
  direccionDestinatario: '',
  cpDestinatario: '',
  
  // Datos del remitente
  ...DEFAULT_REMITENTE,
  
  // Datos del envío
  nroVenta: '',
  nroEnvio: '',
  nroEnvioCompleto: '',
  chat: '',
  localidad: DEFAULT_LOCALIDAD,
  
  // Producto y servicio
  producto: '',
  totalACobrar: '0', // 0 = solo entregar, 1 = a cobrar
  montoCobrar: '',
  observaciones: '',
  
  // Configuración de etiqueta
  tipoEtiqueta: '10x10' as TipoEtiqueta,
  variante: '',
  
}

export function useLabelForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState<StepType>(1)

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateMultipleFields = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as StepType)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepType)
    }
  }

  const goToStep = (step: StepType) => {
    setCurrentStep(step)
  }

  return {
    formData,
    currentStep,
    updateField,
    updateMultipleFields,
    resetForm,
    nextStep,
    prevStep,
    goToStep
  }
}