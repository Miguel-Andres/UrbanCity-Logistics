/**
 * Vista previa para etiquetas múltiples
 */
'use client'

import { FileText, QrCode, Package, MapPin, Phone } from 'lucide-react'
import { LabelData } from '@/app/etiquetas/types'

interface MultiplePreviewProps {
  labels: LabelData[]
  hasGeneratedPDFs: boolean
  pdfCount: number
}

export default function MultiplePreview({ labels, hasGeneratedPDFs, pdfCount }: MultiplePreviewProps) {
  if (labels.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-7">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          Vista Previa
        </h3>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">
            Agrega etiquetas para ver la vista previa
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-7">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
          <FileText className="w-5 h-5 text-white" />
        </div>
        Vista Previa
      </h3>

      <div className="space-y-6">
        {/* Preview of first label */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
          <div 
            className="aspect-square max-w-full mx-auto bg-white rounded-2xl shadow-xl p-5 relative overflow-hidden border border-gray-200"
            style={{ maxWidth: '320px' }}
          >
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Header */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg mr-2 flex items-center justify-center shadow-sm">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">URBAN CITY</div>
                  <div className="text-xs text-gray-500">Logistics</div>
                </div>
              </div>
              <div className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                #1
              </div>
            </div>

            {/* Content */}
            <div className="pt-16">
              <div className="text-center mb-4">
                <div className="text-lg font-bold text-gray-900 uppercase">
                  {labels[0].nombreDestinatario || 'Nombre Destinatario'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700 font-medium">
                    {labels[0].direccionDestinatario || 'Dirección'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    {labels[0].telefonoDestinatario || 'Teléfono'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    {labels[0].localidad || 'Localidad'}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-3 left-0 right-0 text-center z-10">
              <div className="text-xs font-bold text-gray-900">URBAN CITY LOGISTICS</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200/50">
          <div className="text-center">
            <p className="text-sm font-semibold text-orange-700 mb-1">Total de etiquetas</p>
            <p className="text-3xl font-bold text-orange-800">{labels.length}</p>
            {hasGeneratedPDFs && (
              <p className="text-sm text-orange-600 mt-2">
                {pdfCount} PDF{pdfCount !== 1 ? 's' : ''} listo{pdfCount !== 1 ? 's' : ''} para descargar
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}