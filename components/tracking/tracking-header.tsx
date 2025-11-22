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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 lg:py-6 gap-3">
          {/* Header superior mobile: Logo y volver */}
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm sm:text-base">Volver</span>
            </Link>
            
            {/* Logo - visible en mobile y desktop, oculto en tablet */}
            <h1 className="text-sm font-bold text-gray-900 sm:hidden lg:block lg:text-xl">
              URBAN CITY LOGISTICS
            </h1>
          </div>

          {/* Centro: Código de tracking */}
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 mb-1">Código de Seguimiento</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-mono font-bold text-gray-900">
              {trackingCode.toUpperCase()}
            </p>
          </div>

          {/* Estado - móvil primero */}
          <div className="flex items-center justify-center sm:justify-end">
            {currentStatus && (
              <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentStatus.color}`} />
                  <span className={`font-semibold text-sm sm:text-base ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}