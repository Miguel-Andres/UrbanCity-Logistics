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
      nombre: '',
      telefono: '',
      direccion: '',
      localidad: '',
      montoACobrar: 0,
      observaciones: ''
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
      nombre: extracted.nombre || '',
      telefono: extracted.telefono || '',
      direccion: extracted.direccion || '',
      localidad: extracted.localidad || 'La Plata',
      montoACobrar: extracted.montoACobrar || 0,
      observaciones: extracted.observaciones || ''
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