/**
 * Hook para manejar etiquetas múltiples
 */
import { useState } from 'react'
import { LabelData } from '@/app/etiquetas/types'

export function useMultipleLabels() {
  const [labels, setLabels] = useState<LabelData[]>([])
  const [chatText, setChatText] = useState('')

  const addNewLabel = () => {
    const newLabel: LabelData = {
      id: Date.now().toString(),
      nombreDestinatario: '',
      telefonoDestinatario: '',
      direccionDestinatario: '',
      cpDestinatario: '',
      localidad: 'La Plata',
      variante: '',
      totalACobrar: '0',
      montoCobrar: '',
      observaciones: '',
      chat: ''
    }
    setLabels(prev => [...prev, newLabel])
  }

  const updateLabel = (id: string, field: keyof LabelData, value: string) => {
    setLabels(prev => prev.map(label => 
      label.id === id ? { ...label, [field]: value } : label
    ))
  }

  const removeLabel = (id: string) => {
    setLabels(prev => prev.filter(label => label.id !== id))
  }

  const setLabelsFromExtraction = (extractedLabels: Partial<LabelData>[]) => {
    const newLabels: LabelData[] = extractedLabels.map((extracted, index) => ({
      id: Date.now().toString() + Math.random(),
      nombreDestinatario: extracted.nombreDestinatario || '',
      telefonoDestinatario: extracted.telefonoDestinatario || '',
      direccionDestinatario: extracted.direccionDestinatario || '',
      cpDestinatario: extracted.cpDestinatario || '',
      localidad: extracted.localidad || 'La Plata',
      variante: extracted.variante || '',
      totalACobrar: extracted.totalACobrar || '0',
      montoCobrar: extracted.montoCobrar || '',
      observaciones: extracted.observaciones || '',
      chat: extracted.chat || ''
    }))
    setLabels(newLabels)
  }

  const clearLabels = () => {
    setLabels([])
    setChatText('')
  }

  const getLabelsCount = () => labels.length

  const getLabelById = (id: string) => {
    return labels.find(label => label.id === id)
  }

  return {
    labels,
    chatText,
    setChatText,
    addNewLabel,
    updateLabel,
    removeLabel,
    setLabelsFromExtraction,
    clearLabels,
    getLabelsCount,
    getLabelById
  }
}