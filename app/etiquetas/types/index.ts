/**
 * Types para el generador de etiquetas
 */

export interface LabelData {
  id: string
  nombreDestinatario: string
  telefonoDestinatario: string
  direccionDestinatario: string
  cpDestinatario: string
  localidad: string
  variante: string
  totalACobrar: string
  montoCobrar: string
  observaciones: string
  chat: string
}

export interface FormData {
  // Datos del destinatario
  nombreDestinatario: string
  telefonoDestinatario: string
  direccionDestinatario: string
  cpDestinatario: string
  
  // Datos del remitente
  nombreRemitente: string
  telefonoRemitente: string
  direccionRemitente: string
  
  // Datos del envío
  nroVenta: string
  nroEnvio: string
  nroEnvioCompleto: string
  chat: string
  localidad: string
  
  // Producto y servicio
  producto: string
  peso: string
  totalACobrar: string // 0 = solo entregar, 1 = a cobrar
  montoCobrar: string
  observaciones: string
  
  // Configuración de etiqueta
  tipoEtiqueta: TipoEtiqueta
  variante: string
  calidad: string
  bultos: number
  
  // Opciones adicionales
  llevaQR: boolean
  llevaCodigo: boolean
  incluyeLogo: boolean
}

export type TipoEtiqueta = '10x10' | '10x15' | 'A4'
export type TabType = 'single' | 'multiple'
export type StepType = 1 | 2 | 3

export interface ChatParseResult {
  nombreDestinatario: string
  telefonoDestinatario: string
  direccionDestinatario: string
  cpDestinatario: string
  chat: string
  producto: string
  totalACobrar: string
  nroVenta: string
  localidad: string
  montoCobrar?: string
}

export interface PDFGenerationState {
  isGenerating: boolean
  pdfUrl: string | null
  error: string | null
}