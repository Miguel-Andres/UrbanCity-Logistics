/**
 * Componente principal para generar una sola etiqueta
 */
'use client'

import { useLabelForm } from '@/app/etiquetas/hooks/useLabelForm'
import { useChatExtraction } from '@/app/etiquetas/hooks/useChatExtraction'
import { usePDFGeneration } from '@/app/etiquetas/hooks/usePDFGeneration'
import ChatInput from '@/app/etiquetas/components/wizard/ChatInput'
import LabelSizeSelector from '@/app/etiquetas/components/wizard/LabelSizeSelector'
import ShippingForm from '@/app/etiquetas/components/wizard/ShippingForm'
import LabelPreview from '@/app/etiquetas/components/wizard/LabelPreview'
import PDFGenerationStatus from '@/app/etiquetas/components/wizard/PDFGenerationStatus'
import { DEFAULT_REMITENTE } from '@/app/etiquetas/constants'

export default function SingleLabelWizard() {
  const { formData, currentStep, updateField, updateMultipleFields, resetForm, nextStep, prevStep } = useLabelForm()
  const { isExtracting, chatText, setChatText, extractDataFromChat } = useChatExtraction()
  const { isGenerating, pdfUrl, error, generatePDF, downloadPDF } = usePDFGeneration()

  const handleExtractData = async () => {
    const extractedData = await extractDataFromChat()
    updateMultipleFields(extractedData)
    nextStep()
  }

  const handleGeneratePDF = async () => {
    nextStep()
    await generatePDF(formData)
  }

  const handleDownload = () => {
    if (pdfUrl) {
      downloadPDF(pdfUrl, `etiqueta_${formData.nroEnvio || 'envio'}.pdf`)
    }
  }

  const handleReset = () => {
    resetForm()
    setChatText('')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Input - Izquierda (2/3) */}
          <div className="lg:col-span-2">
            <ChatInput
              value={chatText}
              onChange={setChatText}
              onExtract={handleExtractData}
              onManual={() => nextStep()}
              isExtracting={isExtracting}
            />
          </div>

          {/* Selector de Tamaño - Derecha (1/3) */}
          <div>
            <LabelSizeSelector
              selectedSize={formData.tipoEtiqueta}
              onSizeChange={(size) => updateField('tipoEtiqueta', size)}
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="space-y-8">
            <ShippingForm
              formData={formData}
              onFieldChange={updateField}
              onMultipleFieldChange={updateMultipleFields}
            />
          </div>

          {/* Vista Previa */}
          <LabelPreview
            formData={formData}
            onPrevStep={prevStep}
            onNextStep={handleGeneratePDF}
            nextStepLabel="Generar PDF"
            nextStepDisabled={!formData.nombreDestinatario || !formData.telefonoDestinatario || !formData.localidadDestinatario || !formData.tipoEntrega}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-3xl mx-auto">
          <PDFGenerationStatus
            state={{
              isGenerating,
              pdfUrl,
              error
            }}
            onDownload={handleDownload}
            onPrint={handlePrint}
            onRetry={prevStep}
            onNewLabel={handleReset}
          />
        </div>
      )}
    </div>
  )
}