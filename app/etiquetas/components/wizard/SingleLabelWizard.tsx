/**
 * Componente principal para generar una sola etiqueta
 */
'use client'

import { useState } from 'react'
import ChatInput from '@/app/etiquetas/components/shared/ChatInput'
import ShippingForm from '@/app/etiquetas/components/wizard/ShippingForm'
import LabelPreview from '@/app/etiquetas/components/wizard/LabelPreview'
import { FormData } from '@/app/etiquetas/types'
import { useLabelStore } from '@/lib/stores/useLabelStore'
import { User } from '@supabase/supabase-js'

interface Profile {
  store_name: string | null
  phone: string | null
}

interface SingleLabelWizardProps {
  user: User
  profile: Profile | null
}

export default function SingleLabelWizard({ user, profile }: SingleLabelWizardProps) {
  const [chatText, setChatText] = useState('')
  const { formData, updateField, updateMultipleFields, resetForm } = useLabelStore()

  const handleExtractData = () => {
    // Función vacía - no funcional
  }

  const handleManual = () => {
    // Función vacía - no funcional
  }

  const handleReset = () => {
    resetForm()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
      {/* Título Sutil */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-light text-gray-800 mb-2">Generador de Etiquetas</h1>
        <p className="text-sm text-gray-500">Convierte mensajes en etiquetas profesionales</p>
      </div>

      {/* Chat Input - Desactivado */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gray-100 bg-opacity-60 rounded-lg z-10 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xs text-gray-500 font-medium">Función desactivada</p>
            </div>
          </div>
          <div className="opacity-30 pointer-events-none">
            <ChatInput
              value={chatText}
              onChange={setChatText}
              onExtract={handleExtractData}
              isExtracting={false}
              height="compact"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario - Izquierda */}
        <div>
          <ShippingForm />
        </div>

        {/* Panel de Acción Rápida - Derecha */}
        <div>
          <LabelPreview user={user} profile={profile} />
        </div>
      </div>
    </div>
  )
}