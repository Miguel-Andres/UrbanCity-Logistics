import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Shipment, UpdateForm } from '../types'

interface UseUpdateShipmentReturn {
  updating: boolean
  updateShipment: (
    shipment: Shipment,
    formData: UpdateForm,
    onSuccess?: () => void
  ) => Promise<boolean>
}

export function useUpdateShipment(): UseUpdateShipmentReturn {
  const [updating, setUpdating] = useState(false)

  const updateShipment = async (
    shipment: Shipment,
    formData: UpdateForm,
    onSuccess?: () => void
  ): Promise<boolean> => {
    console.log('🔄 [useUpdateShipment] Iniciando actualización')
    console.log('📦 [useUpdateShipment] Shipment ID:', shipment.id)
    console.log('📝 [useUpdateShipment] Form data:', formData)

    setUpdating(true)

    try {
      const supabase = createClient()
      console.log('✅ [useUpdateShipment] Supabase client creado')

      // Validar que si se marca como entregado, se tenga quién lo recibió
      if (formData.status === 'delivered' && !formData.received_by) {
        alert('Por favor, ingresa quién recibió el paquete')
        setUpdating(false)
        return false
      }

      // Preparar datos de actualización
      const updateData: any = {
        status: formData.status,
        updated_at: new Date().toISOString()
      }

      if (formData.status === 'delivered') {
        updateData.delivered_at = new Date().toISOString()
        updateData.delivered_by = formData.delivered_by || null
        updateData.received_by = formData.received_by || null
        updateData.delivery_notes = formData.delivery_notes || null
      }

      console.log('📤 [useUpdateShipment] Actualizando shipment con:', updateData)

      // Actualizar shipment
      const { error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', shipment.id)

      if (error) {
        console.error('❌ [useUpdateShipment] Error actualizando shipment:', error)
        throw error
      }

      console.log('✅ [useUpdateShipment] Shipment actualizado correctamente')

      // Crear tracking event
      console.log('📝 [useUpdateShipment] Creando tracking event...')
      const { error: eventError } = await supabase
        .from('tracking_events')
        .insert({
          shipment_id: shipment.id,
          status: formData.status as 'pending' | 'in_transit' | 'delivered' | 'failed',
          notes: formData.delivery_notes || null,
          delivered_by: formData.delivered_by || null,
          received_by: formData.received_by || null
        })

      if (eventError) {
        console.error('⚠️ [useUpdateShipment] Error creando tracking event:', eventError)
      } else {
        console.log('✅ [useUpdateShipment] Tracking event creado')
      }

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess()
      }

      return true
    } catch (err) {
      console.error('❌ [useUpdateShipment] Error en actualización:', err)
      alert('Error al actualizar el estado. Por favor, intenta nuevamente.')
      return false
    } finally {
      setUpdating(false)
      console.log('🏁 [useUpdateShipment] Actualización finalizada')
    }
  }

  return {
    updating,
    updateShipment
  }
}