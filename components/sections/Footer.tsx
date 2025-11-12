"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Truck, MapPin, Phone, Mail, Send, Facebook, Twitter, Instagram, Linkedin, ChevronRight, Shield, Award, Headphones } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  const services = [
    { text: 'Mensajería Urbana', href: '/servicios/mensajeria' },
    { text: 'Logística E-commerce', href: '/servicios/ecommerce' },
    { text: 'Transporte Empresarial', href: '/servicios/empresas' },
    { text: 'Almacenamiento', href: '/servicios/almacenamiento' }
  ]

  const company = [
    { text: 'Nosotros', href: '/nosotros' },
    { text: 'Cobertura', href: '/cobertura' },
    { text: 'Blog', href: '/blog' },
    { text: 'Trabaja con nosotros', href: '/careers' }
  ]

  const support = [
    { text: 'Centro de ayuda', href: '/help' },
    { text: 'Términos y condiciones', href: '/terms' },
    { text: 'Política de privacidad', href: '/privacy' },
    { text: 'Libro de reclamaciones', href: '/reclamaciones' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">🚀 Recibe Ofertas Exclusivas</h3>
              <p className="text-gray-400">Suscríbete y obtén 15% de descuento en tu primer envío</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{subscribed ? '¡Suscrito!' : 'Suscribirse'}</span>
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Urban City</h4>
                <p className="text-xs text-gray-400">Logistics</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Transformamos la logística urbana con tecnología innovadora. Entregas rápidas, seguras y sostenibles en toda la ciudad.
            </p>
            
            {/* Certifications */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-400">Certificado ISO 9001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-400">Mejor Servicio 2024</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Servicios</h3>
            <ul className="space-y-3">
              {services.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
            <ul className="space-y-3">
              {company.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-gray-400">Llámanos</p>
                  <p className="font-medium">(01) 234-5678</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-gray-400">Escríbenos</p>
                  <p className="font-medium">hola@urbancity.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Headphones className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-gray-400">Soporte 24/7</p>
                  <p className="font-medium">soporte@urbancity.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2025 Urban City Logistics. Todos los derechos reservados.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              
              <div className="w-px h-5 bg-gray-700"></div>
              
              {/* Legal Links */}
              <div className="flex items-center space-x-4 text-sm">
                <a href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Términos
                </a>
                <a href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Privacidad
                </a>
                <a href="/cookies" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}