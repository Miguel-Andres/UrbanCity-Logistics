/**
 * Helpers de base de datos para operaciones de tracking
 */

import { createClient } from '@supabase/supabase-js'
import { generateUniqueTrackingCode } from './tracking-code-generator'

// Tipo para datos de envío
export interface ShipmentData {
  tracking_code: string
  user_id: string
  recipient_name: string
  recipient_phone?: string
  recipient_address: string
  recipient_city?: string
  recipient_reference?: string
  shipment_type?: 'VENTA' | 'CAMBIO'
  payment_type?: 'COBRAR' | 'PAGADO'
  amount_to_charge?: number
  ship_date?: string
  notes?: string
  status?: 'pending' | 'in_transit' | 'delivered' | 'failed'
}

// Tipo para evento de tracking
export interface TrackingEventData {
  shipment_id: string
  status: 'pending' | 'in_transit' | 'delivered' | 'failed'
  notes?: string
  delivered_by?: string
  received_by?: string
}

// Cliente de Supabase para operaciones del lado del servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Crear un nuevo envío con código único
 */
export async function createShipment(data: Omit<ShipmentData, 'tracking_code' | 'status'>) {
  try {
    // Generar código único
    const tracking_code = await generateUniqueTrackingCode()

    // Insertar envío
    const { data: shipment, error } = await supabaseAdmin
      .from('shipments')
      .insert({
        ...data,
        tracking_code,
        status: 'pending' // Estado inicial
      })
      .select()
      .single()

    if (error) throw error

    // Crear evento inicial
    await createTrackingEvent({
      shipment_id: shipment.id,
      status: 'pending',
      notes: 'Envío creado y pendiente de recolección'
    })

    return shipment
  } catch (error) {
    console.error('Error creating shipment:', error)
    throw error
  }
}

/**
 * Obtener envío por código de tracking (acceso público)
 */
export async function getShipmentByCode(trackingCode: string) {
  try {
    // Usar la función segura que creamos en la migración
    const { data, error } = await supabaseAdmin
      .rpc('get_shipment_by_code', {
        tracking_code_param: trackingCode
      })

    if (error) throw error
    return data[0] || null
  } catch (error) {
    console.error('Error getting shipment by code:', error)
    throw error
  }
}

/**
 * Obtener eventos de tracking por código (acceso público)
 */
export async function getTrackingEventsByCode(trackingCode: string) {
  try {
    const { data, error } = await supabaseAdmin
      .rpc('get_tracking_events_by_code', {
        tracking_code_param: trackingCode
      })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting tracking events:', error)
    throw error
  }
}

/**
 * Obtener envíos de un usuario autenticado
 */
export async function getUserShipments(
  userId: string,
  options: {
    page?: number
    limit?: number
    status?: string
  } = {}
) {
  try {
    const { page = 1, limit = 20, status } = options
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin
      .from('shipments')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to)

    // Filtrar por estado si se especifica
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      shipments: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error getting user shipments:', error)
    throw error
  }
}

/**
 * Crear evento de tracking
 */
export async function createTrackingEvent(data: TrackingEventData) {
  try {
    const { data: event, error } = await supabaseAdmin
      .from('tracking_events')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return event
  } catch (error) {
    console.error('Error creating tracking event:', error)
    throw error
  }
}

/**
 * Actualizar estado de un envío
 */
export async function updateShipmentStatus(
  shipmentId: string,
  status: 'pending' | 'in_transit' | 'delivered' | 'failed',
  options?: {
    delivered_by?: string
    received_by?: string
    delivery_notes?: string
  }
) {
  try {
    // Actualizar envío
    const { data: shipment, error: shipmentError } = await supabaseAdmin
      .from('shipments')
      .update({
        status,
        delivered_at: status === 'delivered' ? new Date().toISOString() : null,
        delivered_by: options?.delivered_by,
        received_by: options?.received_by,
        delivery_notes: options?.delivery_notes
      })
      .eq('id', shipmentId)
      .select()
      .single()

    if (shipmentError) throw shipmentError

    // Crear evento de tracking
    const statusText = {
      pending: 'Pendiente de recolección',
      in_transit: 'En tránsito',
      delivered: 'Entregado',
      failed: 'Falló la entrega'
    }

    await createTrackingEvent({
      shipment_id: shipmentId,
      status,
      notes: options?.delivery_notes || statusText[status],
      delivered_by: options?.delivered_by,
      received_by: options?.received_by
    })

    return shipment
  } catch (error) {
    console.error('Error updating shipment status:', error)
    throw error
  }
}

/**
 * Verificar si un usuario tiene permiso para modificar un envío
 */
export async function verifyShipmentOwnership(shipmentId: string, userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('shipments')
      .select('id')
      .eq('id', shipmentId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error verifying shipment ownership:', error)
    return false
  }
}

/**
 * Obtener estadísticas de envíos de un usuario
 */
export async function getUserShipmentStats(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('shipments')
      .select('status')
      .eq('user_id', userId)

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      pending: 0,
      in_transit: 0,
      delivered: 0,
      failed: 0
    }

    data?.forEach(shipment => {
      stats[shipment.status as keyof typeof stats]++
    })

    return stats
  } catch (error) {
    console.error('Error getting user shipment stats:', error)
    throw error
  }
}