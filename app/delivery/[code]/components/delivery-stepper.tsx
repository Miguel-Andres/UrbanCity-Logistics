'use client'

import { useState } from 'react'
import { CheckCircle, Clock, Truck, AlertCircle, RotateCcw } from 'lucide-react'
import Swal from 'sweetalert2'
import type { Shipment } from '../types'

interface DeliveryStepperProps {
  shipment: Shipment
  disabled?: boolean
}

const normalSteps = [
  {
    key: 'pending',
    label: 'Pendiente',
    icon: Clock,
    description: 'Envío pendiente de retiro'
  },
  {
    key: 'in_transit',
    label: 'En Tránsito',
    icon: Truck,
    description: 'Envío en camino'
  },
  {
    key: 'delivered',
    label: 'Entregado',
    icon: CheckCircle,
    description: 'Envío entregado exitosamente'
  }
]

const failedSteps = [
  {
    key: 'pending',
    label: 'Pendiente',
    icon: Clock,
    description: 'Envío pendiente de retiro'
  },
  {
    key: 'in_transit',
    label: 'En Tránsito',
    icon: Truck,
    description: 'Envío en camino'
  },
  {
    key: 'failed',
    label: 'Fallido',
    icon: AlertCircle,
    description: 'No se pudo entregar'
  }
]

export function DeliveryStepper({ shipment, disabled = false }: DeliveryStepperProps) {
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'in_transit' | 'delivered' | 'failed'>(shipment.status)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Elegir los steps según el estado actual
  const steps = currentStatus === 'failed' ? failedSteps : normalSteps
  
  const getCurrentStepIndex = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStatus)
    return stepIndex >= 0 ? stepIndex : 0
  }

  const currentStepIndex = getCurrentStepIndex()
  // Solo puede avanzar de "pending" a "in_transit"
  const canAdvance = currentStatus === 'pending' && !disabled

  const handleNextStep = async () => {
    if (canAdvance && !isSubmitting) {
      // Confirmación antes de iniciar tránsito
      const confirmResult = await Swal.fire({
        title: '¿Iniciar Tránsito?',
        text: 'El envío pasará a estado "En Tránsito" y podrás completar la entrega',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, iniciar tránsito',
        cancelButtonText: 'Cancelar'
      })

      if (!confirmResult.isConfirmed) {
        return
      }

      setIsSubmitting(true)

      // Mostrar loading
      Swal.fire({
        title: 'Iniciando tránsito...',
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
            status: 'in_transit',
            notes: 'Su paquete está en camino. En las próximas horas estará siendo entregado en la dirección de destino.',
            delivered_by: null,
            received_by: null
          }),
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Error al actualizar estado')
        }

        // Cerrar loading
        Swal.close()

        // Mostrar éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Tránsito iniciado!',
          text: 'El envío ahora está en camino',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        })

        // Actualizar estado local
        setCurrentStatus('in_transit')
        
        // Recargar para mostrar formulario de entrega sin timeout artificial
        window.location.reload()
        
      } catch (error) {
        Swal.close()
        
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error instanceof Error ? error.message : 'No se pudo actualizar el estado',
          confirmButtonColor: '#ef4444'
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleRetry = async () => {
    if (isSubmitting) return

    // Confirmación para reintentar
    const confirmResult = await Swal.fire({
      title: '¿Reintentar Entrega?',
      text: 'El paquete pasará a estado "En Tránsito" para intentar la entrega nuevamente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reintentar',
      cancelButtonText: 'Cancelar'
    })

    if (!confirmResult.isConfirmed) {
      return
    }

    setIsSubmitting(true)

    // Mostrar loading
    Swal.fire({
      title: 'Reintentando entrega...',
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
          status: 'in_transit',
          notes: 'Reintento de entrega',
          delivered_by: null,
          received_by: null
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al reintentar entrega')
      }

      // Cerrar loading
      Swal.close()

      // Mostrar éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Entrega reiniciada!',
        text: 'El paquete está en camino para ser entregado nuevamente',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      })

      // Recargar para mostrar formulario de entrega
      window.location.reload()
      
    } catch (error) {
      Swal.close()
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'No se pudo reintentar la entrega',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Estado del Envío</h2>
      
      {/* Stepper Visual - Balanceado para Mobile */}
      <div className="relative">
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index <= currentStepIndex
            const isCurrent = index === currentStepIndex
            
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                  ${isActive 
                    ? index === currentStepIndex 
                      ? 'bg-orange-500 text-white scale-105 shadow-lg' 
                      : 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`
                  text-xs font-medium text-center
                  ${isActive ? 'text-gray-900' : 'text-gray-400'}
                `}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
        
        {/* Línea de progreso */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Botón para avanzar */}
      {canAdvance && (
        <button
          onClick={handleNextStep}
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Iniciando...
            </>
          ) : (
            <>
              <Truck className="w-5 h-5" />
              Iniciar Tránsito
            </>
          )}
        </button>
      )}

      {/* Botón para reintentar entrega fallida */}
      {currentStatus === 'failed' && !disabled && (
        <button
          onClick={handleRetry}
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Reintentando...
            </>
          ) : (
            <>
              <RotateCcw className="w-5 h-5" />
              REINTENTAR ENTREGA
            </>
          )}
        </button>
      )}

      {/* Estado actual */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-1">Estado actual:</p>
        <p className="text-sm font-semibold text-gray-900">
          {currentStatus === 'delivered' ? 'Entregado' : 
           currentStatus === 'in_transit' ? 'En Tránsito' : 
           steps[currentStepIndex]?.label}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {currentStatus === 'delivered' ? 'El envío ha sido entregado exitosamente' : 
           currentStatus === 'in_transit' ? 'Usa el formulario de abajo para completar la entrega' : 
           steps[currentStepIndex]?.description}
        </p>
      </div>
    </div>
  )
}