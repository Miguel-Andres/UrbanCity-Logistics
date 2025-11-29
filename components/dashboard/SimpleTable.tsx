'use client'
import { useState } from 'react'

interface Shipment {
  id: string
  tracking_code: string
  recipient_name: string
  recipient_phone?: string
  recipient_address: string
  recipient_city?: string
  status: string
  payment_type?: string
  amount_to_charge?: number
  created_at: string
  delivered_at?: string
}

interface SimpleTableProps {
  shipments: Shipment[]
  showActions?: boolean
}

export default function SimpleTable({ shipments, showActions = true }: SimpleTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyTrackingLink = (trackingCode: string, id: string) => {
    const link = `${window.location.origin}/tracking/${trackingCode}`
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    })
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Código
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Destinatario
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                Estado
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                Fecha
              </th>
              {showActions && (
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-50">
                  <div className="sm:hidden">
                    <div className="font-medium">{shipment.tracking_code}</div>
                    <div className="text-xs text-slate-400">
                      {formatDate(shipment.created_at)}
                    </div>
                  </div>
                  <span className="hidden sm:inline">{shipment.tracking_code}</span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-slate-50">
                  <div>
                    <div className="font-medium">{shipment.recipient_name}</div>
                    {shipment.recipient_city && (
                      <div className="text-xs sm:text-sm text-slate-400">{shipment.recipient_city}</div>
                    )}
                    <div className="sm:hidden mt-1">
                      <StatusBadge status={shipment.status} />
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                  <StatusBadge status={shipment.status} />
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-400 hidden lg:table-cell">
                  {formatDate(shipment.created_at)}
                </td>
                {showActions && (
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => copyTrackingLink(shipment.tracking_code, shipment.id)}
                        className="text-slate-400 hover:text-orange-400 transition-colors text-xs sm:text-sm"
                      >
                        {copiedId === shipment.id ? '✓ Copiado' : 'Copiar'}
                      </button>
                      <a
                        href={`/tracking/${shipment.tracking_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-orange-400 transition-colors text-xs sm:text-sm"
                      >
                        Ver
                      </a>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shipments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-slate-50">No hay envíos</h3>
          <p className="mt-1 text-sm text-slate-400">
            Comienza generando tu primera etiqueta
          </p>
          <div className="mt-6">
            <a
              href="/etiquetas"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Nueva Etiqueta
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// Importar StatusBadge
import StatusBadge from './StatusBadge'