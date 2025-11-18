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
    if (!data.nombre || !data.telefono) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre del destinatario y teléfono' },
        { status: 400 }
      )
    }

    // Generar código ZPL usando el template existente
    const zplCode = generarTemplateZPL(data)

    // Registrar en consola para seguimiento
    console.log(`ZPL generado para: ${data.nombre} - ${data.localidad}`)

    // Devolver el código ZPL como texto
    return new NextResponse(zplCode, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${data.nombre?.substring(0, 11).replace(/\s+/g, '') || 'etiqueta'}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}.txt"`
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