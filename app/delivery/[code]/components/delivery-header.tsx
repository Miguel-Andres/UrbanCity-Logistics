'use client'

import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  CheckCircle, 
  Clock, 
  Truck, 
  AlertCircle 
} from 'lucide-react'
import type { Shipment } from '../types'

interface DeliveryHeaderProps {
  shipment: Shipment
}

const statusIcons = {
  pending: Clock,
  in_transit: Truck,
  delivered: CheckCircle,
  failed: AlertCircle
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  in_transit: {
    label: 'En Tránsito',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  failed: {
    label: 'Fallido',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
}

export function DeliveryHeader({ shipment }: DeliveryHeaderProps) {
  const router = useRouter()
  const currentStatus = statusConfig[shipment.status]
  const StatusIcon = statusIcons[shipment.status]

  return (
    <div className="bg-white shadow-sm">
      <div className="px-4 py-3">
        {/* Botón de volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">Volver</span>
        </button>
        
        {/* Contenido centrado */}
        <div className="flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentStatus.bgColor} ${currentStatus.borderColor} border`}>
            <StatusIcon className={`w-4 h-4 ${currentStatus.color}`} />
            <span className={`text-xs font-medium ${currentStatus.color}`}>{currentStatus.label}</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Tracking</p>
            <p className="text-sm font-mono font-bold text-gray-900">{shipment.tracking_code}</p>
          </div>
        </div>
      </div>
    </div>
  )
}