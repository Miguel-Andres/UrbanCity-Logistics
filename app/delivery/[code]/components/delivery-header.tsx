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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>
        <h1 className="text-xl font-bold text-gray-900">Actualizar Estado de Envío</h1>
        <div></div>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className={`p-4 rounded-lg ${currentStatus.bgColor} ${currentStatus.borderColor} border`}>
          <StatusIcon className={`w-8 h-8 ${currentStatus.color} mx-auto mb-2`} />
          <span className={`font-semibold ${currentStatus.color}`}>{currentStatus.label}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Código de Seguimiento</p>
        <p className="text-xl font-mono font-bold text-gray-900">{shipment.tracking_code}</p>
      </div>
    </div>
  )
}