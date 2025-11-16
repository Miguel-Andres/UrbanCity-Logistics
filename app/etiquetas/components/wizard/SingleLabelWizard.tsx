/**
 * Componente principal para generar una sola etiqueta
 */
'use client'

import { useState } from 'react'
import { useChatExtraction } from '@/app/etiquetas/hooks/useChatExtraction'
import ChatInput from '@/app/etiquetas/components/wizard/ChatInput'
import LabelSizeSelector from '@/app/etiquetas/components/wizard/LabelSizeSelector'
import ShippingForm from '@/app/etiquetas/components/wizard/ShippingForm'
import LabelPreview from '@/app/etiquetas/components/wizard/LabelPreview'
import { DEFAULT_REMITENTE } from '@/app/etiquetas/constants'
import { FormData } from '@/app/etiquetas/types'

export default function SingleLabelWizard() {
  const [formData, setFormData] = useState<FormData>({
    chat: '',
    nroEnvio: '',
    nombreVendedor: DEFAULT_REMITENTE.nombre,
    tipoEtiqueta: '10x15',
    variante: 'paq',
    localidad: '',
    tipoEnvio: 'NORMAL',
    nombreDestinatario: '',
    telefonoDestinatario: '',
    direccion: '',
    localidadDestinatario: '',
    entreCalles: '',
    observaciones: '',
    cpDestinatario: '',
    tipoEntrega: 'PAGAR',
    montoACobrar: '',
    fecha: new Date().toISOString().split('T')[0],
    direccionDestinatario: ''
  })

  const { isExtracting, chatText, setChatText, extractDataFromChat } = useChatExtraction()

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateMultipleFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  const handleExtractData = async () => {
    const extractedData = await extractDataFromChat()
    updateMultipleFields(extractedData)
  }

  const handleReset = () => {
    setFormData({
      chat: '',
      nroEnvio: '',
      nombreVendedor: DEFAULT_REMITENTE.nombre,
      tipoEtiqueta: '10x15',
      variante: 'paq',
      localidad: '',
      tipoEnvio: 'NORMAL',
      nombreDestinatario: '',
      telefonoDestinatario: '',
      direccion: '',
      localidadDestinatario: '',
      entreCalles: '',
      observaciones: '',
      cpDestinatario: '',
      tipoEntrega: 'PAGAR',
      montoACobrar: '',
      fecha: new Date().toISOString().split('T')[0],
      direccionDestinatario: ''
    })
    setChatText('')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      {/* Título Sutil */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-light text-gray-800 mb-2">Generador de Etiquetas</h1>
        <p className="text-sm text-gray-500">Convierte mensajes en etiquetas profesionales</p>
      </div>

      {/* Chat Input - Arriba */}
      <div className="mb-8">
        <ChatInput
          value={chatText}
          onChange={setChatText}
          onExtract={handleExtractData}
          isExtracting={isExtracting}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario - Izquierda */}
        <div>
          <ShippingForm
            formData={formData}
            onFieldChange={updateField}
            onMultipleFieldChange={updateMultipleFields}
          />
        </div>

        {/* Panel de Acción Rápida - Derecha */}
        <div>
          <LabelPreview
            formData={formData}
          />
        </div>
      </div>
    </div>
  )
}