"use client";

import { motion } from "framer-motion";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "secondary";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "" 
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-semibold rounded-full";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white", 
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
  };
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={classes}
    >
      {children}
    </motion.span>
  );
}