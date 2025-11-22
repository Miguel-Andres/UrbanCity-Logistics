/**
 * Server Component para página de delivery
 * Igual patrón que tracking para evitar problemas con client components
 */
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { AlertCircle, Home } from 'lucide-react'
import { DeliveryHeader } from './components/delivery-header'
import { ShipmentInfoCard } from './components/shipment-info-card'
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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            cookies().set(name, value)
          )
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('tracking_code', code.toUpperCase())
    .single()

  console.log('🔍 [DeliveryPage] Response:', { data, error })

  if (error || !data) {
    console.log('❌ [DeliveryPage] Shipment no encontrado')
    notFound()
  }

  return data as Shipment
}

export default async function DeliveryPage({ params }: PageProps) {
  const { code } = await params
  console.log('🚀 [DeliveryPage] Server Component con code:', code)

  try {
    const shipment = await getShipment(code)
    console.log('✅ [DeliveryPage] Shipment encontrado:', shipment.tracking_code)

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <DeliveryHeader shipment={shipment} />
          <ShipmentInfoCard shipment={shipment} />
          <DeliveryUpdateForm shipment={shipment} />
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