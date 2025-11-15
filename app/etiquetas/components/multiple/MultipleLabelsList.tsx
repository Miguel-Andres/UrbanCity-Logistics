/**
 * Lista de etiquetas múltiples
 */
'use client'

import { Package, Download } from 'lucide-react'
import { LabelData } from '@/app/etiquetas/types'
import LabelItem from './LabelItem'

interface MultipleLabelsListProps {
  labels: LabelData[]
  onUpdate: (id: string, field: keyof LabelData, value: string) => void
  onRemove: (id: string) => void
  onGenerateAll: () => void
  isGenerating: boolean
  hasGeneratedPDFs: boolean
  pdfCount: number
  onDownloadAll?: () => void
}

export default function MultipleLabelsList({
  labels,
  onUpdate,
  onRemove,
  onGenerateAll,
  isGenerating,
  hasGeneratedPDFs,
  pdfCount,
  onDownloadAll
}: MultipleLabelsListProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Lista de Etiquetas
          </h3>
          <p className="text-gray-600 mt-1">
            {labels.length} etiqueta{labels.length !== 1 ? 's' : ''} preparada{labels.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {labels.length > 0 && (
          <button
            onClick={onGenerateAll}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Generar Todas</span>
              </>
            )}
          </button>
        )}
      </div>

      {labels.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-lg">
            No hay etiquetas agregadas aún
          </p>
          <p className="text-gray-400 mt-2">
            Extrae datos desde chats o agrégalas manualmente
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {labels.map((label, index) => (
              <LabelItem
                key={label.id}
                label={label}
                index={index}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))}
          </div>
          
          {hasGeneratedPDFs && onDownloadAll && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={onDownloadAll}
                className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Download className="w-5 h-5" />
                <span>Descargar Todas ({pdfCount})</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}