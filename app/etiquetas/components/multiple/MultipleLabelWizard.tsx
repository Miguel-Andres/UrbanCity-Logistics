/**
 * Componente principal para generar múltiples etiquetas
 */
'use client'

import { useState } from 'react'
import ChatInput from '@/app/etiquetas/components/shared/ChatInput'
import { useLabels, useMultipleLabelsStore } from '@/lib/stores/useMultipleLabelsStore'
import MultipleLabelsList from '@/app/etiquetas/components/multiple/MultipleLabelsList'

export default function MultipleLabelWizard() {
  const labels = useLabels()
  const { updateLabel, removeLabel, addLabel } = useMultipleLabelsStore()
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
    tipoEntrega: 'PAGADO',
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
            onUpdate={(id, field, value) => updateLabel(id, { [field]: value })}
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