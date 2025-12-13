/**
 * Componente para etiquetas A4 - Diseño limpio y profesional
 */
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { PDFData } from '../types'

const MEDIDAS_A4 = {
  width: 595.28,
  height: 841.89
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  
  // Diseño A4 mejorado - Más limpio y profesional
  etiquetaA4: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
  },
  
  // Header rediseñado - Más compacto y elegante
  headerA4: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    marginBottom: 25,
    borderRadius: 4,
  },
  
  companyNameA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: '#ffffff',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  
  trackingCodeA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#444444',
    borderTopStyle: 'solid',
  },

  // Info básica en una línea
  basicInfoA4: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 20,
  },
  
  infoItemA4: {
    fontSize: 11,
    color: '#333333',
  },
  
  infoLabelA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#666666',
  },

  // Contenedor principal
  contentA4: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },

  // Grid de dos columnas para info compacta
  gridContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },

  gridColumn: {
    flex: 1,
  },

  // Secciones más compactas
  sectionA4: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },

  sectionTitleA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    marginBottom: 14,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    borderBottomStyle: 'solid',
  },

  // Filas de campos más limpias
  fieldRowA4: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },

  fieldLabelA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#666666',
    width: 85,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  fieldValueA4: {
    fontSize: 12,
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 1.4,
  },

  // Detalles de envío en tabla compacta
  shippingTableA4: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  shippingRowA4: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
  },

  shippingRowLastA4: {
    borderBottomWidth: 0,
  },

  shippingRowHighlightA4: {
    backgroundColor: '#fff9e6',
  },

  infoTagA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#666666',
    textTransform: 'uppercase',
  },

  infoValueA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#1a1a1a',
  },

  amountA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    color: '#d97706',
  },

  // Observaciones mejoradas
  observacionesA4: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    minHeight: 70,
  },

  observacionesTextoA4: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#4b5563',
    fontStyle: 'italic',
  },

  // QR Section rediseñada - Más compacta
  qrSectionA4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 'auto',
    borderTopWidth: 2,
    borderTopColor: '#1a1a1a',
    borderTopStyle: 'solid',
    backgroundColor: '#fafafa',
  },

  qrInfoContainer: {
    flex: 1,
    paddingRight: 20,
  },

  qrCodeContainerA4: {
    alignItems: 'center',
  },

  qrCodeA4: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 4,
  },

  qrLabelA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#1a1a1a',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  qrTextA4: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: '#1a1a1a',
    marginTop: 8,
  },

  qrInstructionsA4: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.4,
  },

  // Badge para tipo de pago
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },

  paymentBadgePagado: {
    backgroundColor: '#dcfce7',
  },

  paymentBadgeCobrar: {
    backgroundColor: '#fef3c7',
  },

  paymentBadgeText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  paymentBadgeTextPagado: {
    color: '#166534',
  },

  paymentBadgeTextCobrar: {
    color: '#92400e',
  },
})

interface EtiquetaA4Props {
  datos: PDFData & { tracking_code?: string }
  qrCodeDataUrl: string
}

