/**
 * Página principal del generador de etiquetas - Arquitectura limpia y modular
 */
'use client'

import Tabs from '@/app/etiquetas/components/shared/Tabs'
import SingleLabelWizard from '@/app/etiquetas/components/wizard/SingleLabelWizard'
import MultipleLabelWizard from '@/app/etiquetas/components/multiple/MultipleLabelWizard'
import { useActiveTab, useUIStore } from '@/lib/stores/useUIStore'

export default function EtiquetasPage() {
  const activeTab = useActiveTab()
  const { setActiveTab } = useUIStore()

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