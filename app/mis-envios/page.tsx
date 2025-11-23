'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SimpleTable from '@/components/dashboard/SimpleTable'
import StatusBadge from '@/components/dashboard/StatusBadge'

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

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

function MisEnviosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'todos')

  // Obtener datos de la API
  const fetchShipments = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'todos') params.append('status', statusFilter)

      const response = await fetch(`/api/shipments?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch shipments')
      }

      const data = await response.json()
      setShipments(data.shipments)
      setPagination(data.pagination)
      
      // Actualizar URL
      const newParams = new URLSearchParams(searchParams)
      if (page > 1) {
        newParams.set('page', page.toString())
      } else {
        newParams.delete('page')
      }
      router.replace(`/mis-envios?${newParams.toString()}`)
      
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  // useEffect para cargar datos iniciales
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    fetchShipments(page)
  }, [searchTerm, statusFilter])

  // Funciones de paginación
  const handlePageChange = (page: number) => {
    setLoading(true)
    fetchShipments(page)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.replace(`/mis-envios?${params.toString()}`)
  }

  const handleStatusChange = (status: string) => {
    setLoading(true)
    setStatusFilter(status)
    const params = new URLSearchParams(searchParams)
    if (status !== 'todos') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    params.delete('page')
    router.replace(`/mis-envios?${params.toString()}`)
  }

  if (loading && shipments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Cargando envíos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative rounded-full h-10 w-10 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Mis Envíos
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {pagination?.totalItems || 0} envío{pagination?.totalItems !== 1 ? 's' : ''} en total
                </p>
              </div>
            </div>
            <a
              href="/dashboard"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400"
            >
              ← Volver al dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Buscar por código o destinatario..."
                />
              </div>
            </form>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="in_transit">En camino</option>
                <option value="delivered">Entregados</option>
                <option value="failed">Fallidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <SimpleTable shipments={shipments} />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              Mostrando <span className="font-medium">{(pagination.currentPage - 1) * 20 + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(pagination.currentPage * 20, pagination.totalItems)}
              </span>{' '}
              de <span className="font-medium">{pagination.totalItems}</span> resultados
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function MisEnviosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Cargando...</p>
        </div>
      </div>
    }>
      <MisEnviosContent />
    </Suspense>
  )
}