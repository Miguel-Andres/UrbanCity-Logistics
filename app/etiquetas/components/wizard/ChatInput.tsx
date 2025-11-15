/**
 * Componente Chat Input para pegar mensajes de WhatsApp
 */
'use client'

import { MessageSquare, Zap } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onExtract: () => void
  onManual: () => void
  isExtracting: boolean
  placeholder?: string
  multiple?: boolean
}

export default function ChatInput({
  value,
  onChange,
  onExtract,
  onManual,
  isExtracting,
  placeholder = "Pega el texto del chat aquí...",
  multiple = false
}: ChatInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${
            multiple ? 'h-32' : 'h-24'
          }`}
        />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onExtract}
          disabled={!value.trim() || isExtracting}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-md disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isExtracting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Extrayendo...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Extraer Datos</span>
            </>
          )}
        </button>

        <button 
          onClick={onManual}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          Manual
        </button>
      </div>
    </div>
  )
}