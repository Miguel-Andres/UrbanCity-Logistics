/**
 * Template HTML minimalista para generar PDFs de etiquetas
 */
import { PDFData } from '../types'
import QRCode from 'qrcode'

const MEDIDAS_ETIQUETAS = {
  '10x10': { width: 283.44, height: 283.44 },
  '10x15': { width: 283.44, height: 425.23 },
  'A4': { width: 595.28, height: 841.89 }
}

const CSS_STYLES = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Courier New', monospace;
    line-height: 1.2;
    color: #000;
    background: white;
    font-size: 9px;
  }
  
  .etiqueta {
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid #000;
    display: flex;
    flex-direction: column;
  }
  
  /* Header minimalista */
  .header {
    border-bottom: 2px solid #000;
    padding: 6px 8px;
    text-align: center;
  }
  
  .company-name {
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 1px;
    margin-bottom: 2px;
    text-transform: uppercase;
  }
  
  .tracking-code {
    font-weight: 800;
    font-size: 10px;
    letter-spacing: 0.5px;
  }
  
  /* Info básica - Vendedor y Fecha */
  .basic-info {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #000;
    padding: 4px 8px;
    background: #f5f5f5;
  }
  
  .info-item {
    font-size: 8px;
  }
  
  .info-label {
    font-weight: 700;
    text-transform: uppercase;
  }
  
  /* Contenido principal */
  .content {
    padding: 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .section {
    margin-bottom: 4px;
  }
  
  .section-title {
    font-weight: 700;
    font-size: 8px;
    text-transform: uppercase;
    margin-bottom: 2px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 1px;
  }
  
  .section-content {
    font-size: 8px;
    line-height: 1.3;
  }
  
  /* Información de envío y entrega - más limpia */
  .shipping-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin: 6px 0;
    padding: 6px 0;
    border-bottom: 1px solid #eee;
  }
  
  .shipping-type,
  .delivery-type {
    flex: 1;
  }
  
  .info-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 2px;
  }
  
  .info-tag {
    font-weight: 600;
    font-size: 7px;
    text-transform: uppercase;
    color: #666;
    white-space: nowrap;
  }
  
  .info-value {
    font-weight: 700;
    font-size: 8px;
    color: #000;
  }
  
  .amount {
    font-weight: 800;
    font-size: 9px;
    color: #d00;
    margin-top: 2px;
  }
  
  /* Observaciones - Espacio fijo para hasta 150 caracteres */
  .observaciones {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 4px;
    min-height: 32px; /* Espacio fijo para hasta ~4 líneas de texto */
    max-height: 48px; /* Máximo para evitar desbordamiento */
    overflow: hidden;
    margin: 4px 0;
  }
  
  .observaciones-texto {
    font-size: 7px;
    line-height: 1.4;
    word-wrap: break-word;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  
  .observaciones-vacio {
    color: #999;
    font-style: italic;
  }

  /* QR Section */
  .qr-section {
    margin-top: auto;
    text-align: center;
    padding: 6px 0;
    border-top: 1px solid #000;
  }
  
  .qr-code {
    margin-bottom: 4px;
  }
  
  .qr-text {
    font-size: 7px;
    font-weight: 700;
  }
  
  /* Footer */
  .footer {
    border-top: 2px solid #000;
    padding: 4px 8px;
    text-align: center;
    background: #f5f5f5;
  }
  
  .footer-text {
    font-size: 7px;
    font-weight: 700;
  }
  
  /* Estilos para tamaños específicos */
  /* 10x10 - Ultra compacto sin destinatario */
  .size-10x10 {
    font-size: 7px;
  }
  
  .size-10x10 .header {
    padding: 3px 4px;
  }
  
  .size-10x10 .company-name {
    font-size: 9px;
    margin-bottom: 1px;
  }
  
  .size-10x10 .tracking-code {
    font-size: 7px;
  }
  
  .size-10x10 .basic-info {
    padding: 2px 4px;
  }
  
  .size-10x10 .content {
    padding: 4px;
    gap: 2px;
  }
  
  .size-10x10 .section-title,
  .size-10x10 .section-content,
  .size-10x10 .info-item {
    font-size: 7px;
  }
  
  .size-10x10 .info-tag {
    font-size: 5px;
  }
  
  .size-10x10 .info-value {
    font-size: 7px;
  }
  
  .size-10x10 .shipping-info {
    flex-direction: column;
    gap: 2px;
    margin: 3px 0;
    padding: 3px 0;
  }
  
  .size-10x10 .observaciones {
    min-height: 20px;
    max-height: 30px;
    padding: 2px;
    margin: 2px 0;
  }
  
  .size-10x10 .observaciones-texto {
    font-size: 6px;
    -webkit-line-clamp: 3;
  }
  
  .size-10x10 .qr-section {
    padding: 3px 0;
  }
  
  .size-10x10 .footer {
    padding: 2px 4px;
  }
  
  .size-10x10 .footer-text {
    font-size: 5px;
  }
  
    
  /* A4 - Más espaciado */
  .size-a4 {
    font-size: 11px;
    border: 2px solid #000;
  }
  
  .size-a4 .header {
    padding: 12px 16px;
  }
  
  .size-a4 .company-name {
    font-size: 16px;
  }
  
  .size-a4 .tracking-code {
    font-size: 14px;
  }
  
  .size-a4 .basic-info {
    padding: 8px 16px;
  }
  
  .size-a4 .content {
    padding: 16px;
    gap: 12px;
  }
  
  .size-a4 .section-title,
  .size-a4 .section-content,
  .size-a4 .info-item {
    font-size: 12px;
  }
  
  .size-a4 .shipping-info {
    gap: 12px;
    margin: 8px 0;
    padding: 8px 0;
  }
  
  .size-a4 .info-tag {
    font-size: 10px;
  }
  
  .size-a4 .info-value {
    font-size: 12px;
  }
  
  .size-a4 .amount {
    font-size: 14px;
  }
  
  .size-a4 .qr-section {
    padding: 12px 0;
  }
  
  .size-a4 .footer {
    padding: 8px 16px;
  }
  
  .size-a4 .footer-text {
    font-size: 10px;
  }
  
  .size-a4 .observaciones {
    min-height: 48px;
    max-height: 72px;
    padding: 8px;
  }
  
  .size-a4 .observaciones-texto {
    font-size: 10px;
    -webkit-line-clamp: 5;
  }

  /* Estilos para impresión */
  @media print {
    body {
      background: white !important;
    }
    
    .etiqueta {
      border: 1px solid #000 !important;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
  }
`

export async function generarHTMLTemplate(datos: PDFData): Promise<string> {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  const codigoSeguimiento = `UC-${timestamp}-${random}`
  
  const tipoEtiqueta = datos.tipoEtiqueta as keyof typeof MEDIDAS_ETIQUETAS
  const medidas = MEDIDAS_ETIQUETAS[tipoEtiqueta] || MEDIDAS_ETIQUETAS['10x15']
  
  const fechaFormateada = datos.fecha 
    ? new Date(datos.fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'No especificada'
  
  // Determinar clase de tamaño
  const sizeClass = tipoEtiqueta === '10x10' ? 'size-10x10' : 
                   tipoEtiqueta === 'A4' ? 'size-a4' : ''
  
  let qrCodeDataUrl = ''
  try {
    const qrSize = tipoEtiqueta === '10x10' ? 60 : 
                  tipoEtiqueta === 'A4' ? 120 : 80
                  
    qrCodeDataUrl = await QRCode.toDataURL(codigoSeguimiento, {
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
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Etiqueta Urban City Logistics</title>
        <style>${CSS_STYLES}</style>
      </head>
      <body>
        <div class="etiqueta ${sizeClass}" style="width: ${medidas.width}px; height: ${medidas.height}px;">
          <!-- Header Minimalista -->
          <header class="header">
            <div class="company-name">URBAN CITY LOGISTICS</div>
            <div class="tracking-code">${codigoSeguimiento}</div>
          </header>
          
          <!-- Información Básica - Vendedor y Fecha -->
          <div class="basic-info">
            <div class="info-item">
              <span class="info-label">Vendedor:</span> ${datos.nombreVendedor || 'No especificado'}
            </div>
            <div class="info-item">
              <span class="info-label">Fecha:</span> ${fechaFormateada}
            </div>
          </div>
          
          <!-- Contenido Principal -->
          <main class="content">
            <!-- Datos del Destinatario -->
            <div class="section destinatario-section">
              <div class="section-content">
                <div><strong>${datos.nombreDestinatario || 'No especificado'}</strong></div>
                <div>📱 ${datos.telefonoDestinatario || 'No especificado'}</div>
                ${datos.direccion ? `<div>🏠 ${datos.direccion}</div>` : ''}
                <div>📍 ${datos.localidadDestinatario || datos.localidad || 'No especificado'}</div>
                ${datos.entreCalles ? `<div>🗺️ Entre: ${datos.entreCalles}</div>` : ''}
              </div>
            </div>
            
            <!-- Tipo de Envío y Entrega -->
            <div class="shipping-info">
              <div class="shipping-type">
                <div class="info-row">
                  <span class="info-tag">Envío:</span>
                  <span class="info-value">${datos.tipoEnvio || 'NO ESP.'}</span>
                </div>
              </div>
              <div class="delivery-type">
                <div class="info-row">
                  <span class="info-tag">Pago:</span>
                  <span class="info-value">${datos.tipoEntrega}</span>
                </div>
                ${datos.tipoEntrega === 'COBRAR' && datos.montoACobrar ? 
                  `<div class="amount">$${new Intl.NumberFormat('es-AR').format(Number(datos.montoACobrar))}</div>` : ''
                }
              </div>
            </div>
            
            <!-- Observaciones - Espacio fijo para hasta 150 caracteres -->
            <div class="section">
              <div class="section-title">Observaciones</div>
              <div class="observaciones">
                <div class="observaciones-texto">
                  ${datos.observaciones && datos.observaciones.trim() ? 
                    datos.observaciones.length > 150 ? datos.observaciones.substring(0, 150) + '...' : datos.observaciones :
                    '<span class="observaciones-vacio">Sin observaciones</span>'
                  }
                </div>
              </div>
            </div>
            
            <!-- QR Code -->
            <div class="qr-section">
              <div class="qr-code">
                ${qrCodeDataUrl ? 
                  `<img src="${qrCodeDataUrl}" alt="QR Code" style="width: ${tipoEtiqueta === '10x10' ? '60px' : tipoEtiqueta === 'A4' ? '120px' : '80px'}; height: ${tipoEtiqueta === '10x10' ? '60px' : tipoEtiqueta === 'A4' ? '120px' : '80px'};" />` :
                  `<div style="background: #f0f0f0; padding: 8px; display: inline-block;">
                    <div style="font-size: 6px; font-weight: 700;">QR NO DISPONIBLE</div>
                  </div>`
                }
              </div>
              <div class="qr-text">${codigoSeguimiento}</div>
            </div>
          </main>
          
          </div>
      </body>
    </html>
  `
}

export function getPDFMedidas(tipoEtiqueta: string = '10x15') {
  return MEDIDAS_ETIQUETAS[tipoEtiqueta as keyof typeof MEDIDAS_ETIQUETAS] || MEDIDAS_ETIQUETAS['10x15']
}