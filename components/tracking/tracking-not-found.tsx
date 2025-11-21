/**
 * Componente para mostrar cuando un envío no es encontrado
 */
import Link from 'next/link'
import { Package, Home, Search, ArrowLeft } from 'lucide-react'

interface TrackingNotFoundProps {
  code: string
}

export function TrackingNotFound({ code }: TrackingNotFoundProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Icono de error */}
        <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-6">
          <Package className="w-10 h-10 text-red-600" />
        </div>
        
        {/* Título y mensaje */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Envío No Encontrado
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          No se pudo encontrar un envío con el código de seguimiento:
        </p>
        
        {/* Código mal formateado */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <code className="text-lg font-mono font-bold text-gray-800 block text-center">
            {code.toUpperCase()}
          </code>
        </div>
        
        {/* Sugerencias */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Search className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Sugerencias:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Verifica que el código esté escrito correctamente</li>
                <li>• El código debe tener el formato UC-XXXXXX</li>
                <li>• Asegúrate de haber recibido el código del vendedor</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            href="/tracking"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Intentar con otro código</span>
          </Link>
          
          <Link
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Ir al Inicio</span>
          </Link>
        </div>
        
        {/* Contacto */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Necesitas ayuda? Contacta a nuestro{' '}
          <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
            equipo de soporte
          </a>
        </p>
      </div>
    </div>
  )
}