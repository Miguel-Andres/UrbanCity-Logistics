/**
 * API Route para generar PDFs de etiquetas
 */
import { NextRequest } from 'next/server'
import { puppeteerService } from './services/puppeteer-service'
import { PDFData, GeneratedPDFResponse } from './types'

/**
 * Endpoint POST para generar PDFs
 * Body: PDFData
 * Returns: PDF Buffer
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('API /api/generar-pdf - Iniciando procesamiento')
    
    // Parsear los datos del request
    const datos: PDFData = await request.json()
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

    // Generar el PDF usando el servicio
    console.log('Invocando al servicio de generación de PDF...')
    const resultado: GeneratedPDFResponse = await puppeteerService.generarPDF(datos)
    
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

    // Devolver el PDF
    return new Response(resultado.pdf as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resultado.filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': resultado.pdf.length.toString()
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