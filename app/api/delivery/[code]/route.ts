import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const { status, delivered_by, received_by, notes } = body

    console.log('🔄 [API] Actualizando shipment:', code)

    // Crear cliente con service role para bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener shipment
    const { data: shipment, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_code', code.toUpperCase())
      .single()

    if (fetchError || !shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Validar que si se marca como entregado, se tenga quién lo recibió
    if (status === 'delivered' && !received_by) {
      return NextResponse.json(
        { error: 'received_by is required when status is delivered' },
        { status: 400 }
      )
    }

    // Actualizar shipment
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString()
      updateData.delivered_by = delivered_by || null
      updateData.received_by = received_by || null
      updateData.delivery_notes = notes || null
    }

    const { error: updateError } = await supabase
      .from('shipments')
      .update(updateData)
      .eq('id', shipment.id)

    if (updateError) {
      console.error('❌ [API] Error actualizando shipment:', updateError)
      return NextResponse.json(
        { error: 'Failed to update shipment' },
        { status: 500 }
      )
    }

    // Crear tracking event
    const { error: eventError } = await supabase
      .from('tracking_events')
      .insert({
        shipment_id: shipment.id,
        status,
        notes: notes || null,
        delivered_by: delivered_by || null,
        received_by: received_by || null
      })

    if (eventError) {
      console.error('⚠️ [API] Error creando tracking event:', eventError)
    }

    console.log('✅ [API] Shipment actualizado exitosamente')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ [API] Error general:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}