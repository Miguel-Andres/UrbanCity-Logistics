"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const pricingPlans = [
  {
    name: "CABA",
    description: "Capital Federal - Entrega el mismo día",
    price: "800",
    period: "por envío",
    color: "from-blue-500 to-blue-600",
    features: [
      "Mercado Envío Flex",
      "Entrega el mismo día",
      "Segunda visita gratuita",
      "Dirección alternativa gratis",
      "Cobertura Capital Federal",
      "Horarios de corte: 12pm y 1pm"
    ],
    popular: false,
    currency: "ARS"
  },
  {
    name: "GBA Zona 1",
    description: "Gran Buenos Aires Zona 1 - Más popular",
    price: "1250",
    period: "por envío",
    color: "from-orange-500 to-orange-600",
    features: [
      "Mercado Envío Flex",
      "Entrega el mismo día",
      "Segunda visita gratuita", 
      "Dirección alternativa gratis",
      "Cobertura GBA Zona 1",
      "Horarios de corte: 12pm y 1pm",
      "Rutas zonales incluidas"
    ],
    popular: true,
    currency: "ARS"
  },
  {
    name: "GBA Zona 2",
    description: "Gran Buenos Aires Zona 2 - Cobertura extendida",
    price: "1750",
    period: "por envío", 
    color: "from-purple-500 to-purple-600",
    features: [
      "Mercado Envío Flex",
      "Entrega el mismo día",
      "Segunda visita gratuita",
      "Dirección alternativa gratis", 
      "Cobertura GBA Zona 2",
      "Horarios de corte: 12pm y 1pm",
      "Rutas zonales incluidas",
      "Mayor alcance territorial"
    ],
    popular: false,
    currency: "ARS"
  }
];

export default function Pricing() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="primary" className="mb-4">
            Tarifas
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tarifas por{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Zona
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Precio fijo por envío según la zona de destino. Sin sorpresas ni costos ocultos.
          </p>
          
          {/* Métricas destacadas */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-orange-500">99.99%</span>
              <span className="text-sm text-gray-600">Entregas efectivas</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-orange-500">+100K</span>
              <span className="text-sm text-gray-600">Envíos completados</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-orange-500">Same Day</span>
              <span className="text-sm text-gray-600">Entrega garantizada</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card 
                className="h-full"
                hover={true}
                gradient={false}
              >
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl font-bold text-white">
                      {plan.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-xl text-gray-500 mr-1">$</span>
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-2">{plan.currency}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {plan.period}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a 
                  href="https://wa.me/5491171510375?text=Hola! Me interesa información sobre sus servicios de envíos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    Contactar por WhatsApp
                  </Button>
                </a>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ¿Consultas sobre nuestros servicios?
            </h3>
            <p className="text-gray-600 mb-6">
              Contáctanos por WhatsApp para obtener información detallada sobre nuestras zonas de cobertura
              y servicios personalizados para tu empresa.
            </p>
            <div className="flex justify-center">
              <Button variant="primary">
                Ver Zonas de Cobertura
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}