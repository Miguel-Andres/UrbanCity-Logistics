# Documentación: Generación de PDF - Arquitectura y Flujo Completo

## 📋 Overview

Este documento describe en detalle la arquitectura y flujo de generación de PDFs en "La Cuentita", desde el HTML hasta la API de Puppeteer.

## 🏗️ Arquitectura General

### Capa de Presentación (UI Components)
- **PDFPreview.tsx**: Vista previa y configuración del PDF
- **usePDFGeneration.ts**: Hook de React para manejar la generación

### Capa de API (Next.js API Routes)
- **/api/generate-pdf/route.ts**: Endpoint principal que delega al handler
- **handlers.ts**: Manejador de la solicitud HTTP

### Capa de Servicios (Business Logic)
- **PdfGenerationService.ts**: Servicio principal con Puppeteer
- **newPdfTemplate.ts**: Generador de HTML dinámico

### Capa de Tipos (TypeScript)
- **types/index.ts**: Definiciones de tipos para la exportación

## 🔄 Flujo Completo de Generación

### 1. Inicio del Flujo (Capa UI)

```typescript
// Componente PDFPreview.tsx
const { generatePDF, isGeneratingPDF } = usePDFGeneration();

// Acción del usuario
await generatePDF(consolidatedData, customClientName, nombreLogistica);
```

**Responsabilidades:**
- Recolectar datos consolidados del OCR
- Capturar nombre personalizado del cliente
- Manejar estado de carga (isGeneratingPDF)
- Descargar el PDF generado

### 2. Hook de Generación (usePDFGeneration.ts)

```typescript
// Preparación de datos
const requestData = {
  packages: consolidatedData,
  customClientName: customClientName,
  nombreLogistica: nombreLogistica
};

// Llamada a API
const response = await fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestData)
});
```

**Responsabilidades:**
- Formatear datos para la API
- Realizar llamada HTTP al endpoint
- Manejar errores y respuestas
- Crear blob y descargar archivo
- Generar nombre dinámico del archivo

### 3. API Route (route.ts)

```typescript
// Delegación al handler
export { POST } from '@/features/pdf-export/api/handlers';
```

**Responsabilidades:**
- Actuar como entry point de la API
- Delegar lógica al handler específico
- Mantener estructura de Next.js App Router

### 4. Handler de Solicitud (handlers.ts)

```typescript
// Procesamiento de la solicitud
const requestData = await request.json();
const result = await PdfGenerationService.generatePdf(requestData);

// Respuesta HTTP
return new Response(Buffer.from(result.pdfBuffer!), {
  status: 200,
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="reporte-cuentita.pdf"'
  }
});
```

**Responsabilidades:**
- Parsear JSON de entrada
- Invocar al servicio de generación
- Manejar respuestas exitosas/errores
- Configurar headers HTTP adecuados
- Convertir buffer a respuesta HTTP

### 5. Servicio de Generación (PdfGenerationService.ts)

#### 5.1. Preparación de Datos

```typescript
// Detección de formato
const isNewFormat = requestData.packages && Array.isArray(requestData.packages);
const data = isNewFormat ? requestData.packages : requestData;
const customClientName = requestData.customClientName;

// Extracción de configuración de recargo
const surchargeConfig = (data as any)[0]?.surchargeConfig;
const surchargePercentage = surchargeConfig?.percentage || 0;
const surchargeReason = surchargeConfig?.reason || '';
```

#### 5.2. Generación de HTML

```typescript
// Template dinámico
const html = generateCompactReportHTML(
  data, 
  surchargePercentage, 
  surchargeReason, 
  customClientName,
  nombreLogistica
);
```

#### 5.3. Configuración de Puppeteer

```typescript
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',              // Required for server environments
    '--disable-setuid-sandbox',  // Security sandbox
    '--disable-dev-shm-usage',   // Avoid memory issues
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',             // Don't need GPU in headless
    '--window-size=1920x1080'    // Viewport size
  ],
});
```

#### 5.4. Procesamiento de Página

```typescript
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.setContent(html, {
  waitUntil: 'networkidle0',  // Esperar a que todo cargo
  timeout: 30000
});
```

#### 5.5. Generación de PDF

```typescript
const pdfBuffer = await page.pdf({
  format: 'A4',
  margin: {
    top: '10mm',
    right: '10mm',
    bottom: '10mm', 
    left: '10mm'
  },
  printBackground: true,       // Incluir estilos CSS
  preferCSSPageSize: true,
  timeout: 30000
});
```

