'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import type { Shipment } from '../types'

interface DeliveryUpdateFormProps {
  shipment: Shipment
}

export function DeliveryUpdateForm({ shipment }: DeliveryUpdateFormProps) {
  const router = useRouter()
  
  // Solo mostrar formulario si está en tránsito para completar entrega
  if (shipment.status !== 'in_transit') {
    return null
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const status = formData.get('status') as string
    const delivered_by = formData.get('delivered_by') as string
    const received_by = formData.get('received_by') as string
    const delivery_notes = formData.get('delivery_notes') as string

    // Validar que si se marca como entregado, se tenga quién lo recibió
    if (status === 'delivered' && !received_by) {
      alert('Por favor, ingresa quién recibió el paquete')
      return
    }

    try {
      const response = await fetch(`/api/delivery/${shipment.tracking_code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          delivered_by,
          received_by,
          delivery_notes
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar')
      }

      const result = await response.json()
      
      if (result.success) {
        alert('Estado actualizado correctamente')
        setTimeout(() => {
          router.push(`/tracking/${shipment.tracking_code}`)
        }, 2000)
      }
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar el estado')
    }
  }

  if (shipment.status === 'delivered') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg
          className="w-16 h-16 text-green-600 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Envío Entregado</h3>
        <p className="text-green-700 mb-4">
          Este envío ya ha sido entregado. No se pueden realizar más actualizaciones.
        </p>
        <button
          onClick={() => router.push(`/tracking/${shipment.tracking_code}`)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Ver Detalles
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Completar Entrega</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado de Entrega
          </label>
          <select
            name="status"
            defaultValue="delivered"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="delivered">Entregado</option>
            <option value="failed">No se pudo entregar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entregado por (opcional)
          </label>
          <input
            type="text"
            name="delivered_by"
            defaultValue={shipment.delivered_by || ''}
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
            name="received_by"
            defaultValue={shipment.received_by || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nombre de quien recibió el paquete"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas de entrega (opcional)
          </label>
          <textarea
            name="delivery_notes"
            defaultValue={shipment.delivery_notes || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
            placeholder="Notas adicionales sobre la entrega"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Confirmar Entrega
        </button>
      </form>
    </div>
  )
}