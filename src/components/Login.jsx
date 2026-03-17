import React, { useState } from "react";
import { Lock, User, ArrowRight, Activity, Loader2 } from "lucide-react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

/**
 * Componente Login: Puerta de entrada a la aplicación.
 * Maneja la captura de credenciales, la comunicación con el servicio de autenticación
 * y la redirección al panel principal tras un inicio de sesión exitoso.
 */
const Login = () => {
  // Hook de navegación para movernos entre pantallas sin recargar la página.
  const navigate = useNavigate();

  // ESTADOS DEL COMPONENTE
  // 1. credenciales: Almacena los datos del formulario de forma controlada.
  const [credenciales, setCredenciales] = useState({
    username: "",
    password: "",
  });

  // 2. error: Gestiona los mensajes de feedback negativo (ej. credenciales inválidas).
  const [error, setError] = useState("");

  // 3. cargando: Bloquea la UI para evitar múltiples peticiones simultáneas.
  const [cargando, setCargando] = useState(false);

  /**
   * Manejador de eventos para los inputs.
   * Actualiza el estado 'credenciales' dinámicamente usando el atributo 'name' del input.
   * Además, limpia cualquier mensaje de error previo para mejorar la experiencia de usuario.
   */
  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    setError("");
  };

  /**
   * Orquestador principal del proceso de inicio de sesión.
   * Se ejecuta al enviar el formulario (onSubmit).
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto de recarga del navegador.

    // Iniciamos estado de carga y limpiamos errores anteriores.
    setCargando(true);
    setError("");

    try {
      // 1. Petición HTTP: Delegamos la lógica de red al authService.
      const data = await authService.login(
        credenciales.username,
        credenciales.password,
      );

      // 2. Persistencia: Almacenamos el JWT recibido en el localStorage.
      // NOTA: Para mayor seguridad en el futuro, evaluar el uso de cookies HttpOnly.
      localStorage.setItem("token", data.token);

      // 3. Navegación: Redirigimos al usuario al panel principal.
      navigate("/dashboard");
    } catch (err) {
      // Manejo de errores de red o credenciales inválidas.
      console.error("Error en la autenticación:", err);
      setError("Credenciales incorrectas o servidor no disponible.");
    } finally {
      // Garantizamos que la UI se desbloquee independientemente del resultado de la petición.
      setCargando(false);
    }
  };

  return (
    // CONTENEDOR PRINCIPAL: Centrado absoluto en pantalla con fondo claro.
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      {/* TARJETA DE LOGIN: Diseño contenedor principal */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* SECCIÓN VISUAL: Cabecera Azul con branding */}
        <div className="bg-sky-500 p-8 text-center">
          <div className="inline-flex items-center justify-center bg-white/20 p-3 rounded-full mb-4">
            <Activity className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            NutriPharma
          </h2>
          <p className="text-sky-100 mt-2 text-sm">Panel de Acceso Clínico</p>
        </div>

        {/* SECCIÓN FUNCIONAL: Área del Formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* RENDERIZADO CONDICIONAL: Mensaje de Error Visual */}
            {/* Solo se dibuja en el DOM si el estado 'error' tiene contenido */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* CAMPO DE ENTRADA: Usuario / DNI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario / DNI
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={credenciales.username}
                  onChange={handleChange}
                  disabled={cargando} // Bloquea el input durante la petición
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors outline-none disabled:bg-gray-100"
                  placeholder="Introduce tu usuario"
                />
              </div>
            </div>

            {/* CAMPO DE ENTRADA: Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={credenciales.password}
                  onChange={handleChange}
                  disabled={cargando} // Bloquea el input durante la petición
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors outline-none disabled:bg-gray-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* BOTÓN DE ACCIÓN: Submit con estado de carga interactivo */}
            <button
              type="submit"
              disabled={cargando}
              // Tailwind: Aplicamos estilos condicionales usando la pseudo-clase 'disabled:'
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors mt-4 disabled:bg-sky-300 disabled:cursor-not-allowed"
            >
              {/* RENDERIZADO CONDICIONAL: Cambiamos el contenido del botón según el estado */}
              {cargando ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Conectando...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