**Responsabilidades:**
- Orquestar todo el proceso de generación
- Manejar diferentes formatos de entrada
- Configurar Puppeteer para servidor
- Generar buffer del PDF
- Manejar errores y logging

### 6. Template HTML (newPdfTemplate.ts)

#### 6.1. Estructura del Template

```typescript
// Interface de datos
interface PackageData {
  imageIndex: number;
  fileName: string;
  data: {
    remitente?: { ... };
    destinatario?: { ... };
    fecha_entrega?: string;
    calculatedPrice?: number;
    priceZone?: string;
  };
}
```

#### 6.2. Generación de HTML

```typescript
export function generateCompactReportHTML(
  packages: PackageData[],
  surchargePercentage: number,
  surchargeReason: string,
  customClientName?: string,
  nombreLogistica?: string
): string {
  // Agrupar por día
  const groupedPackages = groupPackagesByDay(packages);
  
  // Calcular totales
  const stats = calculateStats(packages, surchargePercentage);
  
  // Generar HTML dinámico
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>${CSS_STYLES}</style>
      </head>
      <body>
        ${generateHeader(customClientName, nombreLogistica, stats)}
        ${generatePackagesByDay(groupedPackages)}
        ${generateFooter(stats, surchargePercentage, surchargeReason)}
      </body>
    </html>
  `;
}
```

**Responsabilidades:**
- Generar HTML estructurado para PDF
- Agrupar datos por fecha de entrega
- Aplicar estilos CSS específicos para impresión
- Incluir headers y footers dinámicos
- Calcular totales y estadísticas

## 📁 Archivos y Responsabilidades

### src/features/pdf-export/
```
pdf-export/
├── api/
│   └── handlers.ts          # Manejo de solicitudes HTTP
├── services/
│   └── PdfGenerationService.ts  # Lógica principal de Puppeteer
└── types/
    └── index.ts             # Definiciones TypeScript
```

### Archivos Relacionados:
```
├── app/api/generate-pdf/
│   └── route.ts             # Endpoint de Next.js
├── utils/
│   └── newPdfTemplate.ts    # Generador de HTML
├── features/export/hooks/
│   └── usePDFGeneration.ts  # Hook de React
└── components/ResultViewer/
    └── tabs/
        └── PDFPreview.tsx   # Componente UI
```

## 🔧 Configuración de Puppeteer para Producción

### Argumentos Críticos:
- `--no-sandbox`: Esencial para entornos Docker/serverless
- `--disable-dev-shm-usage`: Previene errores de memoria compartida
- `--disable-gpu`: No se necesita GPU en modo headless
- `--window-size=1920x1080`: Define viewport consistente

### Configuración de PDF:
- **Formato**: A4 (estándar internacional)
- **Márgenes**: 10mm (optimizado para impresión)
- **printBackground: true**: Incluir colores y fondos CSS
- **preferCSSPageSize: true**: Respetar definiciones CSS

## 📊 Flujo de Datos

### Entrada (Componente UI):
```typescript
{
  packages: PackageData[],      // Datos del OCR
  customClientName?: string,    // Nombre personalizado
  nombreLogistica?: string      // Empresa de logística
}
```

### Salida (API):
```
HTTP Response
├── Content-Type: application/pdf
├── Content-Disposition: attachment; filename="..."
└── Body: PDF Buffer (Uint8Array)
```

## 🎯 Consideraciones de Rendimiento

### Optimizaciones Implementadas:
1. **Viewport Fijo**: 1920x1080 para consistencia
2. **Network Idle**: Espera a que todos recursos carguen
3. **Timeouts Adecuados**: 30s para loading y generación
4. **Memory Management**: `browser.close()` garantizado
5. **Background Graphics**: Habilitado para PDFs coloreados

### Manejo de Errores:
- Validación de datos de entrada
- Timeout de Puppeteer
- Captura de errores en cada capa
- Logging estructurado para debugging

## 🔐 Seguridad

### Medidas Implementadas:
1. **Sanitización de Input**: Validación en API route
2. **Sandbox Puppeteer**: Argumentos de seguridad habilitados
3. **Sin Archivos Temporales**: Todo en memoria
4. **Content-Type Validado**: Verificación de PDF output

## 📈 Métricas y Logging

### Eventos Logueados:
- Inicio de generación (cantidad de paquetes)
- Configuración aplicada (recargos, cliente)
- Tiempo de procesamiento
- Tamaño del PDF generado
- Errores con contexto completo

Este sistema permite generar PDFs consistentes y profesionales para los reportes de envíos, con soporte para personalización y recargos dinámicos.