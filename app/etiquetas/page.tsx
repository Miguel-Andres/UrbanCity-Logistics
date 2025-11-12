'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EtiquetasPage() {
  const [rawText, setRawText] = useState('');
  const [formData, setFormData] = useState({
    remitente: '',
    remitenteDir: '',
    remitenteTel: '',
    destinatario: '',
    destinatarioDir: '',
    destinatarioTel: '',
    producto: '',
    peso: '',
    servicio: 'estandar',
    notas: ''
  });

  const handleAutoFill = () => {
    // Simulación simple de extracción de datos
    // En producción, esto se conectaría con una IA
    if (rawText.toLowerCase().includes('nombre')) {
      setFormData(prev => ({
        ...prev,
        destinatario: 'Juan Pérez',
        destinatarioDir: 'Av. Corrientes 1234, CABA',
        destinatarioTel: '+54 11 1234-5678',
        producto: 'Producto extraído del chat'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Urban City Logistics</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            Generador de Etiquetas Inteligente
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Crea tus etiquetas de envío
            <span className="block text-orange-600 dark:text-orange-400">en segundos</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Pega el chat de WhatsApp o los datos de MercadoLibre y genera etiquetas profesionales automáticamente
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Input Section */}
            <div className="space-y-6">
              {/* Chat Input */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    Datos del Envío
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" title="WhatsApp">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors" title="MercadoLibre">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.875 15.938L9.062 21.75l-5.812-5.812 5.812-5.813z"/>
                        <path d="M20.687 2.25L14.875 8.063l5.812 5.812L26.5 8.063z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Pega aquí el chat de WhatsApp o los datos de MercadoLibre...&#10;&#10;Ejemplo:&#10;Nombre: Juan Pérez&#10;Dirección: Av. Corrientes 1234&#10;Teléfono: 11-1234-5678&#10;Producto: Zapatillas Nike"
                  className="w-full h-40 px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                />
                <button
                  onClick={handleAutoFill}
                  disabled={!rawText.trim()}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Extraer Datos Automáticamente</span>
                </button>
              </div>

              {/* Form */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Datos del Envío
                </h3>
                <div className="space-y-4">
                  {/* Destinatario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destinatario
                    </label>
                    <input
                      type="text"
                      value={formData.destinatario}
                      onChange={(e) => setFormData({...formData, destinatario: e.target.value})}
                      placeholder="Nombre completo"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.destinatarioDir}
                      onChange={(e) => setFormData({...formData, destinatarioDir: e.target.value})}
                      placeholder="Dirección completa"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={formData.destinatarioTel}
                      onChange={(e) => setFormData({...formData, destinatarioTel: e.target.value})}
                      placeholder="Teléfono"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Remitente */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Remitente
                    </label>
                    <input
                      type="text"
                      value={formData.remitente}
                      onChange={(e) => setFormData({...formData, remitente: e.target.value})}
                      placeholder="Tu nombre o empresa"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Producto y Servicio */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Producto
                      </label>
                      <input
                        type="text"
                        value={formData.producto}
                        onChange={(e) => setFormData({...formData, producto: e.target.value})}
                        placeholder="Descripción"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Servicio
                      </label>
                      <select
                        value={formData.servicio}
                        onChange={(e) => setFormData({...formData, servicio: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="estandar">Estándar</option>
                        <option value="express">Express</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Vista Previa de la Etiqueta
                </h3>

                {/* Label Preview */}
                <div className="bg-white border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 mb-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Urban City</div>
                        <div className="text-xs text-gray-600">Logistics</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Código de envío</div>
                      <div className="text-sm font-mono font-bold text-gray-900">UCL-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Destinatario */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Para:</div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-gray-900">{formData.destinatario || 'Nombre del destinatario'}</div>
                      <div className="text-sm text-gray-600 mt-1">{formData.destinatarioDir || 'Dirección del destinatario'}</div>
                      <div className="text-sm text-gray-600">{formData.destinatarioTel || 'Teléfono'}</div>
                    </div>
                  </div>

                  {/* Remitente */}
                  {formData.remitente && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">De:</div>
                      <div className="text-sm text-gray-700">{formData.remitente}</div>
                    </div>
                  )}

                  {/* Producto y Servicio */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {formData.producto && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Producto</div>
                        <div className="text-sm text-gray-700">{formData.producto}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Servicio</div>
                      <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        formData.servicio === 'urgente' ? 'bg-red-100 text-red-800' :
                        formData.servicio === 'express' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {formData.servicio.charAt(0).toUpperCase() + formData.servicio.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Barcode simulation */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-center">
                      <svg className="h-16 w-full" viewBox="0 0 200 40">
                        <rect x="10" y="5" width="2" height="30" fill="black"/>
                        <rect x="15" y="5" width="1" height="30" fill="black"/>
                        <rect x="18" y="5" width="3" height="30" fill="black"/>
                        <rect x="24" y="5" width="1" height="30" fill="black"/>
                        <rect x="28" y="5" width="2" height="30" fill="black"/>
                        <rect x="33" y="5" width="1" height="30" fill="black"/>
                        <rect x="37" y="5" width="3" height="30" fill="black"/>
                        <rect x="43" y="5" width="2" height="30" fill="black"/>
                        <rect x="48" y="5" width="1" height="30" fill="black"/>
                        <rect x="52" y="5" width="2" height="30" fill="black"/>
                        <rect x="57" y="5" width="3" height="30" fill="black"/>
                        <rect x="63" y="5" width="1" height="30" fill="black"/>
                        <rect x="67" y="5" width="2" height="30" fill="black"/>
                        <rect x="72" y="5" width="1" height="30" fill="black"/>
                        <rect x="76" y="5" width="3" height="30" fill="black"/>
                        <rect x="82" y="5" width="2" height="30" fill="black"/>
                        <rect x="87" y="5" width="1" height="30" fill="black"/>
                        <rect x="91" y="5" width="2" height="30" fill="black"/>
                        <rect x="96" y="5" width="3" height="30" fill="black"/>
                        <rect x="102" y="5" width="1" height="30" fill="black"/>
                        <rect x="106" y="5" width="2" height="30" fill="black"/>
                        <rect x="111" y="5" width="1" height="30" fill="black"/>
                        <rect x="115" y="5" width="3" height="30" fill="black"/>
                        <rect x="121" y="5" width="2" height="30" fill="black"/>
                        <rect x="126" y="5" width="1" height="30" fill="black"/>
                        <rect x="130" y="5" width="2" height="30" fill="black"/>
                        <rect x="135" y="5" width="3" height="30" fill="black"/>
                        <rect x="141" y="5" width="1" height="30" fill="black"/>
                        <rect x="145" y="5" width="2" height="30" fill="black"/>
                        <rect x="150" y="5" width="1" height="30" fill="black"/>
                        <rect x="154" y="5" width="3" height="30" fill="black"/>
                        <rect x="160" y="5" width="2" height="30" fill="black"/>
                        <rect x="165" y="5" width="1" height="30" fill="black"/>
                        <rect x="169" y="5" width="2" height="30" fill="black"/>
                        <rect x="174" y="5" width="3" height="30" fill="black"/>
                        <rect x="180" y="5" width="1" height="30" fill="black"/>
                        <rect x="184" y="5" width="2" height="30" fill="black"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    disabled={!formData.destinatario || !formData.destinatarioDir}
                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Descargar Etiqueta (PDF)</span>
                  </button>
                  <button className="w-full px-6 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Imprimir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
