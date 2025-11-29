import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 [API] Verificando estado del perfil...')
    
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('❌ [API] Usuario no autenticado')
      return NextResponse.json({
        authenticated: false,
        error: 'Usuario no autenticado',
        user: null,
        profile: null
      })
    }
    
    console.log('✅ [API] Usuario autenticado:', user.id, user.email)
    
    // Obtener perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    console.log('📊 [API] Datos del perfil:', {
      profile,
      profileError,
      hasStoreName: !!profile?.store_name,
      storeNameValue: profile?.store_name,
      storeNameLength: profile?.store_name?.length
    })
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      },
      profile: profile,
      profileError: profileError?.message,
      hasStoreName: !!profile?.store_name,
      storeName: profile?.store_name || 'NO CONFIGURADO'
    })
    
  } catch (error) {
    console.error('❌ [API] Error verificando perfil:', error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      user: null,
      profile: null
    })
  }
}