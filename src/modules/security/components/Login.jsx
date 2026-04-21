import React from "react";
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
import { useAuth } from "../../../features/auth/hooks/useAuth";

const Login = () => {
  const hook = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* CABECERA */}
        <div className="bg-gradient-to-r from-[#006633] to-[#68b54e] p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center bg-white/20 p-3 rounded-full mb-4 relative z-10">
            <Activity className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight relative z-10">
            NutriPharma
          </h2>
          <p className="text-[#bed000] mt-2 text-sm font-medium relative z-10">
            {hook.vistaRecuperar
              ? "Recuperación de Acceso"
              : "Panel de Acceso Clínico"}
          </p>
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-5 rounded-full blur-xl"></div>
        </div>

        <div className="p-8">
          {hook.mensajeExito && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm text-center font-bold mb-4">
              {hook.mensajeExito}
            </div>
          )}
          {hook.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-bold mb-4">
              {hook.error}
            </div>
          )}

          {/* VISTA: RECUPERAR CONTRASEÑA */}
          {hook.vistaRecuperar ? (
            <form onSubmit={hook.handlePedirRecuperacion} className="space-y-6">
              <p className="text-sm text-[#342c1e] text-center">
                Introduce tu correo electrónico y te enviaremos instrucciones
                para restablecer tu contraseña.
              </p>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#367933]" />
                </div>
                <input
                  type="email"
                  required
                  value={hook.emailRecuperacion}
                  onChange={(e) => hook.setEmailRecuperacion(e.target.value)}
                  disabled={hook.cargando}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#367933] outline-none transition-all"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <button
                type="submit"
                disabled={hook.cargando}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md shadow-[#367933]/20 font-bold text-white bg-[#367933] hover:bg-[#006633] transition-colors disabled:bg-[#367933]/50"
              >
                {hook.cargando ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Enviar enlace"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  hook.setVistaRecuperar(false);
                  hook.setError("");
                }}
                className="w-full text-sm font-bold text-gray-500 hover:text-[#367933] mt-4 text-center transition-colors"
              >
                Volver al Login
              </button>
            </form>
          ) : (
            /* VISTA: LOGIN NORMAL */
            <form onSubmit={hook.handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#062e3a] mb-2">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#367933]" />
                  </div>
                  <input
                    type="email"
                    name="username"
                    required
                    value={hook.credenciales.username}
                    onChange={hook.handleChange}
                    disabled={hook.cargando}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#367933] outline-none disabled:bg-gray-100 transition-all"
                    placeholder="ejemplo@nutripharma.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#062e3a]">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => hook.setVistaRecuperar(true)}
                    className="text-xs font-bold text-[#367933] hover:text-[#006633] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#367933]" />
                  </div>
                  <input
                    type={hook.showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={hook.credenciales.password}
                    onChange={hook.handleChange}
                    disabled={hook.cargando}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#367933] focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => hook.setShowPassword(!hook.showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#367933] transition-colors"
                    tabIndex="-1"
                  >
                    {hook.showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={hook.cargando}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md shadow-[#367933]/20 text-sm font-bold text-white bg-[#367933] hover:bg-[#006633] transition-colors mt-4 disabled:bg-[#367933]/50 disabled:shadow-none"
              >
                {hook.cargando ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />{" "}
                    Conectando...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-5 w-5" /> Iniciar Sesión
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
