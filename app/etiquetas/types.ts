/**
 * Tipos para el generador de etiquetas - Versión limpia y minimalista
 */

// Tipo para datos del formulario (solo los campos necesarios)
export interface FormData {
  // Datos del destinatario
  nombreDestinatario: string
  telefonoDestinatario: string
  localidadDestinatario?: string
  entreCalles?: string
  direccion?: string
  
  // Tipo de etiqueta
  tipoEtiqueta?: '10x10' | '10x15' | 'A4'
  
  // Tipo de envío
  tipoEnvio?: 'VENTA' | 'CAMBIO'
  
  // Tipo de entrega
  tipoEntrega?: 'COBRAR' | 'SOLO ENTREGAR'
  montoACobrar?: number
  
  // Fechas
  fecha?: string
  
  // Observaciones
  observaciones?: string
}

// Tipo de datos para la vista previa (extiende FormData con extras de UI)
export interface LabelData extends FormData {
  id?: string
  pdfUrl?: string
}

export type TipoEtiqueta = '10x10' | '10x15' | 'A4'
export type TabType = 'single' | 'multiple'
export type StepType = 1 | 2 | 3

// Tipo para resultados de parseo de chat
export interface ChatParseResult {
  data: Partial<FormData>
  confidence?: number
  missing?: string[]
}

// Estado de generación de PDF
export interface PDFGenerationState {
  isGenerating: boolean
  pdfUrl: string | null
  error: string | null
  progress?: number
}