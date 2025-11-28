/**
 * Tipos para la generación de PDFs
 */

export interface PDFData {
  nombre: string
  telefono: string
  localidad?: string
  entreCalles?: string
  direccion?: string
  fecha?: string
  tipoEnvio?: string
  tipoEntrega?: string
  montoACobrar?: number
  observaciones?: string
  tipoEtiqueta?: string
  tracking_code?: string  // Agregado para incluir en el PDF
  store_name?: string      // Nombre de la tienda del vendedor
}

export interface PDFOptions {
  width: number
  height: number
  format?: string
  margin?: {
    top: string
    bottom: string
    left: string
    right: string
  }
}

export interface BrowserOptions {
  headless: 'new' | boolean
  args: string[]
}

export interface PDFConfig {
  browser: BrowserOptions
  pdf: PDFOptions
}

export interface GeneratedPDFResponse {
  success: boolean
  pdf?: Buffer
  error?: string
  filename?: string
}