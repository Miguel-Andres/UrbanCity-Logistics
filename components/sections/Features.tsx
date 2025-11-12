"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Shield, Truck, Package } from "lucide-react";
import FeatureCard from "../ui/FeatureCard";

export default function Features() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Clock,
      title: "Entregas Rápidas",
      description: "Optimizamos rutas para entregas en tiempo récord",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Tu paquete seguro desde origen hasta destino",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Truck,
      title: "Flota Moderna",
      description: "Vehículos adaptados para la logística urbana",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Package,
      title: "Seguimiento Real",
      description: "Monitoriza tu envío en todo momento",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos soluciones logísticas adaptadas a las necesidades del entorno urbano moderno
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}