/**
 * Componente principal para generar múltiples etiquetas
 */
'use client'

import { useState } from 'react'
import { useLabelForm } from '@/app/etiquetas/hooks/useLabelForm'
import { useChatExtraction } from '@/app/etiquetas/hooks/useChatExtraction'
import { usePDFGeneration } from '@/app/etiquetas/hooks/usePDFGeneration'
import { useMultipleLabels } from '@/app/etiquetas/hooks/useMultipleLabels'
import MultipleChatInput from '@/app/etiquetas/components/multiple/MultipleChatInput'
import MultipleLabelsList from '@/app/etiquetas/components/multiple/MultipleLabelsList'
import MultiplePreview from '@/app/etiquetas/components/multiple/MultiplePreview'
import { LabelData } from '@/app/etiquetas/types'

export default function MultipleLabelWizard() {
  const { formData } = useLabelForm()
  const { chatText, setChatText, extractMultipleDataFromChat } = useChatExtraction()
  const { isGenerating, multiplePdfUrls, generateMultiplePDFs, downloadAllPDFs } = usePDFGeneration()
  const { labels, updateLabel, removeLabel, addNewLabel, setLabelsFromExtraction } = useMultipleLabels()

  const handleExtractMultiple = async () => {
    const extractedData = await extractMultipleDataFromChat(chatText)
    const labelsData = extractedData.map(data => ({
      ...data,
      id: Date.now().toString() + Math.random(),
      variante: '',
      observaciones: ''
    }))
    setLabelsFromExtraction(labelsData)
  }

  const handleGenerateAll = async () => {
    // Convert LabelData[] to FormData[] by merging with base formData
    const formDataList = labels.map(label => ({
      ...formData,
      nombreDestinatario: label.nombreDestinatario,
      telefonoDestinatario: label.telefonoDestinatario,
      direccionDestinatario: label.direccionDestinatario,
      cpDestinatario: label.cpDestinatario,
      localidad: label.localidad,
      observaciones: label.observaciones,
      totalACobrar: label.totalACobrar,
      montoCobrar: label.montoCobrar,
      variante: label.variante,
      chat: label.chat
    }))
    await generateMultiplePDFs(formDataList, formData)
  }

  const handleDownloadAll = () => {
    downloadAllPDFs(multiplePdfUrls)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Chat Input and Labels List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chat Input */}
          <MultipleChatInput
            value={chatText}
            onChange={setChatText}
            onExtract={handleExtractMultiple}
            onAddManual={addNewLabel}
            isExtracting={false}
          />

          {/* Labels List */}
          <MultipleLabelsList
            labels={labels}
            onUpdate={updateLabel}
            onRemove={removeLabel}
            onGenerateAll={handleGenerateAll}
            isGenerating={isGenerating}
            hasGeneratedPDFs={multiplePdfUrls.length > 0}
            pdfCount={multiplePdfUrls.length}
            onDownloadAll={handleDownloadAll}
          />
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <MultiplePreview
            labels={labels}
            hasGeneratedPDFs={multiplePdfUrls.length > 0}
            pdfCount={multiplePdfUrls.length}
          />
        </div>
      </div>
    </div>
  )
}