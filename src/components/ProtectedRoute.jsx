import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Componente Guardián (Route Guard)
 * Envuelve a cualquier componente que requiera autenticación.
 * Si el usuario no tiene token, lo expulsa al Login.
 */
const ProtectedRoute = ({ children }) => {
  // Buscamos si existe el token en el bolsillo del navegador
  const token = localStorage.getItem("token");

  // Si no hay token, lo redirigimos a la ruta raíz ("/") que es el Login.
  // El 'replace' borra el historial para que no pueda volver atrás con la flecha del navegador.
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderizamos el componente hijo (ej. el Dashboard)
  return children;
};

export default ProtectedRoute;
