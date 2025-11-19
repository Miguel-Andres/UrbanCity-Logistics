/**
 * Panel de acción rápida para generar PDFs
 */
'use client'

import { useState } from 'react'
import { FileText, Download, Printer, Settings, Barcode } from 'lucide-react'
import { FormData } from '@/app/etiquetas/types'

interface LabelPreviewProps {
  formData: FormData
  onPrevStep?: () => void
  onNextStep?: () => void
  nextStepLabel?: string
  nextStepDisabled?: boolean
}

export default function LabelPreview({ 
  formData, 
  onPrevStep, 
  onNextStep, 
  nextStepLabel = "Siguiente",
  nextStepDisabled = false 
}: LabelPreviewProps) {
  const [selectedSize, setSelectedSize] = useState<string>(formData.tipoEtiqueta || '10x15')
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationError, setValidationError] = useState<string>('')

  // Función de validación
  const validateFormData = (): boolean => {
    const errors: string[] = []

    // Validaciones obligatorias
    if (!formData.nombre || formData.nombre.trim() === '') {
      errors.push('Nombre del destinatario')
    }
    
    if (!formData.telefono || formData.telefono.trim() === '') {
      errors.push('Teléfono del destinatario');
    }
    
    if (!formData.direccion || formData.direccion.trim() === '') {
      errors.push('Dirección');
    }
    
    if (!formData.localidad || formData.localidad.trim() === '') {
      errors.push('Localidad');
    }
    
    if (!formData.tipoEnvio) {
      errors.push('Tipo de envío');
    }

    // Validar monto si es COBRAR
    if (formData.tipoEntrega === 'COBRAR' && (!formData.montoACobrar || formData.montoACobrar <= 0)) {
      errors.push('Monto a cobrar (requerido para COBRAR)');
    }

    if (errors.length > 0) {
      setValidationError(`Faltan campos obligatorios: ${errors.join(', ')}`)
      return false
    }

    setValidationError('')
    return true
  }

  const handleGeneratePDF = async () => {
    // Validar antes de generar
    if (!validateFormData()) {
      return
    }

    setIsGenerating(true)
    try {
      // Actualizar formData con el tamaño seleccionado
      const updatedFormData = { ...formData, tipoEtiqueta: selectedSize }
      
      const response = await fetch('/api/generar-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `etiqueta-${selectedSize}-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Error generando PDF')
        alert('Error al generar el PDF. Por favor, intente nuevamente.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el PDF. Por favor, intente nuevamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateZPL = async () => {
    // Validar antes de generar
    if (!validateFormData()) {
      return
    }

    setIsGenerating(true)
    try {
      // Actualizar formData con el tamaño seleccionado
      const updatedFormData = { ...formData, tipoEtiqueta: selectedSize }
      
      const response = await fetch('/api/generar-zpl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      })

      if (response.ok) {
        const zplData = await response.text()
        const blob = new Blob([zplData], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `etiqueta-${formData.tipoEnvio?.replace(/\s+/g, '') || 'SINTIPO'}-${formData.nombre?.substring(0, 12).replace(/\s+/g, '') || 'SINNOMBRE'}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Error generando ZPL')
        alert('Error al generar el ZPL. Por favor, intente nuevamente.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el ZPL. Por favor, intente nuevamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  
  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-7">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-orange-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Acción Rápida
        </h3>

        {/* Selector de tamaño de etiqueta */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Settings className="w-4 h-4 mr-2 inline" />
            Tamaño de Etiqueta
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: '10x10', label: '10×10 cm', desc: 'Compacto' },
              { value: '10x15', label: '10×15 cm', desc: 'Estándar' },
              { value: 'A4', label: 'A4', desc: 'Completo' }
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                  selectedSize === size.value
                    ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium">{size.label}</div>
                <div className="text-xs text-gray-500 mt-1">{size.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Generando...' : 'Generar PDF'}</span>
          </button>

          <button
            onClick={handleGenerateZPL}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm"
          >
            <Barcode className="w-4 h-4" />
            <span>Generar ZPL</span>
          </button>
        </div>

        {/* Mensaje de error de validación */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 font-medium">{validationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        {onPrevStep && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onPrevStep}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 group"
            >
              <span>Anterior</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}