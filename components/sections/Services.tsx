"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Building2, Home, ArrowRight, Clock, Shield, Zap } from 'lucide-react'

export default function Services() {
  const [activeService, setActiveService] = useState<number | null>(null)

  const services = [
    {
      id: 1,
      icon: Package,
      title: "📦 Mensajería Express",
      subtitle: "Entrega < 2 horas",
      description: "Envíos urgentes dentro de la ciudad con actualizaciones constantes",
      features: ["Entrega el mismo día", "Seguro incluido", "Tracking online", "Notificaciones SMS"],
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      bgColor: "bg-orange-50",
      popular: true
    },
    {
      id: 2,
      icon: Building2,
      title: "🏢 Empresas",
      subtitle: "Descuentos Especiales",
      description: "Soluciones logísticas personalizadas para tu negocio",
      features: ["Planes corporativos", "Dedicated account", "API integración", "Facturación mensual"],
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      bgColor: "bg-blue-50",
      popular: false
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: "🛒 E-commerce",
      subtitle: "Last Mile Delivery",
      description: "Especialistas en la entrega final de productos online",
      features: ["Integración plataformas", "Gestión de devoluciones", "Tracking online", "Pago contra entrega"],
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      bgColor: "bg-green-50",
      popular: false
    },
    {
      id: 4,
      icon: Home,
      title: "🏠 Particulares",
      subtitle: "Entrega Personal",
      description: "Servicios de mensajería para tus necesidades personales",
      features: ["Documentación legal", "Pequeños paquetes", "Regalos especiales", "Compras online"],
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      bgColor: "bg-purple-50",
      popular: false
    }
  ]

  return (
    <section id="servicios" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🚀 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">SERVICIOS</span> A TU MEDIDA
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones de logística adaptadas a tus necesidades, con la tecnología más avanzada del mercado
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
              className="relative"
            >
              <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${activeService === service.id ? 'scale-105' : ''}`}>
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                
                {/* Service Content */}
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <service.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                        <p className="text-lg text-gray-600">{service.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={activeService === service.id ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center space-x-3"
                      >
                        <div className={`w-6 h-6 ${service.bgColor} rounded-full flex items-center justify-center`}>
                          <div className={`w-2 h-2 bg-gradient-to-br ${service.color} rounded-full`}></div>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-gradient-to-r ${service.color} ${service.hoverColor} text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2`}
                  >
                    <span>Cotizar Servicio</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Decorative Gradient Border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color}`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-orange-50 to-white rounded-3xl p-8 sm:p-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Urban City Logistics?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Ultra Rápido</h4>
              <p className="text-gray-600">Entregas en tiempo récord con nuestra flota optimizada</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Totalmente Seguro</h4>
              <p className="text-gray-600">Todos tus envíos están asegurados hasta $1000</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">24/7 Disponible</h4>
              <p className="text-gray-600">Soporte y tracking continuo los 365 días del año</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}