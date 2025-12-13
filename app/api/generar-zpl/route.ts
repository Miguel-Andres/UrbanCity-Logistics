/**
 * API para generar código ZPL para etiquetas con tracking integrado
 */

import { NextRequest, NextResponse } from 'next/server'
import { generarTemplateZPL } from './zpl-template'
import { FormData } from '@/app/etiquetas/types'
import { createShipment } from '@/lib/tracking-helpers'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Obtener datos del body (frontend debe enviar user_id)
    const data: FormData & { user_id: string } = await request.json()
    
    // Validar que venga user_id
    if (!data.user_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Se requiere user_id para generar etiquetas'
        },
        { status: 400 }
      )
    }

    // Validaciones básicas
    if (!data.nombre || !data.telefono) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre del destinatario y teléfono' },
        { status: 400 }
      )
    }
    
    // Crear shipment en la base de datos con tracking_code
    let shipment
    try {
      shipment = await createShipment({
        user_id: data.user_id,  // Usar user_id del request
        recipient_name: data.nombre,
        recipient_phone: data.telefono,
        recipient_address: data.direccion || '',
        recipient_city: data.localidad,
        recipient_reference: data.entreCalles,
        shipment_type: data.tipoEnvio as 'VENTA' | 'CAMBIO',
        payment_type: data.tipoEntrega as 'COBRAR' | 'PAGADO',
        amount_to_charge: data.tipoEntrega === 'COBRAR' ? data.montoACobrar || 0 : undefined,
        ship_date: data.fecha,
        notes: data.observaciones
      })
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error creando envío en base de datos',
          details: error instanceof Error ? error.message : 'Error desconocido'
        },
        { status: 500 }
      )
    }
    
    // Agregar tracking_code a los datos
    const dataConTracking = {
      ...data,
      tracking_code: shipment.tracking_code
    }

    // Generar código ZPL usando el template con tracking_code
    const zplCode = generarTemplateZPL(dataConTracking)

    // Registrar en consola para seguimiento
    console.log(`ZPL generado para: ${data.nombre} - ${data.localidad}, Tracking: ${shipment.tracking_code}`)

    // Devolver el código ZPL como texto con headers adicionales
    return new NextResponse(zplCode, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="etiqueta-${data.tipoEnvio?.replace(/\s+/g, '') || 'SINTIPO'}-${data.nombre?.substring(0, 12).replace(/\s+/g, '') || 'SINNOMBRE'}-${shipment.tracking_code}.txt"`,
        // Headers adicionales con información del tracking
        'X-Tracking-Code': shipment.tracking_code,
        'X-Shipment-ID': shipment.id,
        'X-Tracking-URL': `${request.nextUrl.origin}/tracking/${shipment.tracking_code}`
      }
    })

  } catch (error) {
    console.error('Error generando ZPL:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor al generar ZPL' },
      { status: 500 }
    )
  }
}

// Método OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}