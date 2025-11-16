"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Truck, ChevronDown, User, HeadphonesIcon, Phone, Mail,  Clock } from 'lucide-react'

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  const target = document.querySelector(href)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    { 
      title: "Mensajería Express", 
      description: "Entregas en menos de 2 horas",
      href: "/servicios/mensajeria",
      icon: "⚡",
      badge: "POPULAR"
    },
    { 
      title: "E-commerce Last Mile", 
      description: "Especialistas en delivery final",
      href: "/servicios/ecommerce",
      icon: "🛒",
      badge: null
    },
    { 
      title: "Logística Corporativa", 
      description: "Soluciones B2B integrales",
      href: "/servicios/empresas",
      icon: "🏢",
      badge: null
    },
    { 
      title: "Almacenamiento y Distribución", 
      description: "Centro logístico estratégico",
      href: "/servicios/almacenamiento",
      icon: "📦",
      badge: null
    },
    { 
      title: "Servicio Particular", 
      description: "Entregas personales y documentación",
      href: "/servicios/particulares",
      icon: "🏠",
      badge: null
    }
  ]

  const solutions = [
    { 
      title: "Retail y Tiendas", 
      desc: "envios para tu negocio",
      href: "/",
      icon: "🏪"
    },
    { 
      title: "Mercado envio Flex y Tineda Nube", 
      desc: "Envios Diarios entrega Same Day",
      href: "",
      icon: "🍽️"
    },
  ,
    { 
      title: "Documentación", 
      desc: "Entrega de documentos legales",
      href: "/",
      icon: "📄"
    }
  ]

  const resources = [
    { title: "Centro de Ayuda", href: "/help" },
    { title: "Blog Urban", href: "/blog" },
    { title: "Calculadora de Envíos", href: "/calculator" },
    { title: "API para Desarrolladores", href: "/api" }
  ]

  
  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
    

        {/* Main Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-200 transition-all">
                  <Truck className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Urban City</h1>
                <p className="text-xs text-gray-600 font-medium tracking-wide">Logistics</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {/* Servicios Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('servicios')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors font-semibold px-4 py-3 rounded-lg hover:bg-orange-50/50">
                  <span>Servicios</span>
                  <ChevronDown className={`w-4 h-4 transition-transform group-hover:rotate-180 ${activeDropdown === 'servicios' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'servicios' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-3 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {services.map((service, index) => (
                          <Link
                            key={index}
                            href={service.href}
                            className="group/item p-4 rounded-xl hover:bg-orange-50 transition-all relative"
                          >
                            {service.badge && (
                              <span className="absolute top-2 right-2 text-xs font-bold bg-orange-500 text-white px-2 py-1 rounded-full">
                                {service.badge}
                              </span>
                            )}
                            <div className="flex items-start space-x-3">
                              <span className="text-3xl">{service.icon}</span>
                              <div>
                                <p className="font-semibold text-gray-900 group-hover/item:text-orange-600">{service.title}</p>
                                <p className="text-sm text-gray-500">{service.description}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link href="/servicios" className="text-orange-600 font-semibold hover:text-orange-700 flex items-center space-x-2">
                          <span>Ver todos los servicios</span>
                          <ChevronDown className="w-4 h-4 rotate-270" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Soluciones Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('soluciones')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors font-semibold px-4 py-3 rounded-lg hover:bg-orange-50/50">
                  <span>Soluciones</span>
                  <ChevronDown className={`w-4 h-4 transition-transform group-hover:rotate-180 ${activeDropdown === 'soluciones' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'soluciones' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
                    >
                      <div className="space-y-3">
                        {solutions.map((solution, index) => (
                          <Link
                            key={index}
                            href={solution.href}
                            className="group/item flex items-start space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-all"
                          >
                            <span className="text-2xl">{solution.icon}</span>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover/item:text-orange-600">{solution.title}</p>
                              <p className="text-sm text-gray-500">{solution.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Recursos Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('recursos')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors font-semibold px-4 py-3 rounded-lg hover:bg-orange-50/50">
                  <span>Recursos</span>
                  <ChevronDown className={`w-4 h-4 transition-transform group-hover:rotate-180 ${activeDropdown === 'recursos' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'recursos' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
                    >
                      {resources.map((resource, index) => (
                        <Link
                          key={index}
                          href={resource.href}
                          className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded-lg font-medium"
                        >
                          {resource.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

           
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Quick Search */}
              <Link 
                href="/rastrear" 
                className="flex items-center space-x-2 text-orange-600 font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-all"
              >
                <Search className="w-5 h-5" />
                <span>Rastrear</span>
              </Link>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/cliente/portal" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-200"
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Mi Cuenta</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden bg-white border-t border-gray-100"
            >
              <div className="container mx-auto px-4 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Mobile Services */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 px-4 py-2 text-lg">🚀 Servicios</h3>
                  {services.map((service, index) => (
                    <Link
                      key={index}
                      href={service.href}
                      className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">{service.title}</p>
                          {service.badge && (
                            <span className="text-xs font-bold bg-orange-500 text-white px-2 py-1 rounded-full">
                              {service.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Mobile Solutions */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 px-4 py-2 text-lg">💡 Soluciones</h3>
                  {solutions.map((solution, index) => (
                    <Link
                      key={index}
                      href={solution.href}
                      className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-2xl">{solution.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{solution.title}</p>
                        <p className="text-sm text-gray-500">{solution.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Other Links */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <Link 
                    href="/nosotros" 
                    className="block font-semibold text-gray-900 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nosotros
                  </Link>

                  <Link 
                    href="/contacto" 
                    className="block font-semibold text-gray-900 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contacto
                  </Link>

                  <Link 
                    href="/rastrear" 
                    className="flex items-center space-x-2 font-semibold text-orange-600 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search className="w-5 h-5" />
                    <span>Rastrear Envío</span>
                  </Link>

                  <div className="pt-4 space-y-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors py-3 border border-gray-300 rounded-xl hover:border-orange-600"
                    >
                      <HeadphonesIcon className="w-5 h-5" />
                      <span className="font-semibold">Soporte 24/7</span>
                    </motion.button>

                    <motion.div
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/cliente/portal" 
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-semibold">Mi Cuenta</span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-[88px]"></div>
    </>
  )
}