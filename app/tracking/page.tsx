'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingCode.trim()) {
      setError('Por favor, ingresa un código de seguimiento')
      return
    }

    setIsSearching(true)
    setError('')
    
    try {
      // Normalizar el código y redirigir
      const normalizedCode = trackingCode.trim().toUpperCase()
      router.push(`/tracking/${normalizedCode}`)
    } catch (err) {
      setError('Error al buscar el envío')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver</span>
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                URBAN CITY LOGISTICS
              </h1>
              <p className="text-gray-600">Seguimiento de Envíos</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer para centrar el logo */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Search Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                ¿Dónde está tu paquete?
              </h2>
              <p className="text-orange-100 text-lg">
                Ingresa el código de seguimiento para rastrear tu envío
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => {
                    setTrackingCode(e.target.value)
                    setError('')
                  }}
                  placeholder="Ej: UC-ABC123"
                  className="w-full px-6 py-4 pr-14 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-white focus:outline-none text-lg shadow-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-6 h-6" />
                  )}
                </button>
              </div>
              
              {error && (
                <p className="mt-3 text-sm text-orange-100 text-center">
                  {error}
                </p>
              )}
            </form>
          </div>

          {/* Info Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="p-3 bg-blue-50 rounded-lg inline-block mb-3">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Seguimiento en Tiempo Real</h3>
                <p className="text-sm text-gray-600">Actualizaciones instantáneas del estado de tu envío</p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-green-50 rounded-lg inline-block mb-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Notificaciones de Entrega</h3>
                <p className="text-sm text-gray-600">Recibe alertas cuando tu paquete sea entregado</p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-purple-50 rounded-lg inline-block mb-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Historial Completo</h3>
                <p className="text-sm text-gray-600">Consulta todo el trayecto de tu paquete</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">¿Cómo encontrar tu código de seguimiento?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                    1
                  </div>
                  <p>Revisa el correo electrónico de confirmación que recibiste al realizar tu compra</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                    2
                  </div>
                  <p>Busca en la etiqueta del paquete el código que comienza con "UC-"</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                    3
                  </div>
                  <p>Contacta al vendedor para solicitar tu código de seguimiento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}