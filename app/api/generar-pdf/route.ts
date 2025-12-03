/**
 * API Route para generar PDFs de etiquetas con tracking integrado
 */
import { NextRequest } from 'next/server'
import { reactPDFService } from './services/react-pdf-service'
import { PDFData, GeneratedPDFResponse } from './types'
import { createShipment } from '@/lib/tracking-helpers'
import { createClient } from '@supabase/supabase-js'

/**
 * Endpoint POST para generar PDFs
 * Body: PDFData
 * Returns: PDF Buffer
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('API /api/generar-pdf - Iniciando procesamiento')
    
    // Parsear los datos del request (frontend debe enviar user_id)
    const datos: PDFData & { user_id: string } = await request.json()
    
    // Validar que venga user_id
    if (!datos.user_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Se requiere user_id para generar etiquetas'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    console.log('Datos recibidos:', {
      nombre: datos.nombre,
      telefono: datos.telefono,
      tipoEtiqueta: datos.tipoEtiqueta,
      tipoEnvio: datos.tipoEnvio,
      tipoEntrega: datos.tipoEntrega
    })
    
    // Validar datos mínimos requeridos
    if (!datos.nombre || !datos.telefono) {
      console.warn('Validación fallida: Faltan campos obligatorios')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Nombre y teléfono son obligatorios',
          required_fields: ['nombre', 'telefono']
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Crear shipment en la base de datos con tracking_code
    console.log('Creando shipment en base de datos...')
    let shipment
    try {
      shipment = await createShipment({
        user_id: datos.user_id,  // Usar user_id del request
        recipient_name: datos.nombre,
        recipient_phone: datos.telefono,
        recipient_address: datos.direccion || '',
        recipient_city: datos.localidad,
        recipient_reference: datos.entreCalles,
        shipment_type: datos.tipoEnvio as 'VENTA' | 'CAMBIO',
        payment_type: datos.tipoEntrega as 'COBRAR' | 'SOLO ENTREGAR',
        amount_to_charge: datos.tipoEntrega === 'COBRAR' ? datos.montoACobrar || 0 : undefined,
        ship_date: datos.fecha,
        notes: datos.observaciones
      })
      console.log('Shipment creado exitosamente:', shipment.tracking_code)
    } catch (error) {
      console.error('Error creando shipment:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error creando envío en base de datos',
          details: error instanceof Error ? error.message : 'Error desconocido'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Agregar tracking_code a los datos para incluir en el PDF
    const datosConTracking = {
      ...datos,
      tracking_code: shipment.tracking_code
    }

    // Generar el PDF usando el servicio
    console.log('Invocando al servicio de generación de PDF con React-PDF...')
    const resultado: GeneratedPDFResponse = await reactPDFService.generarPDF(datosConTracking)
    
    if (!resultado.success || !resultado.pdf) {
      console.error('Fallo en la generación del PDF:', resultado.error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: resultado.error || 'Error generando el PDF',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Log de éxito
    const duration = Date.now() - startTime
    console.log(`PDF generado exitosamente en ${duration}ms. Tamaño: ${resultado.pdf.length} bytes`)

    // Devolver el PDF con headers adicionales incluyendo tracking_code
    return new Response(resultado.pdf as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resultado.filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': resultado.pdf.length.toString(),
        // Headers adicionales con información del tracking
        'X-Tracking-Code': shipment.tracking_code,
        'X-Shipment-ID': shipment.id,
        'X-Tracking-URL': `${request.nextUrl.origin}/tracking/${shipment.tracking_code}`
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`Error en API route /api/generar-pdf después de ${duration}ms:`, error)
    
    // Determinar si es un error de parseo JSON
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'JSON inválido en el cuerpo de la solicitud',
          hint: 'Verifica que el body contenga un JSON válido'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Error general
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * Método OPTIONS para CORS
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}