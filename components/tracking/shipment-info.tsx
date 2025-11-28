/**
 * Componente para mostrar información detallada del envío
 */
import { 
  Package, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar,
  DollarSign 
} from 'lucide-react'

interface Shipment {
  id: string
  tracking_code: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  recipient_city: string
  recipient_reference?: string
  shipment_type: string
  payment_type: string
  amount_to_charge?: number
  status: 'pending' | 'in_transit' | 'delivered' | 'failed'
  created_at: string
  delivered_at?: string
  delivered_by?: string
  received_by?: string
  delivery_notes?: string
}

interface ShipmentInfoProps {
  shipment: Shipment
}

export function ShipmentInfo({ shipment }: ShipmentInfoProps) {
  const statusConfig = {
    pending: {
      icon: '⏳',
      label: 'Pendiente',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    in_transit: {
      icon: '🚚',
      label: 'En Tránsito',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    delivered: {
      icon: '✅',
      label: 'Entregado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    failed: {
      icon: '❌',
      label: 'Fallido',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  }

  const currentStatus = statusConfig[shipment.status]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header con estado */}
      <div className={`px-6 py-4 border-b ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentStatus.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Estado del Envío</h3>
              <p className={`font-medium ${currentStatus.color}`}>{currentStatus.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Código</p>
            <p className="font-mono font-bold text-gray-900">{shipment.tracking_code}</p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6 space-y-6">
        {/* Información del destinatario */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-600" />
            Información del Destinatario
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Nombre completo</p>
                <p className="font-medium text-gray-900">{shipment.recipient_name}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Teléfono de contacto</p>
                <p className="font-medium text-gray-900">{shipment.recipient_phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Dirección de entrega</p>
                <p className="font-medium text-gray-900">{shipment.recipient_address}</p>
                <p className="text-gray-600">{shipment.recipient_city}</p>
                {shipment.recipient_reference && (
                  <p className="text-sm text-gray-500 mt-1">
                    Referencia: {shipment.recipient_reference}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del envío */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-gray-600" />
            Detalles del Envío
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">Tipo de envío</p>
              </div>
              <p className="font-semibold text-gray-900">
                {shipment.shipment_type === 'VENTA' ? 'Venta' : 'Cambio'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">Modalidad de entrega</p>
              </div>
              <p className="font-semibold text-gray-900">
                {shipment.payment_type === 'COBRAR' ? 'Cobrar' : 'Solo Entregar'}
              </p>
              {shipment.payment_type === 'COBRAR' && shipment.amount_to_charge && (
                <div className="flex items-center space-x-1 mt-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-600">
                    ${new Intl.NumberFormat('es-AR').format(shipment.amount_to_charge)}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">Fecha del envío</p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatDate(shipment.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Información de entrega (si está entregado) */}
        {shipment.status === 'delivered' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-green-800 mb-3">
              Información de Entrega
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {shipment.delivered_at && (
                <div>
                  <span className="text-green-600 font-medium">Fecha de entrega:</span>
                  <p className="text-green-800">{formatDate(shipment.delivered_at)}</p>
                </div>
              )}
              {shipment.delivered_by && (
                <div>
                  <span className="text-green-600 font-medium">Entregado por:</span>
                  <p className="text-green-800">{shipment.delivered_by}</p>
                </div>
              )}
              {shipment.received_by && (
                <div>
                  <span className="text-green-600 font-medium">Recibido por:</span>
                  <p className="text-green-800">{shipment.received_by}</p>
                </div>
              )}
              {shipment.delivery_notes && (
                <div className="md:col-span-2">
                  <span className="text-green-600 font-medium">Notas:</span>
                  <p className="text-green-800 mt-1">{shipment.delivery_notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}