/**
 * Constantes y configuración para el generador de etiquetas
 */

export const DEFAULT_REMITENTE = {
  nombreRemitente: 'Urban City Logistics',
  telefonoRemitente: '+56 9 1234 5678',
  direccionRemitente: 'Av. Providencia 1234, Santiago'
} as const

export const DEFAULT_LOCALIDAD = 'La Plata'

export const TIPO_ENVIO_OPTIONS = [
  { value: 'cambio', label: 'Cambio' },
  { value: 'particular', label: 'Particular' }
] as const

export const TIPO_ENTREGA_OPTIONS = [
  { value: 'entregar', label: 'Solo Entregar', totalACobrar: '0' },
  { value: 'cobrar', label: 'A Cobrar', totalACobrar: '1' },
  { value: 'cambio', label: 'Cambio', totalACobrar: '2' }
] as const

export const CALIDAD_OPTIONS = [
  { value: 'simple', label: 'Simple' },
  { value: 'alta', label: 'Alta Calidad' }
] as const

export const STEP_CONFIG = {
  1: { title: 'Pegar Chat', description: 'Pega el mensaje de WhatsApp' },
  2: { title: 'Revisar Datos', description: 'Verifica y completa la información' },
  3: { title: 'Generar PDF', description: 'Descarga tu etiqueta' }
} as const

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500
} as const

export const extractoRegex = {
  phone: /(\+56\s?9\s?\d{4}\s?\d{4}|9\s?\d{4}\s?\d{4})/,
  name: /(?:Hola|Hola,|Gracias|Gracias,)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
  address: [
    /(Av\.|Avenida|Calle|Cll|Psje|Pasaje)\s+[A-Z0-9\s\-\#°]+/i,
    /([A-Z][a-z]+\s+\d+\s*[A-Z0-9\s\-]*)/
  ],
  cp: /\b(\d{4,7})\b/,
  product: [
    /compr[eé]\s+(.+?)\s+(?:por|en)/i,
    /producto[:\s]+(.+?)(?:\n|$)/i
  ],
  price: /\$(\d+(?:\.\d{3})?(?:,\d+)?)/
} as const

export const API_ENDPOINTS = {
  GENERAR_ETIQUETA: '/api/generar-etiqueta'
} as const