import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function DeliveryLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Cargando información del envío...</p>
      </div>
    </div>
  )
}