/**
 * Formulario de envío con campos específicos
 */
'use client'

import { useState, useEffect } from 'react'
import { User, Phone, Calendar, MapPin, MessageSquare, DollarSign } from 'lucide-react'
import { FormData } from '@/app/etiquetas/types'

interface ShippingFormProps {
  formData: FormData
  onFieldChange: (field: keyof FormData, value: any) => void
  onMultipleFieldChange: (fields: Partial<FormData>) => void
}

export default function ShippingForm({
  formData,
  onFieldChange,
  onMultipleFieldChange
}: ShippingFormProps) {
  const [showMonto, setShowMonto] = useState(formData.tipoEntrega === 'COBRAR')

  useEffect(() => {
    setShowMonto(formData.tipoEntrega === 'COBRAR')
    
    // Establecer fecha actual por defecto si no hay fecha
    if (!formData.fecha) {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      const fechaFormato = `${yyyy}-${mm}-${dd}` // Formato para input date
      onFieldChange('fecha', fechaFormato)
    }
  }, [formData.tipoEntrega, formData.fecha, onFieldChange])

  const handleTipoEntregaChange = (value: string) => {
    onFieldChange('tipoEntrega', value)
    if (value === 'SOLO ENTREGAR') {
      onFieldChange('montoACobrar', '')
    }
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
          Información del Destinatario
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre y Apellido - Ancho completo en mobile, media en desktop */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-orange-500" />
              Nombre y Apellido
            </label>
            <input
              type="text"
              value={formData.nombreDestinatario ?? ''}
              onChange={(e) => onFieldChange('nombreDestinatario', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-gray-50 hover:bg-white transition-colors text-sm"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Teléfono - Ancho completo en mobile, media en desktop */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-orange-500" />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefonoDestinatario ?? ''}
              onChange={(e) => onFieldChange('telefonoDestinatario', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-gray-50 hover:bg-white transition-colors text-sm"
              placeholder="+56 9 1234 5678"
            />
          </div>

          {/* Fecha - Input más corto */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-500" />
              Fecha
            </label>
            <input
              type="date"
              value={formData.fecha ?? ''}
              onChange={(e) => onFieldChange('fecha', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-gray-50 hover:bg-white transition-colors text-sm"
            />
          </div>

          {/* Localidad - Input más corto */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              Localidad
            </label>
            <input
              type="text"
              value={formData.localidadDestinatario ?? ''}
              onChange={(e) => onFieldChange('localidadDestinatario', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-gray-50 hover:bg-white transition-colors text-sm"
              placeholder="Santiago Centro"
            />
          </div>
        </div>

        {/* Dirección - Ancho completo */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            Dirección (calle, altura, piso, depto)
          </label>
          <input
            type="text"
            value={formData.direccion ?? ''}
            onChange={(e) => onFieldChange('direccion', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-gray-50 hover:bg-white transition-colors text-sm"
            placeholder="Calle, altura, piso, departamento"
          />
        </div>

        {/* Entre Calles - Ancho completo */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Entre Calles
          </label>
          <input
            type="text"
            value={formData.entreCalles ?? ''}
            onChange={(e) => onFieldChange('entreCalles', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-gray-50 hover:bg-white transition-colors text-sm"
            placeholder="Entre Ahumada y Estado"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
          Detalles del Envío
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Envío */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tipo de Envío
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onFieldChange('tipoEnvio', 'VENTA')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                  formData.tipoEnvio === 'VENTA'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                VENTA
              </button>
              <button
                type="button"
                onClick={() => onFieldChange('tipoEnvio', 'CAMBIO')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                  formData.tipoEnvio === 'CAMBIO'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                CAMBIO
              </button>
            </div>
          </div>

          {/* Pago - Campo Obligatorio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Pago <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTipoEntregaChange('COBRAR')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                  formData.tipoEntrega === 'COBRAR'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                COBRAR
              </button>
              <button
                type="button"
                onClick={() => handleTipoEntregaChange('SOLO ENTREGAR')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                  formData.tipoEntrega === 'SOLO ENTREGAR'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                SOLO ENTREGAR
              </button>
            </div>
            {!formData.tipoEntrega && (
              <p className="text-xs text-red-500 mt-2 font-medium flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                Debe seleccionar una opción
              </p>
            )}
          </div>
        </div>

        {/* Monto a Cobrar - Solo si selecciona COBRAR */}
        {showMonto && (
          <div className="mt-6 animate-in slide-in-from-top-2 duration-200">
            <div className="mb-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
              Monto a Cobrar <span className="text-red-500 ml-1">*</span>
              {formData.tipoEntrega === 'COBRAR' && !formData.montoACobrar && (
                <span className="text-xs text-red-500 font-medium ml-2">
                  - El monto es obligatorio cuando selecciona COBRAR
                </span>
              )}
            </label>
          </div>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-sm">$</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.montoACobrar ?? ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  onFieldChange('montoACobrar', value)
                }}
                className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 transition-colors text-sm font-mono ${
                  formData.tipoEntrega === 'COBRAR' && !formData.montoACobrar
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 bg-gray-50 hover:bg-white focus:ring-green-500 focus:border-green-500 text-gray-900'
                }`}
                placeholder="15000"
              />
              </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
          Información Adicional
        </h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
            Observaciones
          </label>
          <textarea
            value={formData.observaciones ?? ''}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                onFieldChange('observaciones', e.target.value)
              }
            }}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-gray-50 hover:bg-white transition-colors text-sm resize-none"
            placeholder="Notas adicionales del envío..."
            rows={3}
            maxLength={150}
          />
          <p className="text-xs text-gray-500 mt-2">
            {formData.observaciones?.length || 0} / 150 caracteres
          </p>
        </div>
      </div>
    </div>
  )
}