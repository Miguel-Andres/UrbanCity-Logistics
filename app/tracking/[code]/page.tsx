/**
 * Server Component para página pública de tracking
 * Muestra información del envío y su historial de eventos
 */
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { TrackingHeader } from '@/components/tracking/tracking-header'
import { ShipmentInfo } from '@/components/tracking/shipment-info'
import { TrackingTimeline } from '@/components/tracking/tracking-timeline'
import { TrackingNotFound } from '@/components/tracking/tracking-not-found'
import { TrackingFooter } from '@/components/tracking/tracking-footer'

interface PageProps {
  params: Promise<{
    code: string
  }>
}

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

interface TrackingEvent {
  id: string
  shipment_id: string
  status: string
  notes?: string
  delivered_by?: string
  received_by?: string
  created_at: string
}

async function getShipmentWithEvents(code: string): Promise<{ shipment: Shipment | null; events: TrackingEvent[] }> {
  if (!code) {
    return { shipment: null, events: [] }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Obtener shipment público
  const { data: shipment, error: shipmentError } = await supabase
    .from('shipments')
    .select(`
      id,
      tracking_code,
      recipient_name,
      recipient_phone,
      recipient_address,
      recipient_city,
      recipient_reference,
      shipment_type,
      payment_type,
      amount_to_charge,
      status,
      created_at,
      delivered_at,
      delivered_by,
      received_by,
      delivery_notes
    `)
    .eq('tracking_code', code.toUpperCase())
    .single()

  if (shipmentError) {
    // Si es "not found", no es realmente un error
    if (shipmentError.code === 'PGRST116') {
      console.log('Shipment not found for code:', code)
      return { shipment: null, events: [] }
    }
    console.error('Error fetching shipment:', shipmentError)
    return { shipment: null, events: [] }
  }

  if (!shipment) {
    return { shipment: null, events: [] }
  }

  // Obtener eventos de tracking
  const { data: events, error: eventsError } = await supabase
    .from('tracking_events')
    .select(`
      id,
      shipment_id,
      status,
      notes,
      delivered_by,
      received_by,
      created_at
    `)
    .eq('shipment_id', shipment.id)
    .order('created_at', { ascending: true })

  // Si hay error o no hay eventos, retornar array vacío
  if (eventsError) {
    // No mostrar error en consola si es solo que no hay eventos
    if (eventsError.code !== 'PGRST116') {
      console.error('Error fetching tracking events:', eventsError)
    }
    return { shipment, events: [] }
  }

  return { shipment, events: events || [] }
}

export default async function TrackingPage({ params }: PageProps) {
  const { code } = await params
  const { shipment, events } = await getShipmentWithEvents(code)

  // Si no se encuentra el shipment, mostrar página 404 personalizada
  if (!shipment) {
    return <TrackingNotFound code={code || ''} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TrackingHeader trackingCode={shipment.tracking_code} />
      
      <div className="max-w-5xl mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información principal del envío */}
          <div className="space-y-6">
            <ShipmentInfo shipment={shipment} />
          </div>
          
          {/* Timeline de eventos */}
          <div>
            <TrackingTimeline events={events} />
          </div>
        </div>
      </div>
      
      <TrackingFooter trackingCode={shipment.tracking_code} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params
  const { shipment } = await getShipmentWithEvents(code)
  
  if (!shipment) {
    return {
      title: 'Envío No Encontrado - Urban City Logistics',
      description: 'No se pudo encontrar el envío con el código proporcionado'
    }
  }

  const statusLabels = {
    pending: 'Pendiente',
    in_transit: 'En Tránsito',
    delivered: 'Entregado',
    failed: 'Fallido'
  }

  return {
    title: `Seguimiento de Envío ${shipment.tracking_code} - Urban City Logistics`,
    description: `Seguimiento del envío ${shipment.tracking_code} con destino a ${shipment.recipient_city}. Estado actual: ${statusLabels[shipment.status]}.`,
    openGraph: {
      title: `Seguimiento: ${shipment.tracking_code}`,
      description: `Estado: ${statusLabels[shipment.status]} | Destino: ${shipment.recipient_city}`,
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-tracking.png`,
          width: 1200,
          height: 630,
          alt: 'Urban City Logistics Tracking'
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `Seguimiento: ${shipment.tracking_code}`,
      description: `Estado: ${statusLabels[shipment.status]} | Destino: ${shipment.recipient_city}`
    },
    robots: {
      index: false, // No indexar páginas de tracking para privacidad
      follow: false
    }
  }
}