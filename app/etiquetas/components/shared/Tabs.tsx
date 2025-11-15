/**
 * Componente de Tabs para selección entre etiqueta simple o múltiple
 */
'use client'

import { Package, BarChart3 } from 'lucide-react'
import { TabType } from '@/app/etiquetas/types'

interface TabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-1.5 inline-flex">
            <button
              onClick={() => onTabChange('single')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'single'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Una Etiqueta</span>
              </div>
            </button>
            <button
              onClick={() => onTabChange('multiple')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'multiple'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Múltiples Etiquetas</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}