/**
 * Server Component para página de delivery
 * Igual patrón que tracking para evitar problemas con client components
 */
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { AlertCircle, Home } from 'lucide-react'
import { DeliveryHeader } from './components/delivery-header'
import { ShipmentInfoCard } from './components/shipment-info-card'
import { DeliveryStepper } from './components/delivery-stepper'
import { DeliveryUpdateForm } from './components/delivery-update-form'
import type { Shipment } from './types'

interface PageProps {
  params: Promise<{
    code: string
  }>
}

async function getShipment(code: string): Promise<Shipment> {
  console.log('🔍 [DeliveryPage] Buscando shipment con code:', code)
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  console.log('🔍 [getShipment] Obteniendo shipment por tracking_code')
  
  // Obtener shipment
  const { data: shipment, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('tracking_code', code.toUpperCase())
    .single()

  console.log('✅ [getShipment] Query completada')

  if (error || !shipment) {
    console.log('❌ [getShipment] Shipment no encontrado - error:', error)
    notFound()
  }

  console.log('🚀 [getShipment] Retornando shipment:', shipment.tracking_code)

  return shipment as Shipment
}

export default async function DeliveryPage({ params }: PageProps) {
  const { code } = await params
  console.log('🚀 [DeliveryPage] Server Component con code:', code)

  try {
    const shipment = await getShipment(code)
    console.log('✅ [DeliveryPage] Shipment encontrado:', shipment.tracking_code)

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header Sticky para Mobile */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <DeliveryHeader shipment={shipment} />
        </div>

        {/* Contenido Principal */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Info del Destinatario */}
          <ShipmentInfoCard shipment={shipment} />
          
          {/* Stepper de Estados */}
          <DeliveryStepper 
            shipment={shipment}
            disabled={shipment.status === 'delivered'}
          />
          
          {/* Formulario de Actualización - Solo mostrar si no está entregado */}
          {shipment.status !== 'delivered' && (
            <DeliveryUpdateForm shipment={shipment} />
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.log('❌ [DeliveryPage] Mostrando página de no encontrado')
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Envío No Encontrado</h1>
          <p className="text-gray-600 mb-6">No se pudo encontrar el envío con este código</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 inline mr-2" />
            Ir al Inicio
          </button>
        </div>
      </div>
    )
  }
}