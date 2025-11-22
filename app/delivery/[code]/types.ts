export interface Shipment {
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
  updated_at?: string
}

export interface UpdateForm {
  status: string
  delivered_by: string
  received_by: string
  delivery_notes: string
}

export const statusConfig = {
  pending: {
    icon: 'Clock',
    label: 'Pendiente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  in_transit: {
    icon: 'Truck',
    label: 'En Tránsito',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  delivered: {
    icon: 'CheckCircle',
    label: 'Entregado',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  failed: {
    icon: 'AlertCircle',
    label: 'Fallido',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
} as const