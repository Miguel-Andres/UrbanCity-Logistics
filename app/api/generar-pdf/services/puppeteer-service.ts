/**
 * Servicio para generar PDFs usando Puppeteer
 */
import puppeteer, { Browser, Page } from 'puppeteer'
import { PDFData, PDFConfig, GeneratedPDFResponse } from '../types'
import { generarHTMLTemplate, getPDFMedidas } from '../utils/pdf-template'

class PuppeteerService {
  private browser: Browser | null = null

  /**
   * Inicializa el navegador Puppeteer
   */
  private async initializeBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser
    }

    // Configuración simple basada en La Cuentita
    const browserOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    }

    console.log('Iniciando Puppeteer con configuración La Cuentita...')
    this.browser = await puppeteer.launch(browserOptions)
    console.log('Puppeteer iniciado exitosamente')
    return this.browser
  }

  /**
   * Genera un PDF a partir de los datos proporcionados
   */
  async generarPDF(data: PDFData): Promise<GeneratedPDFResponse> {
    try {
      console.log(`Generando PDF para: ${data.nombre || 'Desconocido'}`)
      
      // Inicializar el navegador
      const browser = await this.initializeBrowser()
      const page = await browser.newPage()

      // Configurar la página para mejor rendimiento
      await page.setViewport({ width: 1920, height: 1080 })

      // Generar el HTML del template
      const html = await generarHTMLTemplate(data)
      
      // Cargar el HTML como en el proyecto anterior
      console.log('Cargando HTML en Puppeteer...')
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000
      })

      // Obtener las medidas para el PDF
      const medidas = getPDFMedidas(data.tipoEtiqueta)

      // Generar el PDF
      console.log('Generando PDF buffer...')
      const pdfBuffer = await page.pdf({
        width: medidas.width,
        height: medidas.height,
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '0px',
          bottom: '0px',
          left: '0px',
          right: '0px'
        },
        scale: 1,
        displayHeaderFooter: false,
        headerTemplate: '',
        footerTemplate: '',
        timeout: 30000
      })

      // Cerrar la página (no el navegador para reutilizarlo)
      await page.close()
      console.log('PDF generado exitosamente')

      // Generar nombre de archivo
      const nombreArchivo = `${data.nombre?.substring(0, 11).replace(/\s+/g, '') || 'envio'}.pdf`

      return {
        success: true,
        pdf: Buffer.from(pdfBuffer),
        filename: nombreArchivo
      }

    } catch (error) {
      console.error('Error en PuppeteerService:', error)
      console.error('Datos que causaron el error:', JSON.stringify(data, null, 2))
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Cierra el navegador Puppeteer
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  /**
   * Recicla el navegador si está inactivo
   */
  async recycleBrowser(): Promise<void> {
    if (this.browser) {
      const pages = await this.browser.pages()
      // Solo cerrar si no hay páginas activas
      if (pages.length === 0) {
        await this.closeBrowser()
      }
    }
  }
}

// Exportar una instancia singleton
export const puppeteerService = new PuppeteerService()

// Manejar el cierre del proceso para limpiar recursos
process.on('SIGINT', async () => {
  await puppeteerService.closeBrowser()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await puppeteerService.closeBrowser()
  process.exit(0)
})