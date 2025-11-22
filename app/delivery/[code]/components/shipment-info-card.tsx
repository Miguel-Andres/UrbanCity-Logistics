import { 
  Package, 
  User,
  MapPin,
  Phone 
} from 'lucide-react'
import type { Shipment } from '../types'

interface ShipmentInfoCardProps {
  shipment: Shipment
}

export function ShipmentInfoCard({ shipment }: ShipmentInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Package className="w-5 h-5 mr-2" />
        Información del Envío
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <User className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Destinatario</p>
            <p className="font-semibold text-gray-900">{shipment.recipient_name}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-semibold text-gray-900">{shipment.recipient_phone}</p>
          </div>
        </div>

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
      </div>
    </div>
  )
}