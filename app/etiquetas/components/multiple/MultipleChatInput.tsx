/**
 * Input de chat para múltiples etiquetas
 */
'use client'

import { MessageSquare, Zap, Plus } from 'lucide-react'

interface MultipleChatInputProps {
  value: string
  onChange: (value: string) => void
  onExtract: () => void
  onAddManual: () => void
  isExtracting: boolean
}

export default function MultipleChatInput({
  value,
  onChange,
  onExtract,
  onAddManual,
  isExtracting
}: MultipleChatInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="mb-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pega múltiples chats aquí (separa cada chat con líneas en blanco)..."
          className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
        />
      </div>

      <div className="flex space-x-2">
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
          onClick={onAddManual}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Manual</span>
        </button>
      </div>
    </div>
  )
}