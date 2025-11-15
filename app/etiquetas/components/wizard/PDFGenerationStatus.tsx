/**
 * Componente de estado de generación de PDF
 */
'use client'

import { Check, AlertCircle, ArrowLeft, Download, Printer } from 'lucide-react'
import { PDFGenerationState } from '@/app/etiquetas/types'

interface PDFGenerationStatusProps {
  state: PDFGenerationState
  onDownload?: () => void
  onPrint?: () => void
  onRetry?: () => void
  onNewLabel?: () => void
  downloadLabel?: string
}

export default function PDFGenerationStatus({
  state,
  onDownload,
  onPrint,
  onRetry,
  onNewLabel,
  downloadLabel = "etiqueta"
}: PDFGenerationStatusProps) {
  if (state.isGenerating) {
    return (
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-full blur-3xl scale-150"></div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4 mt-8">
          Generando tu etiqueta...
        </h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Estamos procesando tu etiqueta PDF con alta calidad para impresión
        </p>
        
        {/* Progress bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    )
  }

  if (state.pdfUrl) {
    return (
      <>
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Etiqueta generada exitosamente!
        </h3>
        <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
          Tu etiqueta profesional está lista para descargar o imprimir
        </p>
        
        <div className="space-y-4">
          {onDownload && (
            <button
              onClick={onDownload}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg group"
            >
              <Download className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span>Descargar Etiqueta PDF</span>
            </button>
          )}
          
          {onPrint && (
            <button
              onClick={onPrint}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg group"
            >
              <Printer className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span>Imprimir Etiqueta</span>
            </button>
          )}
          
          {onNewLabel && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={onNewLabel}
                className="w-full text-orange-600 hover:text-orange-700 font-semibold py-4 px-8 transition-all duration-200 hover:bg-orange-50 rounded-xl"
              >
                Generar otra etiqueta
              </button>
            </div>
          )}
        </div>
      </>
    )
  }

  if (state.error) {
    return (
      <>
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-full blur-3xl scale-150"></div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Error al generar etiqueta
        </h3>
        <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
          {state.error}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver y corregir datos</span>
          </button>
        )}
      </>
    )
  }

  return null
}