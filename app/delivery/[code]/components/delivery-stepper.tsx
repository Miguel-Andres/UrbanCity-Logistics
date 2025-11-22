'use client'

import { useState } from 'react'
import { CheckCircle, Clock, Truck } from 'lucide-react'
import type { Shipment } from '../types'

interface DeliveryStepperProps {
  shipment: Shipment
  disabled?: boolean
}

const steps = [
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
  }
]

export function DeliveryStepper({ shipment, disabled = false }: DeliveryStepperProps) {
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'in_transit' | 'delivered' | 'failed'>(shipment.status)
  
  const getCurrentStepIndex = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStatus)
    return stepIndex >= 0 ? stepIndex : 0
  }

  const currentStepIndex = getCurrentStepIndex()
  // Solo puede avanzar de "pending" a "in_transit"
  const canAdvance = currentStatus === 'pending' && !disabled

  const handleNextStep = async () => {
    if (canAdvance) {
      try {
        const response = await fetch(`/api/delivery/${shipment.tracking_code}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'in_transit'
          }),
        })

        if (!response.ok) {
          throw new Error('Error al actualizar estado')
        }

        setCurrentStatus('in_transit')
        
        // Mostrar mensaje de éxito
        alert('Estado actualizado a: En Tránsito')
        
        // Recargar para mostrar formulario de entrega
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (error) {
        alert('Error al actualizar el estado')
      }
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
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Truck className="w-5 h-5" />
          Iniciar Tránsito
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