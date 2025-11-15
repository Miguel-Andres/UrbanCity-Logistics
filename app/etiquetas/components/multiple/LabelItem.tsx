/**
 * Item de etiqueta para la vista múltiple
 */
'use client'

import { Phone, MapPin, X } from 'lucide-react'
import { LabelData } from '@/app/etiquetas/types'

interface LabelItemProps {
  label: LabelData
  index: number
  onUpdate: (id: string, field: keyof LabelData, value: string) => void
  onRemove: (id: string) => void
}

export default function LabelItem({ label, index, onUpdate, onRemove }: LabelItemProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
            {index + 1}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={label.nombreDestinatario}
              onChange={(e) => onUpdate(label.id || `label-${index}`, 'nombreDestinatario', e.target.value)}
              className="font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none px-2 py-1 text-lg transition-all duration-200"
              placeholder="Nombre del destinatario"
            />
          </div>
        </div>
        <button
          onClick={() => onRemove(label.id || `label-${index}`)}
          className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
        >
          <span className="sr-only">Eliminar</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={label.telefonoDestinatario}
              onChange={(e) => onUpdate(label.id || `label-${index}`, 'telefonoDestinatario', e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
              placeholder="+56 9 1234 5678"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2">Localidad</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={label.localidad}
              onChange={(e) => onUpdate(label.id || `label-${index}`, 'localidad', e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
              placeholder="La Plata"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-500 mb-2">Dirección</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={label.direccionDestinatario}
              onChange={(e) => onUpdate(label.id || `label-${index}`, 'direccionDestinatario', e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
              placeholder="Calle 123, entre esquinas"
            />
          </div>
        </div>
      </div>
    </div>
  )
}