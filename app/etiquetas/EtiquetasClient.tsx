/**
 * Client Component para Etiquetas - Recibe user como prop del Server Component
 */
'use client'

import { UserMenu } from '@/app/components/UserMenu'
import Tabs from '@/app/etiquetas/components/shared/Tabs'
import SingleLabelWizard from '@/app/etiquetas/components/wizard/SingleLabelWizard'
import MultipleLabelWizard from '@/app/etiquetas/components/multiple/MultipleLabelWizard'
import { useActiveTab, useUIStore } from '@/lib/stores/useUIStore'
import { User } from '@supabase/supabase-js'

interface EtiquetasClientProps {
  user: User
}

export default function EtiquetasClient({ user }: EtiquetasClientProps) {
  const activeTab = useActiveTab()
  const { setActiveTab } = useUIStore()

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Background de líneas de tren */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900"></div>
        <div className="absolute inset-0 opacity-[0.04]">
          <img src="/subway-lines.png" alt="" className="w-full h-full object-cover mix-blend-screen" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 relative z-10">
        {/* Background subway lines solo para header */}
        <div className="absolute inset-0 opacity-8">
          <img src="/subway-lines.png" alt="" className="w-full h-full object-cover mix-blend-screen" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-50">
                Generador de Etiquetas
              </h1>
              <p className="text-sm text-slate-300">
                Crea etiquetas de envío profesionales
              </p>
            </div>
            <UserMenu user={user} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        <section className="pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'single' ? (
              <>
                {/* Single Label Wizard */}
                <SingleLabelWizard user={user} />
              </>
            ) : (
              /* Multiple Labels Interface */
              <MultipleLabelWizard />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}