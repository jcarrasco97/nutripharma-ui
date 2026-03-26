import React from "react";
import { Lock, Loader2, Eye, EyeOff, XCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const hook = useAuth();

  if (!hook.tokenReset) {
    return (
      <div className="flex justify-center mt-20 p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 font-bold">
          <XCircle /> Enlace inválido o sin token de seguridad.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
        <h2 className="text-2xl font-black text-[#062e3a] mb-2 text-center">
          Nueva Contraseña
        </h2>

        <form onSubmit={hook.handleResetPassword} className="space-y-6 mt-6">
          <p className="text-sm text-[#342c1e] text-center font-medium">
            Escribe tu nueva contraseña. Asegúrate de que ambas coincidan.
          </p>

          {hook.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-bold animate-shake">
              {hook.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#062e3a] mb-1">
              Nueva Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#367933]" />
              </div>
              <input
                type={hook.showPassword ? "text" : "password"}
                required
                value={hook.newPassword}
                onChange={(e) => hook.setNewPassword(e.target.value)}
                disabled={hook.cargando}
                minLength={6}
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#367933] outline-none transition-all disabled:bg-gray-100"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => hook.setShowPassword(!hook.showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#367933] transition-colors"
                tabIndex="-1"
              >
                {hook.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#062e3a] mb-1">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#367933]" />
              </div>
              <input
                type={hook.showConfirmPassword ? "text" : "password"}
                required
                value={hook.confirmPassword}
                onChange={(e) => hook.setConfirmPassword(e.target.value)}
                disabled={hook.cargando}
                minLength={6}
                onPaste={(e) => {
                  e.preventDefault();
                  alert("Por seguridad, no puedes pegar en este campo.");
                }}
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#367933] outline-none transition-all disabled:bg-gray-100"
                placeholder="Repite la contraseña"
              />
              <button
                type="button"
                onClick={() =>
                  hook.setShowConfirmPassword(!hook.showConfirmPassword)
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#367933] transition-colors"
                tabIndex="-1"
              >
                {hook.showConfirmPassword ? (
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
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md shadow-[#367933]/20 font-bold text-white bg-[#367933] hover:bg-[#006633] transition-colors disabled:bg-[#367933]/50 disabled:shadow-none"
          >
            {hook.cargando ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Guardando...
              </>
            ) : (
              "Guardar contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
