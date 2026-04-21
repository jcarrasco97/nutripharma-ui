import React from "react";
import { Activity, LogOut } from "lucide-react";

const Sidebar = ({
  usuario,
  menuAbierto,
  setMenuAbierto,
  vistaActual,
  setVistaActual,
  menuItems,
  handleLogout,
  isAdmin,
  isNutricionista,
  isFarmacia,
}) => {
  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* HEADER AZUL CORPORATIVO */}
      <div className="h-20 flex items-center px-8 border-b border-[#062e3a]/10 bg-[#062e3a] text-white">
        <Activity size={28} className="mr-3 text-[#b1cb0c]" />
        <h1 className="text-2xl font-bold tracking-tight">NutriPharma</h1>
      </div>

      {/* INFO USUARIO */}
      <div className="p-6 border-b border-gray-100 bg-[#f4f7f4]">
        <p className="text-xs text-[#367933] font-bold uppercase tracking-wider mb-1">
          Conectado como
        </p>
        <p
          className="text-sm font-medium text-[#062e3a] truncate"
          title={usuario.email}
        >
          {usuario.email}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {isNutricionista && (
            <span className="bg-[#b1cb0c]/20 text-[#367933] text-xs px-2 py-1 rounded-md font-bold">
              Nutricionista
            </span>
          )}
          {isFarmacia && (
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md font-bold">
              Farmacia
            </span>
          )}
          {isAdmin && (
            <span className="bg-[#062e3a]/10 text-[#062e3a] text-xs px-2 py-1 rounded-md font-bold">
              Administrador
            </span>
          )}
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icono = item.icon;
          const activo = vistaActual === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setVistaActual(item.id);
                setMenuAbierto(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                activo
                  ? "bg-[#b1cb0c]/20 text-[#367933] font-bold shadow-sm"
                  : "text-[#342c1e] hover:bg-gray-50 hover:text-[#062e3a] font-medium"
              }`}
            >
              <Icono
                size={20}
                className={`mr-3 transition-colors ${activo ? "text-[#367933]" : "text-gray-400"}`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* CERRAR SESIÓN */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors"
        >
          <LogOut size={20} className="mr-2" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
