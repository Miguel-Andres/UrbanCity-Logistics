import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Shipment } from '../types'

interface UseShipmentReturn {
  shipment: Shipment | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useShipment(code: string): UseShipmentReturn {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShipment = async () => {
    console.log('🔍 [useShipment] Iniciando fetch para code:', code)
    
    try {
      const supabase = createClient()
      console.log('🔍 [useShipment] Supabase client creado')
      
      setLoading(true)
      setError(null)

      console.log('🔍 [useShipment] Ejecutando query...')
      
      // Primero, probemos una query simple para ver si Supabase responde
      console.log('🔍 [useShipment] Probando conexión con Supabase...')
      
      try {
        const { data: testData, error: testError } = await supabase
          .from('shipments')
          .select('count', { count: 'exact', head: true })
        
        console.log('🔍 [useShipment] Test query result:', { testData, testError })
        
        if (testError) {
          console.error('❌ [useShipment] Error en test query:', testError)
          throw testError
        }
      } catch (err) {
        console.error('❌ [useShipment] Error en test de conexión:', err)
        throw new Error('No se puede conectar a Supabase')
      }
      
      // Si la prueba funciona, hacemos la query real
      console.log('🔍 [useShipment] Ejecutando query real...')
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_code', code.toUpperCase())
        .single()

      console.log('🔍 [useShipment] Response:', { data, error })
      console.log('🔍 [useShipment] Data type:', typeof data)
      console.log('🔍 [useShipment] Error type:', typeof error)

      if (error) {
        console.error('❌ [useShipment] Error en Supabase:', error)
        throw error
      }

      if (data) {
        console.log('✅ [useShipment] Shipment encontrado:', data.tracking_code)
        setShipment(data)
      } else {
        console.log('❌ [useShipment] No se encontró shipment')
        setError('Código de seguimiento no encontrado')
      }
    } catch (err) {
      console.error('❌ [useShipment] Error general:', err)
      setError('Error al buscar el envío')
    } finally {
      console.log('🏁 [useShipment] Fetch finalizado')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (code) {
      fetchShipment()
    }
  }, [code])

  return {
    shipment,
    loading,
    error,
    refetch: fetchShipment
  }
}