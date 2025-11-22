/**
 * Panel de acción rápida para generar PDFs
 */
'use client'

import { useState } from 'react'
import { FileText, Download, Printer, Settings, Barcode, Copy, ExternalLink, QrCode, PlusCircle } from 'lucide-react'
import { useFormData, useLabelStore } from '@/lib/stores/useLabelStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'

export default function LabelPreview({ 
  onPrevStep, 
  onNextStep, 
  nextStepLabel = "Siguiente",
  nextStepDisabled = false 
}: { 
  onPrevStep?: () => void
  onNextStep?: () => void
  nextStepLabel?: string
  nextStepDisabled?: boolean 
}) {
  const formData = useFormData()
  const { storeName, user } = useAuthStore()
  const { resetForm } = useLabelStore()
  const [selectedSize, setSelectedSize] = useState<string>(formData.tipoEtiqueta || '10x15')
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const [trackingInfo, setTrackingInfo] = useState<{ code: string; url: string } | null>(null)
  const [showNewShipmentButton, setShowNewShipmentButton] = useState(false)

  // Función para copiar al portapapeles
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert(`${type} copiado al portapapeles`)
    } catch (err) {
      console.error('Error al copiar:', err)
      alert('Error al copiar')
    }
  }

  // Función para nuevo envío
  const handleNewShipment = () => {
    resetForm()
    setTrackingInfo(null)
    setValidationError('')
    setShowNewShipmentButton(false)
    setSelectedSize('10x15')
  }

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
      // Actualizar formData con el tamaño seleccionado, store_name y user_id
      const updatedFormData = { 
        ...formData, 
        tipoEtiqueta: selectedSize,
        store_name: storeName || 'Mi Tienda',
        user_id: user?.id || ''
      }
      
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
        
        // Obtener nombre del archivo del header Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `etiqueta-${selectedSize}-${Date.now()}.pdf`
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/)
          if (match) filename = match[1]
        }
        a.download = filename
        
        // Obtener info de tracking
        const trackingCode = response.headers.get('X-Tracking-Code')
        const trackingUrl = response.headers.get('X-Tracking-URL')
        if (trackingCode && trackingUrl) {
          setTrackingInfo({ code: trackingCode, url: trackingUrl })
        }
        
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        // Mostrar botón de nuevo envío
        setShowNewShipmentButton(true)
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
      // Actualizar formData con el tamaño seleccionado, store_name y user_id
      const updatedFormData = { 
        ...formData, 
        tipoEtiqueta: selectedSize,
        store_name: storeName || 'Mi Tienda',
        user_id: user?.id || ''
      }
      
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
        
        // Obtener nombre del archivo del header Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `etiqueta-${formData.tipoEnvio?.replace(/\s+/g, '') || 'SINTIPO'}-${formData.nombre?.substring(0, 12).replace(/\s+/g, '') || 'SINNOMBRE'}.txt`
        if (contentDisposition) {
          const match = contentDisposition.match(/filename=\"(.+)\"/);
          if (match) filename = match[1]
        }
        a.download = filename
        
        // Obtener info de tracking
        const trackingCode = response.headers.get('X-Tracking-Code')
        const trackingUrl = response.headers.get('X-Tracking-URL')
        if (trackingCode && trackingUrl) {
          setTrackingInfo({ code: trackingCode, url: trackingUrl })
        }
        
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        // Mostrar botón de nuevo envío
        setShowNewShipmentButton(true)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error generando ZPL:', response.status, errorData)
        alert(errorData.error || 'Error al generar el ZPL. Por favor, intente nuevamente.')
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
            disabled={isGenerating || showNewShipmentButton}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Generando...' : 'Generar PDF'}</span>
          </button>

          <button
            onClick={handleGenerateZPL}
            disabled={isGenerating || showNewShipmentButton}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm"
          >
            <Barcode className="w-4 h-4" />
            <span>{isGenerating ? 'Generando...' : 'Generar ZPL'}</span>
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

        {/* Info de Tracking */}
        {trackingInfo && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <QrCode className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="text-sm font-semibold text-green-800">Código de Tracking Generado</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-green-200">
                <span className="font-mono text-sm font-bold text-green-700">{trackingInfo.code}</span>
                <button
                  onClick={() => copyToClipboard(trackingInfo.code, 'Código de tracking')}
                  className="p-1 hover:bg-green-100 rounded transition-colors"
                  title="Copiar código"
                >
                  <Copy className="w-4 h-4 text-green-600" />
                </button>
              </div>
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-green-200">
                <span className="text-xs text-green-600 truncate">{trackingInfo.url}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(trackingInfo.url, 'Link de tracking')}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                    title="Copiar link"
                  >
                    <Copy className="w-4 h-4 text-green-600" />
                  </button>
                  <a
                    href={trackingInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                    title="Abrir tracking"
                  >
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón Nueva Etiqueta */}
        {showNewShipmentButton && (
          <button
            onClick={handleNewShipment}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            <span>NUEVA ETIQUETA</span>
          </button>
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