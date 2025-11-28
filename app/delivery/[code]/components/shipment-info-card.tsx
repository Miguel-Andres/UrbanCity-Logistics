import { 
  Package, 
  User,
  MapPin,
  Phone,
  DollarSign,
  Tag,
  Calendar
} from 'lucide-react'
import type { Shipment } from '../types'

interface ShipmentInfoCardProps {
  shipment: Shipment
}

export function ShipmentInfoCard({ shipment }: ShipmentInfoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const isPaymentRequired = shipment.payment_type === 'COBRAR'
  const isSale = shipment.shipment_type === 'VENTA'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Package className="w-5 h-5 mr-2" />
        Información del Envío
      </h2>
      
      <div className="space-y-4">
        {/* Destinatario */}
        <div className="flex items-start space-x-3">
          <User className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Destinatario</p>
            <p className="font-semibold text-gray-900">{shipment.recipient_name}</p>
          </div>
        </div>
        
        {/* Teléfono */}
        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-semibold text-gray-900">{shipment.recipient_phone}</p>
          </div>
        </div>

        {/* Dirección */}
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Dirección</p>
            <p className="font-semibold text-gray-900">{shipment.recipient_address}</p>
            <p className="text-gray-600">{shipment.recipient_city}</p>
            {shipment.recipient_reference && (
              <p className="text-sm text-gray-500 mt-1">
                Referencia: {shipment.recipient_reference}
              </p>
            )}
          </div>
        </div>

        {/* Tipo de envío */}
        <div className="flex items-start space-x-3">
          <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Tipo de envío</p>
            <div className="flex items-center gap-2">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${isSale 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
                }
              `}>
                {shipment.shipment_type}
              </span>
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${isPaymentRequired 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
                }
              `}>
                {isPaymentRequired ? 'COBRAR' : 'SOLO ENTREGAR'}
              </span>
            </div>
          </div>
        </div>

        {/* Monto a cobrar */}
        {isPaymentRequired && shipment.amount_to_charge && (
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Monto a cobrar</p>
              <p className="text-2xl font-bold text-orange-600">
                ${shipment.amount_to_charge.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
        )}

        {/* Fecha del envío */}
        {shipment.ship_date && (
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Fecha del envío</p>
              <p className="font-semibold text-gray-900">
                {formatDate(shipment.ship_date)}
              </p>
            </div>
          </div>
        )}

        {/* Notas del envío */}
        {shipment.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Notas del envío:</p>
            <p className="text-sm text-gray-700">{shipment.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}