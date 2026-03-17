import React, { useEffect, useState } from "react";
import {
  LogOut,
  Activity,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  Users,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. INICIALIZACIÓN PEREZOSA (Lazy State)
  // React ejecutará esto UNA SOLA VEZ al construir el componente.
  // Evitamos el doble renderizado (cascading renders).
  const [usuario] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null; // Si no hay token, empezamos nulos

    try {
      const decoded = jwtDecode(token);
      return {
        email: decoded.sub,
        roles: decoded.roles || [],
      };
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      return null; // Si el token está corrupto, empezamos nulos
    }
  });

  // 2. EFECTO SECUNDARIO (Navegación)
  // Si el usuario es null (porque no había token o estaba corrupto), lo expulsamos.
  // Las redirecciones SÍ deben ir en un useEffect.
  useEffect(() => {
    if (!usuario) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [usuario, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 3. PANTALLA DE BLOQUEO
  // Si no hay usuario, no renderizamos el panel (evita errores).
  if (!usuario) {
    return null;
  }

  // --- LÓGICA DE NEGOCIO (Control de Accesos Frontend) ---
  const isAdmin = usuario.roles.includes("ROLE_ADMIN");
  const isNutricionista = usuario.roles.includes("ROLE_NUTRICIONISTA");
  const isFarmacia = usuario.roles.includes("ROLE_FARMACIA");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cabecera del Panel */}
        <div className="bg-sky-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Panel Principal
              </h1>
              <p className="text-sky-100 text-sm flex items-center gap-2 mt-1">
                Conectado como: <strong>{usuario.email}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-sky-700 hover:bg-sky-800 px-4 py-2 rounded-xl text-white font-medium transition-colors"
          >
            <LogOut className="mr-2" size={18} />
            Salir
          </button>
        </div>

        {/* Cuerpo del Panel - Zonas dinámicas */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Módulos Disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ZONA 1: ACCESOS DE ADMINISTRADOR */}
            {isAdmin && (
              <>
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <ShieldCheck className="text-indigo-600 mb-4" size={32} />
                  <h3 className="text-lg font-bold text-indigo-900 mb-2">
                    Validaciones
                  </h3>
                  <p className="text-indigo-700 text-sm">
                    Aprobar pedidos y consultas pendientes.
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <Users className="text-indigo-600 mb-4" size={32} />
                  <h3 className="text-lg font-bold text-indigo-900 mb-2">
                    Gestión de Usuarios
                  </h3>
                  <p className="text-indigo-700 text-sm">
                    Crear nuevas Farmacias o Nutricionistas.
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <Calendar className="text-indigo-600 mb-4" size={32} />
                  <h3 className="text-lg font-bold text-indigo-900 mb-2">
                    Calendario Global
                  </h3>
                  <p className="text-indigo-700 text-sm">
                    Vista general de todas las operaciones.
                  </p>
                </div>
              </>
            )}

            {/* ZONA 2: ACCESOS DE NUTRICIONISTA */}
            {isNutricionista && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                <ClipboardList className="text-emerald-600 mb-4" size={32} />
                <h3 className="text-lg font-bold text-emerald-900 mb-2">
                  Mis Consultas
                </h3>
                <p className="text-emerald-700 text-sm">
                  Crear y gestionar consultas de pacientes.
                </p>
              </div>
            )}

            {/* ZONA 3: ACCESOS COMPARTIDOS (NUTRI Y FARMACIA) */}
            {(isNutricionista || isFarmacia) && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                <ShoppingBag className="text-amber-600 mb-4" size={32} />
                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  Realizar Pedido
                </h3>
                <p className="text-amber-700 text-sm">
                  Solicitud de productos al administrador.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
