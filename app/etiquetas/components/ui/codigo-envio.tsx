'use client'

import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'

export default function SimpleHeader() {
  const [codigoEnvio, setCodigoEnvio] = useState('')

  useEffect(() => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    setCodigoEnvio(`UC-${timestamp}-${random}`)
  }, [])

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Urban City Logistics</h1>
              <p className="text-sm text-gray-600">Generador de Etiquetas</p>
            </div>
          </div>
          {codigoEnvio && (
            <div className="text-sm">
              <span className="text-gray-500">Código: </span>
              <span className="font-mono font-semibold text-orange-600">{codigoEnvio}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}