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


export interface GeneratedPDFResponse {
  success: boolean
  pdf?: Buffer
  error?: string
  filename?: string
}