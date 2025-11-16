/**
 * API para generar código ZPL para etiquetas
 */

import { NextRequest, NextResponse } from 'next/server'
import { generarTemplateZPL } from './zpl-template'
import { FormData } from '@/app/etiquetas/types'

export async function POST(request: NextRequest) {
  try {
    // Obtener datos del body
    const data: FormData = await request.json()

    // Validaciones básicas
    if (!data.nombreDestinatario || !data.telefonoDestinatario) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre del destinatario y teléfono' },
        { status: 400 }
      )
    }

    // Generar código ZPL usando el template existente
    const zplCode = generarTemplateZPL(data)

    // Registrar en consola para seguimiento
    console.log(`ZPL generado para: ${data.nombreDestinatario} - ${data.localidadDestinatario}`)

    // Devolver el código ZPL como texto
    return new NextResponse(zplCode, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="etiqueta-${data.nombreDestinatario?.replace(/\s+/g, '').substring(0, 11)}-${Math.floor(Math.random() * 1000)}.zpl"`
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