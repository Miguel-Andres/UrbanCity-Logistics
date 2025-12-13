/**
 * Constantes para el generador de etiquetas
 */

// Datos por defecto
export const DEFAULT_REMITENTE = {
  nombreRemitente: '',
  telefonoRemitente: ''
}

export const DEFAULT_LOCALIDAD = 'La Plata'

// Opciones de tipos de envío
export const TIPO_ENVIO_OPTIONS = [
  { value: 'VENTA', label: 'VENTA' },
  { value: 'CAMBIO', label: 'CAMBIO' }
]

// Opciones de tipo de entrega
export const TIPO_ENTREGA_OPTIONS = [
  { value: 'entregar', label: 'PAGADO', totalACobrar: '0' },
  { value: 'cobrar', label: 'COBRAR', totalACobrar: '1' },
  { value: 'cambio', label: 'CAMBIO', totalACobrar: '2' }
]

// Expresiones regulares para extraer datos del chat
export const extractoRegex = {
  phone: /(\+56\s?9\s?\d{4}\s?\d{4}|9\s?\d{4}\s?\d{4})/,
  name: /(?:soy|mi nombre es|nombre|me llamo)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/i,
  address: [
    /(calle|avenida|av|c|avenidas|c\.|av\.)\s+([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+\d+)/i,
    /([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\d+)\s+(calle|avenida|av|c)/i
  ],
  cp: /\b\d{4,7}\b/,
  product: [
    /compr[eaé]\s+(.+)/i,
    /producto[:\s]+(.+)/i,
    /artículo[:\s]+(.+)/i
  ],
  price: /\$[\s]*(\d+(?:[.,]\d+)?)/
}

// API Endpoints
export const API_ENDPOINTS = {
  GENERAR_ETIQUETA: '/api/generar-pdf'
}

// Configuraciones adicionales
export const STEP_CONFIG = {
  STEP_1: 'Pegar chat',
  STEP_2: 'Completar formulario',
  STEP_3: 'Generar PDF'
}

export const ANIMATION_DURATION = 300

// Calidad opciones (no usada actualmente)
export const CALIDAD_OPTIONS = [
  { value: 'simple', label: 'Simple' },
  { value: 'premium', label: 'Premium' }
]