export function EtiquetaA4({ datos, qrCodeDataUrl }: EtiquetaA4Props) {
  const codigoSeguimiento = datos.tracking_code || `UC-${Date.now()}`
  const storeName = datos.store_name || 'Mi Tienda'
  
  const fechaFormateada = datos.fecha 
    ? new Date(datos.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'No especificada'

  const pageSize = [MEDIDAS_A4.width, MEDIDAS_A4.height] as [number, number]
  
  const isPagado = datos.tipoEntrega === 'PAGADO'
  
  return (
    <Page style={styles.page} size={pageSize} wrap={false}>
      <View style={styles.etiquetaA4}>
        {/* Header mejorado */}
        <View style={styles.headerA4}>
          <Text style={styles.companyNameA4}>URBAN CITY LOGISTICS</Text>
          <Text style={styles.trackingCodeA4}>{codigoSeguimiento}</Text>
        </View>

        {/* Info básica */}
        <View style={styles.basicInfoA4}>
          <Text style={styles.infoItemA4}>
            <Text style={styles.infoLabelA4}>VENDEDOR: </Text>
            {storeName}
          </Text>
          <Text style={styles.infoItemA4}>
            <Text style={styles.infoLabelA4}>FECHA: </Text>
            {fechaFormateada}
          </Text>
        </View>

        {/* Contenido principal */}
        <View style={styles.contentA4}>
          {/* Grid de dos columnas */}
          <View style={styles.gridContainer}>
            {/* Columna izquierda - Detalles del Envío */}
            <View style={styles.gridColumn}>
              <View style={styles.sectionA4}>
                <Text style={styles.sectionTitleA4}>Detalles del Envío</Text>
                <View style={styles.shippingTableA4}>
                  <View style={styles.shippingRowA4}>
                    <Text style={styles.infoTagA4}>Tipo de envío</Text>
                    <Text style={styles.infoValueA4}>
                      {datos.tipoEnvio || 'Estándar'}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.shippingRowA4,
                    datos.tipoEntrega === 'COBRAR' && datos.montoACobrar 
                      ? {} 
                      : styles.shippingRowLastA4
                  ]}>
                    <Text style={styles.infoTagA4}>Tipo de pago</Text>
                    <View style={[
                      styles.paymentBadge,
                      isPagado ? styles.paymentBadgePagado : styles.paymentBadgeCobrar
                    ]}>
                      <Text style={[
                        styles.paymentBadgeText,
                        isPagado ? styles.paymentBadgeTextPagado : styles.paymentBadgeTextCobrar
                      ]}>
                        {datos.tipoEntrega === 'COBRAR' ? 'COBRAR AL ENTREGAR' : 'PAGADO'}
                      </Text>
                    </View>
                  </View>

                  {datos.tipoEntrega === 'COBRAR' && datos.montoACobrar && (
                    <View style={[
                      styles.shippingRowA4,
                      styles.shippingRowLastA4,
                      styles.shippingRowHighlightA4
                    ]}>
                      <Text style={styles.infoTagA4}>Monto a cobrar</Text>
                      <Text style={styles.amountA4}>
                        ${new Intl.NumberFormat('es-AR').format(Number(datos.montoACobrar))}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Columna derecha - Destinatario */}
            <View style={styles.gridColumn}>
              <View style={styles.sectionA4}>
                <Text style={styles.sectionTitleA4}>Destinatario</Text>
                <View>
                  <View style={styles.fieldRowA4}>
                    <Text style={styles.fieldLabelA4}>Nombre</Text>
                    <Text style={styles.fieldValueA4}>
                      {datos.nombre || 'No especificado'}
                    </Text>
                  </View>
                  <View style={styles.fieldRowA4}>
                    <Text style={styles.fieldLabelA4}>Teléfono</Text>
                    <Text style={styles.fieldValueA4}>
                      {datos.telefono || 'No especificado'}
                    </Text>
                  </View>
                  <View style={styles.fieldRowA4}>
                    <Text style={styles.fieldLabelA4}>Localidad</Text>
                    <Text style={styles.fieldValueA4}>
                      {datos.localidad || 'No especificado'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Dirección completa - Ancho completo */}
          {datos.direccion && (
            <View style={styles.sectionA4}>
              <Text style={styles.sectionTitleA4}>Dirección de Entrega</Text>
              <View>
                <View style={styles.fieldRowA4}>
                  <Text style={styles.fieldLabelA4}>Dirección</Text>
                  <Text style={styles.fieldValueA4}>{datos.direccion}</Text>
                </View>
                {datos.entreCalles && (
                  <View style={styles.fieldRowA4}>
                    <Text style={styles.fieldLabelA4}>Entre calles</Text>
                    <Text style={styles.fieldValueA4}>{datos.entreCalles}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Observaciones */}
          <View style={styles.sectionA4}>
            <Text style={styles.sectionTitleA4}>Observaciones</Text>
            <View style={styles.observacionesA4}>
              <Text style={styles.observacionesTextoA4}>
                {datos.observaciones && datos.observaciones.trim() 
                  ? datos.observaciones 
                  : 'Sin observaciones especiales para este envío.'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Footer con QR - Rediseñado horizontal */}
        <View style={styles.qrSectionA4}>
          <View style={styles.qrInfoContainer}>
            <Text style={styles.qrLabelA4}>Código de Seguimiento</Text>
            <Text style={styles.qrTextA4}>{codigoSeguimiento}</Text>
            <Text style={styles.qrInstructionsA4}>
             TRANSPORTISTA :Escanee para actualizar el estado del envío
            </Text>
          </View>
          
          <View style={styles.qrCodeContainerA4}>
            <View style={styles.qrCodeA4}>
              {qrCodeDataUrl ? (
                <Image 
                  src={qrCodeDataUrl} 
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <View style={{
                  backgroundColor: '#f5f5f5',
                  padding: 15,
                  width: 100,
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  borderRadius: 4,
                }}>
                  <Text style={{ 
                    fontSize: 9, 
                    fontFamily: 'Helvetica-Bold',
                    textAlign: 'center', 
                    color: '#999999' 
                  }}>
                    QR NO{'\n'}DISPONIBLE
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Page>
  )
}