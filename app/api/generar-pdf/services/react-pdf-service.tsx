/**
 * Servicio para generar PDFs usando @react-pdf/renderer
 * Funciona perfecto en Vercel sin binarios pesados
 */
import { Document, pdf } from '@react-pdf/renderer'
import { PDFData, GeneratedPDFResponse } from '../types'
import { EtiquetaPequena } from './etiquetas-pequenas'
import { EtiquetaA4 } from './etiqueta-a4'
import * as QRCode from 'qrcode'

const MEDIDAS_ETIQUETAS = {
  '10x10': { width: '10cm', height: '10cm' },
  '10x15': { width: '10cm', height: '15cm' },
  'A4': { width: 595.28, height: 841.89 }
}

class ReactPDFService {
  async generarPDF(data: PDFData & { tracking_code?: string }): Promise<GeneratedPDFResponse> {
    try {
      console.log(`Generando PDF con React-PDF para: ${data.nombre || 'Desconocido'}`)
      
      const tipoEtiqueta = data.tipoEtiqueta as keyof typeof MEDIDAS_ETIQUETAS
      
      // Determinar clase de tamaño
      const sizeClass = tipoEtiqueta === '10x10' ? 'size-10x10' : 
                       tipoEtiqueta === 'A4' ? 'size-a4' : ''
      
      // Generar QR Code
      let qrCodeDataUrl = ''
      try {
        const qrSize = tipoEtiqueta === '10x10' ? 250 : 
                      tipoEtiqueta === 'A4' ? 120 : 80
        
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3000' 
          : process.env.NEXT_PUBLIC_SITE_URL
        const qrUrl = `${baseUrl}/delivery/${data.tracking_code || 'DEFAULT'}`
        
        console.log('React-PDF QR - URL generada:', qrUrl)
        
        qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
          width: qrSize,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      } catch (error) {
        console.error('Error generando QR:', error)
      }

      // Crear documento PDF con el componente apropiado
      const documento = (
        <Document>
          {tipoEtiqueta === 'A4' ? (
            <EtiquetaA4 
              datos={data}
              qrCodeDataUrl={qrCodeDataUrl}
            />
          ) : (
            <EtiquetaPequena 
              datos={data}
              qrCodeDataUrl={qrCodeDataUrl}
              sizeClass={sizeClass}
            />
          )}
        </Document>
      )

      // Generar buffer
      console.log('Generando PDF buffer con React-PDF...')
      const pdfBlob = await pdf(documento).toBlob()
      const arrayBuffer = await pdfBlob.arrayBuffer()
      const pdfBuffer = Buffer.from(arrayBuffer)
      console.log('PDF generado exitosamente con React-PDF')

      // Generar nombre de archivo
      const nombreArchivo = `${data.nombre?.substring(0, 11).replace(/\s+/g, '') || 'envio'}-${data.tracking_code || 'SINTRACK'}.pdf`

      return {
        success: true,
        pdf: pdfBuffer,
        filename: nombreArchivo
      }

    } catch (error) {
      console.error('Error en ReactPDFService:', error)
      console.error('Datos que causaron el error:', JSON.stringify(data, null, 2))
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido generando PDF'
      }
    }
  }
}

// Exportar instancia singleton
export const reactPDFService = new ReactPDFService()