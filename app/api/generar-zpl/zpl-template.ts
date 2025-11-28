/**
 * Template ZPL adaptado del diseño original con datos dinámicos
 */
import { FormData } from '@/app/etiquetas/types'

/**
 * Genera código ZPL basado en tu diseño original pero con datos dinámicos del formulario
 */
export function generarZPLEstandar(datos: FormData): string {
  // Usar tracking_code si existe, si no generar uno temporal (fallback)
  const codigoSeguimiento = datos.tracking_code || (() => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `UC-${timestamp}-${random}`
  })()
  
  // Usar store_name si existe, si no usar valor por defecto
  const storeName = datos.store_name || 'Mi Tienda'
  
  // Formatear fecha como en tu ejemplo: 3/10/2025
  const fechaFormateada = datos.fecha 
    ? new Date(datos.fecha).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })
  
  // Formatear monto para mostrar solo el número (sin formato argentino para ZPL)
  const montoNumero = datos.tipoEntrega === 'COBRAR' && datos.montoACobrar 
    ? datos.montoACobrar.toString().replace(/[.,]/g, '') // Quitar puntos y comas para el QR
    : ''
  
  // Usar tipoEnvio como producto
  const producto = datos.tipoEnvio || 'NO ESP'
  
  let zpl = `^XA
^LH0,240
^CF0,30
^PW800
^LL1520
^FO50,200^CF0,60^FDURBAN CITY LOGISTICS^FS
^FO50,260^GB700,3,3^FS
^FO50,280^CF0,35^FD${storeName}^FS
^FO400,280^CF0,30^FDFecha: ${fechaFormateada}^FS
^FO50,320^GB700,1,1^FS
^FO50,340^CF0,30^FDNombre:^FS
^FO200,340^CF0,30^FD${datos.nombre}^FS
^FO50,375^CF0,30^FDTelefono:^FS
^FO200,375^CF0,30^FD${datos.telefono}^FS
^FO50,405^CF0,30^FDDireccion:^FS
^FO200,405^CF0,30^FD${datos.direccion}^FS
^FO50,435^CF0,30^FDLocalidad:^FS
^FO200,435^CF0,30^FD${datos.localidad}^FS`
  
  // Agregar entre calles si existe
  if (datos.entreCalles) {
    zpl += `\n^FO50,470^CF0,30^FDEntrecalles:^FS
^FO200,470^CF0,30^FD${datos.entreCalles}^FS`
  }
  
  zpl += `\n^FO50,520^CF0,30^FDTIPO:^FS
^FO250,520^CF0,40^FD${datos.tipoEnvio}^FS`
  
  // Agregar sección de COBRAR o SOLO ENTREGAR
  if (datos.tipoEntrega === 'COBRAR' && montoNumero) {
    const montoFormateado = datos.montoACobrar ? 
      `$${new Intl.NumberFormat('es-AR').format(Number(datos.montoACobrar))}` : ''
    zpl += `\n^FO50,570^CF0,40^FDCOBRAR:^FS
^FO250,570^CF0,40^FD${montoFormateado}^FS`
  } else if (datos.tipoEntrega === 'SOLO ENTREGAR') {
    zpl += `\n^FO250,570^CF0,40^FDSOLO ENTREGAR^FS`
  }
  
  // Agregar observaciones si existen
  if (datos.observaciones) {
    const obsTruncadas = datos.observaciones.length > 150 
      ? datos.observaciones.substring(0, 150) + '...' 
      : datos.observaciones
    zpl += `\n^FO50,620^CF0,20^FB700,3,0,L^FDOBSERVACIONES: ${obsTruncadas}^FS`
  }
  
  // Generar QR para actualizar estado (/delivery/[tracking_code])
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.NEXT_PUBLIC_SITE_URL
  const qrUrl = `${baseUrl}/delivery/${codigoSeguimiento}`
  
  zpl += `\n^FO250,740^BQN,2,8^FDMA,${qrUrl}^FS
^FO300,1100^CF0,30^FD${codigoSeguimiento}^FS
^XZ`
  
  return zpl
}

/**
 * Función principal - genera ZPL estándar
 */
export function generarTemplateZPL(datos: FormData): string {
  return generarZPLEstandar(datos)
}