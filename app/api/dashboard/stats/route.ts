import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Query optimizada para stats del dashboard
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        id,
        tracking_code,
        status,
        created_at,
        delivered_at,
        payment_type,
        amount_to_charge,
        recipient_name,
        recipient_phone,
        recipient_address
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching shipments:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const today = new Date().toISOString().split('T')[0]
    
    // Calcular estadísticas
    const stats = {
      hoy_total: data?.filter(s => s.created_at.startsWith(today)).length || 0,
      pendientes: data?.filter(s => s.status === 'pending').length || 0,
      entregados_hoy: data?.filter(s => 
        s.status === 'delivered' && 
        s.delivered_at && 
        s.delivered_at.startsWith(today)
      ).length || 0,
      a_cobrar: data?.filter(s => 
        s.payment_type === 'COBRAR' && s.status !== 'delivered'
      ).reduce((sum, s) => sum + (s.amount_to_charge || 0), 0) || 0,
      total_envios: data?.length || 0
    }

    // Últimos 5 envíos
    const ultimos_envios = data?.slice(-5).reverse() || []

    return NextResponse.json({
      stats,
      ultimos_envios
    })

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}