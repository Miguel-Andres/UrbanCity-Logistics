/**
 * Exportaciones principales del módulo de etiquetas
 */

// Types
export type {
  LabelData,
  FormData,
  TipoEtiqueta,
  TabType,
  StepType,
  PDFGenerationState
} from './types'

// Constants
export {
  DEFAULT_REMITENTE,
  DEFAULT_LOCALIDAD,
  TIPO_ENVIO_OPTIONS,
  TIPO_ENTREGA_OPTIONS,
  CALIDAD_OPTIONS,
  STEP_CONFIG,
  ANIMATION_DURATION,
  extractoRegex,
  API_ENDPOINTS
} from './constants'

// Hooks
export {
  useMultipleLabels
} from './hooks'

// Components - Shared
export { default as Tabs } from './components/shared/Tabs'
export { default as ChatInput } from './components/shared/ChatInput'

// Components - Wizard
export { default as SingleLabelWizard } from './components/wizard/SingleLabelWizard'
export { default as ShippingForm } from './components/wizard/ShippingForm'
export { default as LabelPreview } from './components/wizard/LabelPreview'

// Components - Multiple
export { default as MultipleLabelWizard } from './components/multiple/MultipleLabelWizard'
export { default as LabelItem } from './components/multiple/LabelItem'
export { default as MultipleLabelsList } from './components/multiple/MultipleLabelsList'
