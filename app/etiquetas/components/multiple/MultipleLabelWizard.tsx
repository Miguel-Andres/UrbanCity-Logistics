/**
 * Componente principal para generar múltiples etiquetas
 */
'use client'

import { useState } from 'react'
import ChatInput from '@/app/etiquetas/components/shared/ChatInput'
import { useMultipleLabels } from '@/app/etiquetas/hooks/useMultipleLabels'
import MultipleLabelsList from '@/app/etiquetas/components/multiple/MultipleLabelsList'
import { LabelData } from '@/app/etiquetas/types'

export default function MultipleLabelWizard() {
  const { labels, updateLabel, removeLabel, addNewLabel } = useMultipleLabels()
  const [chatText, setChatText] = useState('')
  const [formData, setFormData] = useState({
    chat: '',
    nroEnvio: '',
    nombreVendedor: '',
    tipoEtiqueta: '10x15',
    variante: '',
    localidad: '',
    tipoEnvio: 'VENTA',
    nombreDestinatario: '',
    telefonoDestinatario: '',
    direccionDestinatario: '',
    localidadDestinatario: '',
    entreCalles: '',
    observaciones: '',
    cpDestinatario: '',
    tipoEntrega: 'SOLO ENTREGAR',
    totalACobrar: 0,
    montoCobrar: 0
  })

  const handleExtractMultiple = () => {
    // Función vacía - no funcional
  }

  const handleGenerateAll = () => {
    // Función vacía - no funcional
  }

  const handleDownloadAll = () => {
    // Función vacía - no funcional
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Chat Input and Labels List */}
        <div className="space-y-8">
          {/* Chat Input */}
          <ChatInput
            value={chatText}
            onChange={setChatText}
            onExtract={handleExtractMultiple}
            height="compact"
            isExtracting={false}
            width="full"
          />

          {/* Labels List */}
          <MultipleLabelsList
            labels={labels}
            onUpdate={updateLabel}
            onRemove={removeLabel}
            onGenerateAll={handleGenerateAll}
            isGenerating={false}
            hasGeneratedPDFs={false}
            pdfCount={0}
            onDownloadAll={handleDownloadAll}
          />
        </div>

        </div>
    </div>
  )
}