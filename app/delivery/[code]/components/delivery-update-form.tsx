'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import type { Shipment } from '../types'

interface DeliveryUpdateFormProps {
  shipment: Shipment
}

export function DeliveryUpdateForm({ shipment }: DeliveryUpdateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliveredBy, setDeliveredBy] = useState('')
  const [receivedBy, setReceivedBy] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [failureReason, setFailureReason] = useState('')
  const [failureNotes, setFailureNotes] = useState('')
  
  // Si ya está entregado, mostrar mensaje
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

  // Solo mostrar formulario si está en tránsito para completar entrega
  if (shipment.status !== 'in_transit') {
    return null
  }
  
  const handleDelivered = async () => {
    if (!deliveredBy.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor, ingresa tu nombre como repartidor',
        confirmButtonColor: '#f97316'
      })
      return
    }

    if (!receivedBy.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor, ingresa quién recibió el paquete',
        confirmButtonColor: '#f97316'
      })
      return
    }

    // Confirmación de entrega
    const confirmResult = await Swal.fire({
      title: '¿Confirmar entrega?',
      html: `
        <div style="text-align: left;">
          <p><strong>Entregado por:</strong> ${deliveredBy}</p>
          <p><strong>Entregado a:</strong> ${receivedBy}</p>
          ${deliveryNotes ? `<p><strong>Notas:</strong> ${deliveryNotes}</p>` : ''}
          ${shipment.payment_type === 'COBRAR' && shipment.amount_to_charge ? 
            `<p><strong>Monto a cobrar:</strong> $${shipment.amount_to_charge.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>` 
            : ''}
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, confirmar entrega',
      cancelButtonText: 'Cancelar'
    })

    if (!confirmResult.isConfirmed) {
      return
    }

    await updateStatus('delivered', receivedBy, deliveryNotes, '', '')
  }

  const handleFailed = async () => {
    if (!failureReason) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor, selecciona el motivo del fallo',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    // Confirmación de fallo
    const reasonText = {
      'no_one_home': 'No hay nadie en el domicilio',
      'wrong_address': 'Dirección incorrecta',
      'recipient_refused': 'El destinatario se negó a recibir',
      'damaged_package': 'Paquete dañado',
      'other': 'Otro motivo'
    }

    const confirmResult = await Swal.fire({
      title: '¿Marcar como no entregado?',
      html: `
        <div style="text-align: left;">
          <p><strong>Motivo:</strong> ${reasonText[failureReason as keyof typeof reasonText]}</p>
          ${failureNotes ? `<p><strong>Notas:</strong> ${failureNotes}</p>` : ''}
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, registrar fallo',
      cancelButtonText: 'Cancelar'
    })

    if (!confirmResult.isConfirmed) {
      return
    }

    await updateStatus('failed', '', '', failureReason, failureNotes)
  }

  const updateStatus = async (
    status: string, 
    receivedBy: string, 
    deliveryNotes: string, 
    failureReason: string, 
    failureNotes: string
  ) => {
    if (isSubmitting) return

    setIsSubmitting(true)

    // Mostrar loading
    Swal.fire({
      title: 'Actualizando estado...',
      html: 'Por favor, espera un momento',
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false
    })

    try {
      const response = await fetch(`/api/delivery/${shipment.tracking_code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          delivered_by: status === 'delivered' ? deliveredBy : 'Repartidor',
          received_by: status === 'delivered' ? receivedBy : '',
          delivery_notes: deliveryNotes,
          failure_reason: failureReason,
          failure_notes: failureNotes
        }),
      })

      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al actualizar el estado')
      }

      // Cerrar loading y mostrar éxito
      Swal.close()
      
      await Swal.fire({
        icon: 'success',
        title: status === 'delivered' ? '¡Entrega confirmada!' : 'Estado actualizado',
        text: status === 'delivered' 
          ? 'El envío ha sido entregado exitosamente' 
          : 'Se ha registrado que no se pudo entregar',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      })

      // Redirección inmediata
      router.push(`/tracking/${shipment.tracking_code}`)
      
    } catch (error) {
      Swal.close()
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al actualizar el estado',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Completar Entrega</h2>
      
      <div className="space-y-6">
        {/* TARJETA ENTREGADO */}
        <div className="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-800">ENTREGADO ✅</h3>
          </div>

          {/* Mostrar monto a cobrar si aplica */}
          {shipment.payment_type === 'COBRAR' && shipment.amount_to_charge && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-orange-800">💰 Monto a cobrar:</span>
                <span className="text-xl font-bold text-orange-600">
                  ${shipment.amount_to_charge.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu nombre como repartidor *
              </label>
              <input
                type="text"
                value={deliveredBy}
                onChange={(e) => setDeliveredBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ingresa tu nombre completo"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ¿Quién recibió el paquete? *
              </label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nombre de la persona que recibió"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
                placeholder="Notas adicionales de la entrega"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            onClick={handleDelivered}
            disabled={isSubmitting || !deliveredBy.trim() || !receivedBy.trim()}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Confirmando entrega...
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                CONFIRMAR ENTREGA
              </>
            )}
          </button>
        </div>

        {/* DIVISOR */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">O</span>
          </div>
        </div>

        {/* TARJETA NO SE PUDO ENTREGAR */}
        <div className="border-2 border-red-200 rounded-xl p-6 bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-red-800">NO SE PUDO ENTREGAR ❌</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo del fallo *
              </label>
              <select
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Seleccionar motivo</option>
                <option value="no_one_home">🏠 No hay nadie en el domicilio</option>
                <option value="wrong_address">📍 Dirección incorrecta</option>
                <option value="recipient_refused">🙅 El destinatario se negó a recibir</option>
                <option value="damaged_package">📦 Paquete dañado</option>
                <option value="other">📝 Otro motivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ¿Qué sucedió? (opcional)
              </label>
              <textarea
                value={failureNotes}
                onChange={(e) => setFailureNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={2}
                placeholder="Describe qué sucedió al intentar la entrega"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            onClick={handleFailed}
            disabled={isSubmitting || !failureReason}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registrando fallo...
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                REGISTRAR FALLO
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}