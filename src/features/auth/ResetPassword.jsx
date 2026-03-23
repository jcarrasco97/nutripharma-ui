import React, { useState } from "react";
import { Lock, Loader2, Eye, EyeOff, XCircle } from "lucide-react";
import { authService } from "./authService";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  if (!token)
    return (
      <div className="flex justify-center mt-20 p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 font-bold">
          <XCircle />
          Enlace inválido o sin token de seguridad.
        </div>
      </div>
    );

  const handleReset = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, verifícalas.");
      setCargando(false);
      return;
    }

    try {
      await authService.cambiarPassword(token, password);

      // REDIRECCIÓN INMEDIATA Y BLOQUEO DE RETORNO
      // 'replace: true' borra esta página del historial.
      // 'state' pasa un mensaje secreto al Login para que muestre el aviso verde.
      navigate("/", { replace: true, state: { resetExitoso: true } });
    } catch (err) {
      console.error("Error al guardar nueva contraseña:", err);
      // Si el usuario recarga la página o usa un enlace viejo, el backend lanzará error.
      setError("Este enlace ya ha sido utilizado o ha caducado por seguridad.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
        <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
          Nueva Contraseña
        </h2>

        <form onSubmit={handleReset} className="space-y-6 mt-6">
          <p className="text-sm text-gray-500 text-center">
            Escribe tu nueva contraseña. Asegúrate de que ambas coincidan.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-bold animate-shake">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-sky-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={cargando}
                minLength={6}
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all disabled:bg-gray-100"
                placeholder="Mínimo 6 caracteres"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-sky-500" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={cargando}
                minLength={6}
                onPaste={(e) => {
                  e.preventDefault();
                  alert("Por seguridad, no puedes pegar en este campo.");
                }}
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all disabled:bg-gray-100"
                placeholder="Repite la contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sky-600"
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors disabled:bg-sky-300"
          >
            {cargando ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Guardando...
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
