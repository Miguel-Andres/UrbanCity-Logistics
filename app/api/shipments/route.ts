import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Calcular offset
    const offset = (page - 1) * limit

    // Construir query
    let query = supabase
      .from('shipments')
      .select(`
        id,
        tracking_code,
        recipient_name,
        recipient_phone,
        recipient_address,
        recipient_city,
        status,
        payment_type,
        amount_to_charge,
        created_at,
        delivered_at
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (status && status !== 'todos') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`tracking_code.ilike.%${search}%,recipient_name.ilike.%${search}%`)
    }

    // Aplicar paginación
    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching shipments:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Calcular total de páginas
    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      shipments: data || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })

  } catch (error) {
    console.error('Shipments API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}