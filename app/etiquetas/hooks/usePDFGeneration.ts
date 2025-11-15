/**
 * Hook para manejar la generación de PDFs
 */
import { useState } from 'react'
import { FormData } from '@/app/etiquetas/types'
import { API_ENDPOINTS } from '@/app/etiquetas/constants'

export function usePDFGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [multiplePdfUrls, setMultiplePdfUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const generatePDF = async (data: FormData): Promise<string | null> => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
        
        // Abrir automáticamente el PDF
        window.open(url, '_blank')
        
        return url
      } else {
        throw new Error('Error al generar el PDF')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMultiplePDFs = async (
    dataList: FormData[], 
    baseData: FormData
  ): Promise<string[]> => {
    setIsGenerating(true)
    setError(null)
    const urls: string[] = []
    
    try {
      for (const label of dataList) {
        const response = await fetch('/api/generar-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...baseData, ...label })
        })
        
        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          urls.push(url)
        }
      }
      
      setMultiplePdfUrls(urls)
      return urls
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return []
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadAllPDFs = (urls: string[]) => {
    urls.forEach((url, index) => {
      downloadPDF(url, `etiqueta_${index + 1}.pdf`)
    })
  }

  const resetPDFs = () => {
    setPdfUrl(null)
    setMultiplePdfUrls([])
    setError(null)
  }

  return {
    isGenerating,
    pdfUrl,
    multiplePdfUrls,
    error,
    generatePDF,
    generateMultiplePDFs,
    downloadPDF,
    downloadAllPDFs,
    resetPDFs
  }
}