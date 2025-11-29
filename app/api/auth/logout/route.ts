import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 [API] Iniciando logout via API...')
    
    const supabase = await createClient()
    
    // Hacer logout en Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ [API] Error en logout:', error)
      return NextResponse.json(
        { error: 'Error al cerrar sesión' },
        { status: 500 }
      )
    }
    
    console.log('✅ [API] Logout exitoso')
    
    // Crear respuesta con cabeceras para limpiar cookies
    const response = NextResponse.json({ success: true })
    
    // Forzar limpieza de cookies relacionadas con auth
    request.cookies.getAll().forEach(cookie => {
      if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
        response.cookies.delete(cookie.name)
      }
    })
    
    return response
    
  } catch (error) {
    console.error('❌ [API] Error inesperado en logout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}