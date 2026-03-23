import React, { useState, useEffect } from "react";
import {
  Lock,
  User,
  ArrowRight,
  Activity,
  Loader2,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { authService } from "./authService";
import { useNavigate, useLocation } from "react-router-dom"; // <-- Añadido useLocation

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- Permite leer mensajes ocultos en la navegación

  const [credenciales, setCredenciales] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargando, setCargando] = useState(false);

  const [vistaRecuperar, setVistaRecuperar] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- EFECTO DE RECEPCIÓN DE MENSAJES ---
  // Si venimos rebotados de ResetPassword.jsx, mostramos el éxito.
  useEffect(() => {
    if (location.state?.resetExitoso) {
      setMensajeExito(
        "¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.",
      );
      // Limpiamos el historial para que si el usuario recarga el Login, no vuelva a salir el aviso verde
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setMensajeExito(""); // Limpiamos mensajes previos
    try {
      const data = await authService.login(
        credenciales.username,
        credenciales.password,
      );
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Credenciales incorrectas o cuenta inactiva.");
    } finally {
      setCargando(false);
    }
  };

  const handleRecuperarPassword = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      await authService.solicitarReset(emailRecuperacion);
      setMensajeExito(
        "Si el correo existe, hemos enviado un enlace. Revisa tu bandeja de entrada.",
      );
      setTimeout(() => {
        setVistaRecuperar(false);
        setMensajeExito("");
      }, 5000);
    } catch (err) {
      console.error("Error al pedir recuperación:", err);
      setError("Error al solicitar la recuperación.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-sky-500 p-8 text-center">
          <div className="inline-flex items-center justify-center bg-white/20 p-3 rounded-full mb-4">
            <Activity className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            NutriPharma
          </h2>
          <p className="text-sky-100 mt-2 text-sm">
            {vistaRecuperar
              ? "Recuperación de Acceso"
              : "Panel de Acceso Clínico"}
          </p>
        </div>

        <div className="p-8">
          {mensajeExito && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm text-center font-bold mb-4">
              {mensajeExito}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-bold mb-4">
              {error}
            </div>
          )}

          {/* VISTA: RECUPERAR CONTRASEÑA */}
          {vistaRecuperar ? (
            <form onSubmit={handleRecuperarPassword} className="space-y-6">
              <p className="text-sm text-gray-500 text-center">
                Introduce tu correo electrónico y te enviaremos instrucciones
                para restablecer tu contraseña.
              </p>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailRecuperacion}
                    onChange={(e) => setEmailRecuperacion(e.target.value)}
                    disabled={cargando}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors disabled:bg-sky-300"
              >
                {cargando ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Enviar enlace"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setVistaRecuperar(false);
                  setError("");
                }}
                className="w-full text-sm font-bold text-gray-500 hover:text-sky-600 mt-4 text-center"
              >
                Volver al Login
              </button>
            </form>
          ) : (
            /* VISTA: LOGIN NORMAL */
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    disabled={cargando}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none disabled:bg-gray-100"
                    placeholder="Introduce tu usuario"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setVistaRecuperar(true)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-sky-500" />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={credenciales.password}
                    onChange={handleChange}
                    disabled={cargando}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none disabled:bg-gray-100"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sky-600"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors mt-4 disabled:bg-sky-300"
              >
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
