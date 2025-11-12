"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Clock, MapPin, ArrowRight, Zap, Shield, Star } from 'lucide-react'

export default function Hero() {
  const [trackingCode, setTrackingCode] = useState('')
  const [isTracking, setIsTracking] = useState(false)

  const handleTrack = () => {
    if (trackingCode) {
      setIsTracking(true)
      // Simulate tracking
      setTimeout(() => {
        setIsTracking(false)
        // Navigate to tracking page
      }, 1000)
    }
  }

  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-16 pb-20 sm:pt-20 sm:pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Entregas en menos de 2 horas
            </motion.div>
            
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              # TUS ENVÍOS,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                NUESTRA PRIORIDAD
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Conectamos toda la ciudad en minutos. Logística urbana eficiente con tracking actualizado.
            </p>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-8 mb-8"
            >
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">4.9/5</span>
              </div>
              <div className="text-gray-300">|</div>
              <span className="text-gray-700">15,000+ envíos diarios</span>
              <div className="text-gray-300">|</div>
              <span className="text-gray-700">99.8% a tiempo</span>
            </motion.div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-shadow"
              >
                <Zap className="w-5 h-5" />
                <span className="font-medium">Envía Ya</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Cotiza Rápido</span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Right Column - Tracking Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main tracking card */}
            <div className="relative bg-white rounded-2xl shadow-xl p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Rastrear Envío</h2>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Search className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              
              {/* Tracking Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de seguimiento
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    placeholder="Ej: UCS-2024-123456"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  />
                  <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {/* Track Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTrack}
                disabled={!trackingCode || isTracking}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isTracking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Rastreando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Rastrear Ahora</span>
                  </>
                )}
              </motion.button>
              
              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">¿Necesitas ayuda?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Historial</span>
                  </button>
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Cobertura</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Seguro</p>
                <p className="text-xs text-gray-600">Hasta $1000</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">24/7</p>
                <p className="text-xs text-gray-600">Soporte</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}