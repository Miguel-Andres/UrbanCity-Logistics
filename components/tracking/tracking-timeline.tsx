/**
 * Componente para mostrar el timeline de eventos del tracking
 */
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  MapPin,
  User,
  FileText 
} from 'lucide-react'

interface TrackingEvent {
  id: string
  shipment_id: string
  status: string
  notes?: string
  delivered_by?: string
  received_by?: string
  created_at: string
}

interface TrackingTimelineProps {
  events: TrackingEvent[]
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pendiente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  in_transit: {
    icon: Truck,
    label: 'En tránsito',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  delivered: {
    icon: CheckCircle,
    label: 'Entregado',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  failed: {
    icon: AlertCircle,
    label: 'Fallido',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getEventConfig = (status: string) => {
    // Usar el status directamente
    if (status && status in statusConfig) {
      return statusConfig[status as keyof typeof statusConfig]
    }
    
    // Default
    return statusConfig.pending
  }

  // Si no hay eventos, mostrar mensaje
  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Historial de Eventos</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay eventos registrados todavía</p>
          <p className="text-sm text-gray-400 mt-1">Los eventos aparecerán aquí una vez que el envío esté en curso</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-gray-600" />
        Historial de Eventos
      </h3>
      
      <div className="relative">
        {/* Línea del timeline */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {events.map((event, index) => {
            const config = getEventConfig(event.status)
            const EventIcon = config.icon
            const { date, time } = formatEventDate(event.created_at)
            
            return (
              <div key={event.id} className="relative flex items-start space-x-4">
                {/* Círculo del evento */}
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${config.bgColor} border-2 border-white shadow-sm`}>
                  <EventIcon className={`w-5 h-5 ${config.color}`} />
                </div>
                
                {/* Contenido del evento */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{config.label}</p>
                      
                      {/* Información adicional del evento */}
                      <div className="mt-2 space-y-1">
                        {event.delivered_by && (
                          <p className="text-sm text-gray-600">
                            Entregado por: <span className="font-medium">{event.delivered_by}</span>
                          </p>
                        )}
                        {event.received_by && (
                          <p className="text-sm text-gray-600">
                            Recibido por: <span className="font-medium">{event.received_by}</span>
                          </p>
                        )}
                        {event.notes && (
                          <p className="text-sm text-gray-600">
                            Nota: <span className="italic">{event.notes}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Fecha y hora */}
                    <div className="flex flex-col items-end ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{time}</p>
                      <p className="text-xs text-gray-500">{date}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}