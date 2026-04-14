import React from "react";

/**
 * Botón Corporativo Base (Atomic Design)
 * Sustituye a todos los botones sueltos de la aplicación.
 */
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  // 1. Estilos base compartidos (Forma, fuente, animaciones, estado disabled)
  const baseStyles =
    "px-6 py-3 rounded-xl font-black transition-all duration-200 flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  // 2. Diccionario de Variantes visuales (conectado al tailwind.config.js)
  const variants = {
    // Principal (Verde oscuro) - Para acciones de guardado, envío, etc.
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20",

    // Secundario (Azul oscuro) - Para botones de navegación, ver detalles.
    secondary: "bg-secondary text-white hover:opacity-90 shadow-md",

    // Outline (Transparente con borde pardo) - Para cancelar, volver.
    outline:
      "bg-transparent border-2 border-neutral-dark/20 text-neutral-dark hover:bg-neutral-dark/5",

    // Peligro (Rojo) - Excepción corporativa para borrar/cancelar algo crítico.
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",

    // Acento (Verde lima claro) - Para acciones especiales o notificaciones.
    accent:
      "bg-accent/20 text-primary hover:bg-accent/30 border border-accent/50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      // Combinamos el base, la variante elegida y cualquier clase extra que le pases
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Si está cargando, mostramos un spinner genérico, si no, los hijos (texto/iconos) */}
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
