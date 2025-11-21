/**
 * Componente para el header de la página de tracking
 * Muestra el código de seguimiento y el estado actual
 */
import { Clock, Truck, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pendiente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  in_transit: {
    icon: Truck,
    label: 'En Tránsito',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  delivered: {
    icon: CheckCircle,
    label: 'Entregado',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  failed: {
    icon: AlertCircle,
    label: 'Fallido',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
}

interface TrackingHeaderProps {
  trackingCode: string
  status?: 'pending' | 'in_transit' | 'delivered' | 'failed'
}

export function TrackingHeader({ trackingCode, status }: TrackingHeaderProps) {
  const currentStatus = status ? statusConfig[status] : null
  const StatusIcon = currentStatus?.icon || Clock

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo y volver */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver</span>
            </Link>
          </div>

          {/* Código de tracking y estado */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Código de Seguimiento</p>
              <p className="text-2xl font-mono font-bold text-gray-900">
                {trackingCode.toUpperCase()}
              </p>
            </div>
            
            {currentStatus && (
              <div className={`px-4 py-2 rounded-lg border ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-5 h-5 ${currentStatus.color}`} />
                  <span className={`font-semibold ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              URBAN CITY LOGISTICS
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}