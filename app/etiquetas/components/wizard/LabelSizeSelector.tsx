/**
 * Selector de tamaño de etiqueta
 */
'use client'

import { TipoEtiqueta } from '@/app/etiquetas/types'
import { MEDIDAS_ETIQUETAS } from '@/app/etiquetas/config/medidasEtiquetas'

interface LabelSizeSelectorProps {
  selectedSize?: TipoEtiqueta
  onSizeChange: (size: TipoEtiqueta) => void
}

export default function LabelSizeSelector({ selectedSize, onSizeChange }: LabelSizeSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-900">
          Tamaño de etiqueta
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(MEDIDAS_ETIQUETAS).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onSizeChange(key as TipoEtiqueta)}
            className={`p-2 rounded border text-xs transition-colors ${
              selectedSize === key
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
            }`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded mb-1 flex items-center justify-center text-xs ${
                selectedSize === key 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100'
              }`}>
                {key === '10x10' ? (
                  <div className="w-3 h-3 bg-current rounded-sm"></div>
                ) : key === '10x15' ? (
                  <div className="w-4 h-3 bg-current rounded-sm"></div>
                ) : (
                  <div className="w-4 h-4 bg-current rounded-sm"></div>
                )}
              </div>
              <span className="text-xs font-medium">
                {value.nombre}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}