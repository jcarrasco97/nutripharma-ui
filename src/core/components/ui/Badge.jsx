import React from "react";

/**
 * Componente para etiquetas de estado, categorías o contadores.
 */
const Badge = ({ children, variant = "default", className = "" }) => {
  // Estilo base: pequeñito, mayúsculas, negrita y espaciado (tracking-widest)
  const baseStyles =
    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border";

  // Variantes semánticas conectadas a tu tailwind.config.js
  const variants = {
    default: "bg-gray-100 text-neutral border-gray-200", // Borradores, neutrales
    success: "bg-primary/10 text-primary border-primary/20", // Validadas, éxitos
    danger: "bg-red-50 text-red-600 border-red-200", // Canceladas, errores
    warning: "bg-amber-50 text-amber-700 border-amber-200", // Pendientes, incidencias
    accent: "bg-accent/20 text-secondary border-accent/50", // Destacados especiales
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
