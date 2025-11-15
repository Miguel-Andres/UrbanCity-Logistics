import puppeteer from 'puppeteer';
import { generateCompactReportHTML } from '@/utils/newPdfTemplate';
import type { PdfGenerationRequest, PdfGenerationResult } from '../types';
import { loggerContexts, logHelpers } from '@/utils/logger';

/**
 * Service for generating PDF reports
 */
export class PdfGenerationService {
  /**
   * Generate PDF from packages data
   */
  static async generatePdf(requestData: PdfGenerationRequest): Promise<PdfGenerationResult> {
    try {
      // Detectar si es el formato nuevo con packages y customClientName o el formato anterior
      const isNewFormat = requestData.packages && Array.isArray(requestData.packages);
      const data = isNewFormat ? requestData.packages : requestData;
      const customClientName = isNewFormat ? requestData.customClientName : null;
      const nombreLogistica = isNewFormat ? requestData.nombreLogistica : undefined;

      // Extraer configuración de recargo del primer paquete
      const surchargeConfig = (data as any)[0]?.surchargeConfig;
      const surchargePercentage = surchargeConfig?.percentage || 0;
      const surchargeReason = surchargeConfig?.reason || '';

      const startTime = Date.now();
      logHelpers.pdfStarted((data as any).length, customClientName || undefined);
      loggerContexts.pdf.debug({
        packageCount: (data as any).length,
        customClient: customClientName,
        logistica: nombreLogistica,
        surcharge: surchargePercentage > 0 ? `${surchargePercentage}% - ${surchargeReason}` : 'none'
      }, 'Configuración PDF');

      // Generar HTML dinámico
      loggerContexts.pdf.debug('Generando HTML');
      const html = generateCompactReportHTML(data as any, surchargePercentage, surchargeReason, customClientName || undefined, nombreLogistica);
      loggerContexts.pdf.debug({ htmlLength: html.length }, 'HTML generado');

      // Configurar Puppeteer
      loggerContexts.pdf.debug('Iniciando Puppeteer');
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
        ],
      });

      const page = await browser.newPage();

      loggerContexts.pdf.debug('Configurando página');
      await page.setViewport({ width: 1920, height: 1080 });

      loggerContexts.pdf.debug('Cargando contenido HTML');
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      loggerContexts.pdf.debug('Generando PDF buffer');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm', 
          left: '10mm'
        },
        printBackground: true,
        preferCSSPageSize: true,
        timeout: 30000
      });

      await browser.close();

      const duration = Date.now() - startTime;
      logHelpers.pdfCompleted(duration, pdfBuffer.length);

      return {
        success: true,
        pdfBuffer: pdfBuffer
      };

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logHelpers.pdfError(err);

      return {
        success: false,
        error: 'Error generando PDF',
        details: err.message
      };
    }
  }
}