import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 [API] Verificando sesión actual...')
    
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ [API] Error verificando sesión:', error)
      return NextResponse.json(
        { 
          session: null,
          user: null,
          error: error.message 
        },
        { status: 401 }
      )
    }
    
    console.log('✅ [API] Sesión verificada:', user ? 'Autenticado' : 'No autenticado')
    
    return NextResponse.json({
      session: user ? { user } : null,
      user: user,
      authenticated: !!user
    })
    
  } catch (error) {
    console.error('❌ [API] Error inesperado verificando sesión:', error)
    return NextResponse.json(
      { 
        session: null,
        user: null,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}