'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  AlertCircle, 
  Home, 
  ArrowLeft,
  User,
  MapPin,
  Phone
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

export default function DeliveryPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: '',
    delivered_by: '',
    received_by: '',
    delivery_notes: ''
  })

  const code = params?.code as string

  useEffect(() => {
    if (code) {
      fetchShipment()
    }
  }, [code])

  const fetchShipment = async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_code', code.toUpperCase())
        .single()

      if (error) throw error

      if (data) {
        setShipment(data)
        setUpdateForm(prev => ({
          ...prev,
          status: data.status
        }))
      } else {
        setError('Código de seguimiento no encontrado')
      }
    } catch (err) {
      setError('Error al buscar el envío')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shipment) return

    setUpdating(true)
    try {
      // Validar que si se marca como entregado, se tenga quién lo recibió
      if (updateForm.status === 'delivered' && !updateForm.received_by) {
        alert('Por favor, ingresa quién recibió el paquete')
        setUpdating(false)
        return
      }

      const updateData: any = {
        status: updateForm.status,
        updated_at: new Date().toISOString()
      }

      if (updateForm.status === 'delivered') {
        updateData.delivered_at = new Date().toISOString()
        updateData.delivered_by = updateForm.delivered_by || null
        updateData.received_by = updateForm.received_by || null
        updateData.delivery_notes = updateForm.delivery_notes || null
      }

      const { error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', shipment.id)

      if (error) throw error

      // Create tracking event
      const { error: eventError } = await supabase
        .from('tracking_events')
        .insert({
          shipment_id: shipment.id,
          status: updateForm.status as 'pending' | 'in_transit' | 'delivered' | 'failed',
          notes: updateForm.delivery_notes || null,
          delivered_by: updateForm.delivered_by || null,
          received_by: updateForm.received_by || null
        })

      if (eventError) console.error('Error creating tracking event:', eventError)

      // Refetch shipment data
      await fetchShipment()

      // Show success message
      alert('Estado actualizado correctamente')

      // Redirect to tracking page after a short delay
      setTimeout(() => {
        router.push(`/tracking/${code}`)
      }, 2000)
    } catch (err) {
      console.error('Error updating shipment:', err)
      alert('Error al actualizar el estado. Por favor, intenta nuevamente.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Envío No Encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'No se pudo encontrar el envío con este código'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 inline mr-2" />
            Ir al Inicio
          </button>
        </div>
      </div>
    )
  }

  const currentStatus = statusConfig[shipment.status]
  const StatusIcon = currentStatus.icon

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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

        {/* Shipment Info */}
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

        {/* Update Form */}
        {shipment.status !== 'delivered' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actualizar Estado</h2>
            
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Estado
                </label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Seleccionar estado</option>
                  <option value="pending">Pendiente</option>
                  <option value="in_transit">En Tránsito</option>
                  <option value="delivered">Entregado</option>
                  <option value="failed">Fallido</option>
                </select>
              </div>

              {updateForm.status === 'delivered' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entregado por (opcional)
                    </label>
                    <input
                      type="text"
                      value={updateForm.delivered_by}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, delivered_by: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nombre del repartidor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recibido por *
                    </label>
                    <input
                      type="text"
                      value={updateForm.received_by}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, received_by: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nombre de quien recibió el paquete"
                      required={updateForm.status === 'delivered'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas de entrega (opcional)
                    </label>
                    <textarea
                      value={updateForm.delivery_notes}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, delivery_notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows={3}
                      placeholder="Notas adicionales sobre la entrega"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={updating || !updateForm.status}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {updating ? (
                  <LoadingSpinner />
                ) : (
                  'Actualizar Estado'
                )}
              </button>
            </form>
          </div>
        )}

        {shipment.status === 'delivered' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Envío Entregado</h3>
            <p className="text-green-700 mb-4">
              Este envío ya ha sido entregado. No se pueden realizar más actualizaciones.
            </p>
            <button
              onClick={() => router.push(`/tracking/${code}`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Ver Detalles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}