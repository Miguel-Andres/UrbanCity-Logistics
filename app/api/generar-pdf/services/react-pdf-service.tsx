/**
 * Servicio para generar PDFs usando @react-pdf/renderer
 * Funciona perfecto en Vercel sin binarios pesados
 */
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'
import { PDFData, GeneratedPDFResponse } from '../types'
import * as QRCode from 'qrcode'

// React-PDF incluye fuentes por defecto, no necesitamos registrar fuentes externas

const MEDIDAS_ETIQUETAS = {
  '10x10': { width: 283.44, height: 283.44 },
  '10x15': { width: 283.44, height: 425.23 },
  'A4': { width: 595.28, height: 841.89 }
}

// Estilos equivalentes al CSS original
const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    fontFamily: 'Helvetica',
  },
  etiqueta: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Header
  header: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    paddingVertical: 6,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  companyName: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  trackingCode: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  
  // Basic info
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
  },
  infoItem: {
    fontSize: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  
  // Content
  content: {
    padding: 8,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 8,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
    paddingBottom: 1,
  },
  sectionContent: {
    fontSize: 8,
    lineHeight: 1.3,
  },
  
  // Shipping info
  shippingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 6,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
  },
  shippingType: {
    flex: 1,
  },
  deliveryType: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  infoTag: {
    fontWeight: 'bold',
    fontSize: 7,
    color: '#666',
    marginRight: 4,
  },
  infoValue: {
    fontWeight: 'bold',
    fontSize: 8,
    color: 'black',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#d00',
    marginTop: 2,
  },
  
  // Observaciones
  observaciones: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderRadius: 2,
    padding: 4,
    minHeight: 32,
    marginVertical: 4,
  },
  observacionesTexto: {
    fontSize: 7,
    lineHeight: 1.4,
  },
  observacionesVacio: {
    color: '#999',
    fontStyle: 'italic',
  },
  
  // QR Section
  qrSection: {
    textAlign: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'black',
    borderTopStyle: 'solid',
    marginTop: 'auto',
  },
  qrCode: {
    marginBottom: 4,
    alignSelf: 'center',
  },
  qrText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
})

// Componente principal del PDF
const EtiquetaPDF = ({ datos, qrCodeDataUrl, sizeClass }: {
  datos: PDFData & { tracking_code?: string }
  qrCodeDataUrl: string
  sizeClass: string
}) => {
  const tipoEtiqueta = datos.tipoEtiqueta as keyof typeof MEDIDAS_ETIQUETAS
  const medidas = MEDIDAS_ETIQUETAS[tipoEtiqueta] || MEDIDAS_ETIQUETAS['10x15']
  
  const codigoSeguimiento = datos.tracking_code || `UC-${Date.now()}`
  const storeName = datos.store_name || 'Mi Tienda'
  
  const fechaFormateada = datos.fecha 
    ? new Date(datos.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'No especificada'

  const isSize10x10 = sizeClass === 'size-10x10'
  const isSizeA4 = sizeClass === 'size-a4'
  
  const pageSize: [number, number] = [medidas.width, medidas.height]
  
  return (
    <Page 
      style={styles.page} 
      size={pageSize} 
      wrap={false}
    >
      <View style={styles.etiqueta}>
        <View style={styles.header}>
          <Text style={styles.companyName}>
            URBAN CITY LOGISTICS
          </Text>
          <Text style={styles.trackingCode}>
            {codigoSeguimiento}
          </Text>
        </View>

        <View style={styles.basicInfo}>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vendedor: </Text>
            {storeName}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fecha: </Text>
            {fechaFormateada}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionContent}>
              <Text>Nombre: {datos.nombre || 'No especificado'}</Text>
              <Text>Telefono: {datos.telefono || 'No especificado'}</Text>
              {datos.direccion && <Text>Direccion: {datos.direccion}</Text>}
              <Text>Localidad: {datos.localidad || 'No especificado'}</Text>
              {datos.entreCalles && <Text>Entre calles: {datos.entreCalles}</Text>}
            </View>
          </View>

          <View style={styles.shippingInfo}>
            <View style={styles.shippingType}>
              <View style={styles.infoRow}>
                <Text style={styles.infoTag}>Envio:</Text>
                <Text style={styles.infoValue}>
                  {datos.tipoEnvio || 'NO ESP.'}
                </Text>
              </View>
            </View>
            <View style={styles.deliveryType}>
              <View style={styles.infoRow}>
                <Text style={styles.infoTag}>Pago:</Text>
                <Text style={styles.infoValue}>
                  {datos.tipoEntrega}
                </Text>
              </View>
              {datos.tipoEntrega === 'COBRAR' && datos.montoACobrar && (
                <Text style={styles.amount}>
                  ${new Intl.NumberFormat('es-AR').format(Number(datos.montoACobrar))}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <View style={styles.observaciones}>
              <Text style={styles.observacionesTexto}>
                {datos.observaciones && datos.observaciones.trim() ? 
                  (datos.observaciones.length > 150 ? 
                    datos.observaciones.substring(0, 150) + '...' : 
                    datos.observaciones
                  ) :
                  'Sin observaciones'
                }
              </Text>
            </View>
          </View>

          <View style={styles.qrSection}>
            <View style={styles.qrCode}>
              {qrCodeDataUrl ? (
                <Image 
                  src={qrCodeDataUrl} 
                  style={{
                    width: isSize10x10 ? 60 : isSizeA4 ? 120 : 80,
                    height: isSize10x10 ? 60 : isSizeA4 ? 120 : 80,
                  }}
                />
              ) : (
                <View style={{
                  backgroundColor: '#f0f0f0',
                  padding: 8,
                  width: isSize10x10 ? 60 : isSizeA4 ? 120 : 80,
                  height: isSize10x10 ? 60 : isSizeA4 ? 120 : 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 6, fontWeight: 'bold' }}>QR NO DISPONIBLE</Text>
                </View>
              )}
            </View>
            <Text style={styles.qrText}>{codigoSeguimiento}</Text>
          </View>
        </View>
      </View>
    </Page>
  )
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
        const qrSize = tipoEtiqueta === '10x10' ? 60 : 
                      tipoEtiqueta === 'A4' ? 120 : 80
        
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3000' 
          : process.env.NEXT_PUBLIC_SITE_URL
        const qrUrl = `${baseUrl}/delivery/${data.tracking_code || 'DEFAULT'}`
        
        console.log('React-PDF QR - URL generada:', qrUrl)
        
        qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
          width: qrSize,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      } catch (error) {
        console.error('Error generando QR:', error)
      }

      // Crear documento PDF
      const documento = (
        <Document>
          <EtiquetaPDF 
            datos={data}
            qrCodeDataUrl={qrCodeDataUrl}
            sizeClass={sizeClass}
          />
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
