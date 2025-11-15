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
  ChatParseResult,
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
  useLabelForm,
  useChatExtraction,
  usePDFGeneration,
  useMultipleLabels
} from './hooks'

// Components - Shared
export { default as Tabs } from './components/shared/Tabs'

// Components - Wizard
export { default as SingleLabelWizard } from './components/wizard/SingleLabelWizard'
export { default as ChatInput } from './components/wizard/ChatInput'
export { default as LabelSizeSelector } from './components/wizard/LabelSizeSelector'
export { default as ShippingForm } from './components/wizard/ShippingForm'
export { default as LabelPreview } from './components/wizard/LabelPreview'
export { default as PDFGenerationStatus } from './components/wizard/PDFGenerationStatus'

// Components - Multiple
export { default as MultipleLabelWizard } from './components/multiple/MultipleLabelWizard'
export { default as MultipleChatInput } from './components/multiple/MultipleChatInput'
export { default as LabelItem } from './components/multiple/LabelItem'
export { default as MultipleLabelsList } from './components/multiple/MultipleLabelsList'
export { default as MultiplePreview } from './components/multiple/MultiplePreview'

// Components - UI
export { default as CodigoEnvio } from './components/ui/codigo-envio'