// Medidas de etiquetas en puntos (pt) para impresión PDF
// 1 cm = 28.35 puntos
// 1 pulgada = 72 puntos

export const MEDIDAS_ETIQUETAS = {
  '10x10': {
    width: 283.44, // 10 cm = 283.44 puntos
    height: 283.44, // 10 cm = 283.44 puntos
    nombre: '10 x 10 cm',
    descripcion: 'Etiqueta cuadrada estándar'
  },
  '10x15': {
    width: 283.44, // 10 cm = 283.44 puntos
    height: 425.23, // 15 cm = 425.23 puntos
    nombre: '10 x 15 cm',
    descripcion: 'Etiqueta rectangular estándar'
  },
  'A4': {
    format: 'A4',
    width: 595.28, // A4 width en puntos
    height: 841.89, // A4 height en puntos
    nombre: 'A4',
    descripcion: 'Hoja completa A4'
  }
} as const

export type TipoEtiqueta = keyof typeof MEDIDAS_ETIQUETAS