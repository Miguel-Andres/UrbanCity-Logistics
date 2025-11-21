/**
 * Generador de códigos de tracking aleatorios
 * Formato: UC-ABC123 (6 caracteres aleatorios)
 */

import { createClient } from '@supabase/supabase-js'

// Caracteres para generar códigos (sin confusiones: 0 vs O, 1 vs I, etc.)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 28 caracteres
const CODE_LENGTH = 6
const PREFIX = 'UC'
const MAX_RETRIES = 10

// Generar código aleatorio de 6 caracteres
function generateRandomCode(): string {
  let result = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

// Generar código completo con prefijo
export function generateTrackingCode(): string {
  const randomCode = generateRandomCode()
  return `${PREFIX}-${randomCode}`
}

// Generar código único verificando que no exista en BD
export async function generateUniqueTrackingCode(): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Usar service role para poder verificar
  )

  let attempts = 0
  
  while (attempts < MAX_RETRIES) {
    const code = generateTrackingCode()
    
    try {
      // Verificar si el código ya existe
      const { data, error } = await supabase
        .from('shipments')
        .select('tracking_code')
        .eq('tracking_code', code)
        .single()

      if (error && error.code === 'PGRST116') {
        // No se encontró el código, es único
        return code
      }

      // Si encontramos el código, intentamos con otro
      attempts++
    } catch (error) {
      console.error('Error checking tracking code uniqueness:', error)
      attempts++
    }
  }

  throw new Error(`Could not generate unique tracking code after ${MAX_RETRIES} attempts`)
}

// Validar formato de código de tracking
export function validateTrackingCode(code: string): boolean {
  const pattern = /^UC-[A-Z0-9]{6}$/
  return pattern.test(code.toUpperCase())
}

// Extraer código sin prefijo
export function extractCodeWithoutPrefix(trackingCode: string): string {
  return trackingCode.replace(/^UC-/, '')
}

// Calcular probabilidad de colisión (informativo)
export function calculateCollisionProbability(): string {
  const totalCombinations = Math.pow(CHARS.length, CODE_LENGTH)
  const probability = 1 / totalCombinations
  return `1 en ${totalCombinations.toLocaleString()} (${(probability * 100).toFixed(6)}%)`
}

// Ejemplo de uso:
// const code = generateTrackingCode() // "UC-A3B7K9"
// const uniqueCode = await generateUniqueTrackingCode() // "UC-X4M2Q8" (verificado en BD)
// const isValid = validateTrackingCode("UC-ABC123") // true