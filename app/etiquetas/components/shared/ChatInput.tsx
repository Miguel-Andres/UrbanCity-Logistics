/**
 * Componente de chat genérico para extracción de datos
 * Reutilizable en diferentes vistas del sistema
 */
'use client'

import React, { useState } from 'react'
import { MessageSquare, Sparkles, Plus, Send, Loader2 } from 'lucide-react'

interface ChatInputProps {
  value?: string
  onChange?: (value: string) => void
  onExtract?: () => void
  isExtracting?: boolean
  placeholder?: string
  height?: 'compact' | 'normal'
  width?: 'half' | 'full'
}

export default function ChatInput({ 
  value = '', 
  onChange, 
  onExtract,
  isExtracting = false,
  placeholder = 'Pega aquí el mensaje del cliente para extraer datos automáticamente...',
  height = 'normal',
  width = 'half'
}: ChatInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sincronizar con el value externo si cambia
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const heightClasses = {
    compact: 'min-h-[60px]',
    normal: 'min-h-[75px]'
  }

  const widthClasses = {
    half: 'w-1/2',
    full: 'w-full'
  }

  return (
    <div className={`${widthClasses[width]} space-y-3`}>
      {/* Header simple */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
          <MessageSquare className="w-3 h-3 text-white" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">Extraer Datos</h3>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 space-y-3">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${heightClasses[height]}`}
            disabled={isExtracting}
          />
          <div className="absolute top-1 right-1">
            {localValue.length > 0 && (
              <button
                onClick={() => handleChange('')}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Limpiar"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Botón único de Extraer */}
        <button
          onClick={onExtract}
          disabled={isExtracting || !localValue.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Extrayendo...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              <span>Extraer Datos</span>
            </>
          )}
        </button>
      </div>
      
      <div className="text-center">
        <span className="text-xs text-gray-500">
          Pega tu chat aquí para generar tu etiqueta de envío del comprador
        </span>
      </div>
    </div>
  )
}