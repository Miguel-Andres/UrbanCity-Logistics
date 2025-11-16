"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FileSearch, Package, Truck, Check, ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = [
    {
      icon: FileSearch,
      number: "1",
      title: "Solicita tu Envío",
      description: "Completa el formulario online o llama a nuestro call center. Es rápido y fácil.",
      features: ["Formulario simple", "Cotización instantánea", "Métodos de pago seguros"]
    },
    {
      icon: Package,
      number: "2", 
      title: "Preparamos tu Paquete",
      description: "Recolectamos tu paquete y lo preparamos con el mejor embalaje para su protección.",
      features: ["Puerta a Puerta", "Embalaje profesional", "Fotos del estado"]
    },
    {
      icon: Truck,
      number: "3",
      title: "Entrega Rápida",
      description: "Transportamos tu paquete con la máxima eficiencia y seguridad hasta su destino.",
      features: ["Flota moderna", "Rutas optimizadas", "Seguro incluido"]
    }
  ]

  return (
    <section id="como-funciona" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            📋 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">ENVÍA EN 3 PASOS</span> SENCILLOS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu paquete entregado en minutos. El proceso más simple del mercado.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 left-8 z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
              </div>

              {/* Step Card */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 pt-16 shadow-lg hover:shadow-xl transition-all group-hover:-translate-y-2 border border-orange-100">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {step.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + (index * 0.2) + (idx * 0.1) }}
                      className="flex items-center space-x-2"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-orange-300" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center bg-gradient-to-r from-orange-50 to-white rounded-2xl p-8 border border-orange-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para enviar tu primer paquete?
          </h3>
          <p className="text-gray-600 mb-6">
            Únete a miles de clientes que confían en Urban City Logistics
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#servicios"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              <span>Ver Servicios</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#cta"
              className="inline-flex items-center justify-center space-x-2 bg-white border-2 border-orange-500 text-orange-600 font-semibold px-8 py-3 rounded-xl hover:bg-orange-50 transition-all"
            >
              <span>Crear Cuenta</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}