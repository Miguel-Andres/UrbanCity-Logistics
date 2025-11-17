/**
 * Componente principal para generar una sola etiqueta
 */
'use client'

import { useState } from 'react'
import ChatInput from '@/app/etiquetas/components/shared/ChatInput'
import ShippingForm from '@/app/etiquetas/components/wizard/ShippingForm'
import LabelPreview from '@/app/etiquetas/components/wizard/LabelPreview'
import { FormData } from '@/app/etiquetas/types'

export default function SingleLabelWizard() {
  const [chatText, setChatText] = useState('')
  const [formData, setFormData] = useState<FormData>({
    tipoEtiqueta: '10x15',
    tipoEnvio: 'VENTA',
    nombre: '',
    telefono: '',
    direccion: '',
    localidad: '',
    entreCalles: '',
    observaciones: '',
    tipoEntrega: 'SOLO ENTREGAR',
    montoACobrar: 0,
    fecha: new Date().toISOString().split('T')[0]
  })

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateMultipleFields = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  const handleExtractData = () => {
    // Función vacía - no funcional
  }

  const handleManual = () => {
    // Función vacía - no funcional
  }

  const handleReset = () => {
    setFormData({
      tipoEtiqueta: '10x15',
      tipoEnvio: 'VENTA',
      nombre: '',
      telefono: '',
      direccion: '',
      localidad: '',
      entreCalles: '',
      observaciones: '',
      tipoEntrega: 'SOLO ENTREGAR',
      montoACobrar: 0,
      fecha: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      {/* Título Sutil */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-light text-gray-800 mb-2">Generador de Etiquetas</h1>
        <p className="text-sm text-gray-500">Convierte mensajes en etiquetas profesionales</p>
      </div>

      {/* Chat Input - Arriba (solo visual) */}
      <div className="mb-8">
        <ChatInput
          value={chatText}
          onChange={setChatText}
          onExtract={handleExtractData}
          isExtracting={false}
          height="compact"
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