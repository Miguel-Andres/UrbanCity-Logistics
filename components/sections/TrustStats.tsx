"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, Users, Truck, Clock, Star, Award, Shield, Globe } from 'lucide-react'

export default function TrustStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    {
      icon: Truck,
      value: "15,000+",
      label: "Envíos Diarios",
      description: "Paquetes entregados cada día",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: TrendingUp,
      value: "99.8%",
      label: "Entregas a Tiempo",
      description: "Precisión en cada entrega",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Soporte",
      description: "Asistencia constante",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Users,
      value: "2,500+",
      label: "Clientes Felices",
      description: "Empresas que confían en nosotros",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  const testimonials = [
    {
      name: "María González",
      company: "Tienda Online Chic",
      text: "Mis paquetes llegan antes de lo prometido. ¡Excelente servicio!",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Carlos Rodríguez",
      company: "Restaurante El Sabor",
      text: "La logística de entregas transformó nuestro negocio. 100% recomendado.",
      rating: 5,
      image: "👨‍🍳"
    },
    {
      name: "Ana Martínez",
      company: "Farmacia Salud",
      text: "Confiables y rápidos. Nunca nos han fallado en 2 años.",
      rating: 5,
      image: "👩‍⚕️"
    }
  ]

  return (
    <section id="estadisticas" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            📊 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">CONFIAN</span> EN NOSOTROS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de empresas ya confían en Urban City Logistics para sus entregas urgentes
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          id="testimonios"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 sm:p-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              💬 LO DICEN NUESTROS CLIENTES
            </h3>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 font-semibold text-gray-900">4.9/5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Awards Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-8 px-8 py-4 bg-gray-50 rounded-full">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-900">Mejor Servicio 2024</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Certificado ISO 9001</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Cobertura Nacional</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}