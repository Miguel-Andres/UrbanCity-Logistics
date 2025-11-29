/**
 * Footer para la página de tracking con contacto de WhatsApp
 */
import { MessageCircle } from 'lucide-react'

interface TrackingFooterProps {
  trackingCode?: string
}

export function TrackingFooter({ trackingCode }: TrackingFooterProps) {
  const phoneNumber = "5491171510375" // +54 9 11 7151-0375
  
  // Construir mensaje con tracking code si está disponible
  const baseMessage = "Hola, tengo una consulta sobre mi envío"
  const fullMessage = trackingCode 
    ? `${baseMessage} con código: ${trackingCode}`
    : baseMessage
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          {/* Icono y mensaje */}
          <div className="flex items-center space-x-2 text-gray-700">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm sm:text-base">
              ¿Tienes dudas con tu envío o quieres más información?
            </span>
          </div>
          
          {/* Botón de WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <img 
              src="/pngwing.com.png" 
              alt="WhatsApp" 
              className="w-6 h-6 object-contain"
            />
            <span>Consulta por tu Envío</span>
          </a>
          
          {/* Texto pequeño */}
          <p className="text-xs text-gray-500">
            Respuesta rápida • Atención personalizada • Soporte 24/7
          </p>
        </div>
      </div>
    </footer>
  )
}