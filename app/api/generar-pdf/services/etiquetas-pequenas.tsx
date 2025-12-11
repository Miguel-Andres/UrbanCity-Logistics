/**
 * Componente para etiquetas pequeñas (10x10 y 10x15)
 */
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { PDFData } from '../types'

const MEDIDAS_ETIQUETAS = {
  '10x10': { width: '10cm', height: '10cm' },
  '10x15': { width: '10cm', height: '15cm' },
}

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
    padding: 30,
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

interface EtiquetaPequenaProps {
  datos: PDFData & { tracking_code?: string }
  qrCodeDataUrl: string
  sizeClass: string
}

export function EtiquetaPequena({ datos, qrCodeDataUrl, sizeClass }: EtiquetaPequenaProps) {
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
  
  return (
    <Page 
      style={styles.page} 
      size={medidas} 
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
                    width: isSize10x10 ? 60 : 80,
                    height: isSize10x10 ? 60 : 80,
                  }}
                />
              ) : (
                <View style={{
                  backgroundColor: '#f0f0f0',
                  padding: 8,
                  width: isSize10x10 ? 60 : 80,
                  height: isSize10x10 ? 60 : 80,
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