/**
 * Vista previa de la etiqueta
 */
'use client'

import { FileText, QrCode, Package } from 'lucide-react'
import { FormData } from '@/app/etiquetas/types'
import CodigoEnvio from '@/app/etiquetas/components/ui/codigo-envio'

interface LabelPreviewProps {
  formData: FormData
  onPrevStep?: () => void
  onNextStep?: () => void
  nextStepLabel?: string
  nextStepDisabled?: boolean
}

export default function LabelPreview({ 
  formData, 
  onPrevStep, 
  onNextStep, 
  nextStepLabel = "Siguiente",
  nextStepDisabled = false 
}: LabelPreviewProps) {
  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-7">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Vista Previa de la Etiqueta
        </h3>

        {/* Preview de la etiqueta */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
          <div 
            className="aspect-square max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden border border-gray-200"
            style={{
              width: '100%',
              maxWidth: formData.tipoEtiqueta === '10x15' ? '420px' : '380px'
            }}
          >
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Header */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg mr-2.5 flex items-center justify-center shadow-md">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-900">URBAN CITY</span>
                  <div className="text-xs text-gray-500 font-medium">Logistics</div>
                </div>
              </div>
              <div className="text-right">
                {formData.chat && <div className="text-xs text-orange-600 font-semibold">CHAT: {formData.chat}</div>}
              </div>
            </div>

            {/* Código de envío */}
            <div className="text-center mt-10 mb-4 z-10 relative">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg py-3">
                <div className="text-3xl font-mono font-bold text-orange-600 tracking-wider">
                  <CodigoEnvio />
                </div>
              </div>
              {formData.nroEnvio && (
                <div className="text-xs text-gray-600 mt-2 font-medium">N° ENVÍO: {formData.nroEnvio}</div>
              )}
            </div>

            {/* Cuadrícula de información */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3 text-xs z-10 relative">
              <div className="bg-white rounded-lg p-2 text-center">
                <span className="text-gray-500 font-medium">LOCALIDAD</span>
                <div className="font-bold text-gray-900 uppercase text-sm mt-0.5">{formData.localidad || '---'}</div>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <span className="text-gray-500 font-medium">TIPO</span>
                <div className="font-bold text-gray-900 uppercase text-sm mt-0.5">
                  {formData.variante ? formData.variante.replace('_', ' ').toUpperCase() : '---'}
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="my-4 border-t-2 border-dashed border-gray-300 z-10 relative"></div>

            {/* Destinatario */}
            <div className="text-xs mb-3 z-10 relative">
              <div className="text-gray-500 font-semibold mb-2">DESTINATARIO:</div>
              <div className="font-bold text-gray-900 uppercase text-base mb-2">
                {formData.nombreDestinatario || 'Nombre del destinatario'}
              </div>
              <div className="space-y-1">
                <div className="text-gray-700 font-medium">
                  📍 DIRECCIÓN: {formData.direccionDestinatario || 'Dirección del destinatario'}
                </div>
                <div className="text-gray-600 font-medium">
                  📞 TELÉFONO: {formData.telefonoDestinatario || 'Teléfono'}
                </div>
                {formData.observaciones && (
                  <div className="text-gray-600">
                    🔄 ENTRE: {formData.observaciones}
                  </div>
                )}
                {formData.cpDestinatario && (
                  <div className="text-gray-600">
                    📌 REF: {formData.cpDestinatario}
                  </div>
                )}
              </div>
            </div>

            {/* Código QR */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                <QrCode className="w-14 h-14 text-gray-400" />
              </div>
            </div>

            {/* Pie URBAN CITY */}
            <div className="absolute bottom-3 left-0 right-0 text-center z-10">
              <div className="text-xs font-bold text-gray-900">URBAN CITY LOGISTICS</div>
              <div className="text-xs text-gray-500">www.urbancitylogistics.cl</div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        {(onPrevStep || onNextStep) && (
          <div className="flex space-x-4">
            {onPrevStep && (
              <button
                onClick={onPrevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Anterior</span>
              </button>
            )}
            {onNextStep && (
              <button
                onClick={onNextStep}
                disabled={nextStepDisabled}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                <span>{nextStepLabel}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

import { ArrowLeft, ArrowRight } from 'lucide-react'