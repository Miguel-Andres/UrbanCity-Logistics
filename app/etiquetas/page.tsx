/**
 * Página principal del generador de etiquetas - Arquitectura limpia y modular
 */
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Tabs from '@/app/etiquetas/components/shared/Tabs'
import SingleLabelWizard from '@/app/etiquetas/components/wizard/SingleLabelWizard'
import MultipleLabelWizard from '@/app/etiquetas/components/multiple/MultipleLabelWizard'
import { useActiveTab, useUIStore } from '@/lib/stores/useUIStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'

export default function EtiquetasPage() {
  const router = useRouter()
  const activeTab = useActiveTab()
  const { setActiveTab } = useUIStore()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir a login
    if (!isLoading && !isAuthenticated) {
      router.push('/access')
    }
  }, [isLoading, isAuthenticated, router])

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (el useEffect redirigirá)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs Section */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'single' ? (
            <>
              {/* Single Label Wizard */}
              <SingleLabelWizard />
            </>
          ) : (
            /* Multiple Labels Interface */
            <MultipleLabelWizard />
          )}
        </div>
      </section>
    </div>
  )
}