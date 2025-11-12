"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ 
  children, 
  className = "",
  hover = true,
  gradient = false
}: CardProps) {
  const baseClasses = "rounded-2xl p-8 transition-all duration-300";
  const backgroundClasses = gradient 
    ? "bg-gradient-to-br from-white via-gray-50 to-white"
    : "bg-white";
  const shadowClasses = hover 
    ? "shadow-lg hover:shadow-2xl hover:scale-105"
    : "shadow-lg";
  
  const classes = `${baseClasses} ${backgroundClasses} ${shadowClasses} ${className}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={classes}
    >
      {children}
    </motion.div>
  );
}