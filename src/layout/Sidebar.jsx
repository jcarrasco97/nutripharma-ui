import React from "react";
import { Activity, LogOut } from "lucide-react";
import logoUrl from "@/assets/logo.svg";

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
      className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-surface border-r border-neutral/10 transform transition-transform duration-300 ease-in-out flex flex-col ${menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* HEADER LOGO */}
      <div 
        className="h-20 flex items-center px-6 border-b border-neutral/10 cursor-pointer" 
        onClick={() => {
            setVistaActual(isAdmin ? "resumen-admin" : isFarmacia ? "resumen-farmacia" : "resumen");
            setMenuAbierto(false);
        }}
      >
        <img src={logoUrl} alt="NutriPharma Logo" className="h-10 w-auto" />
      </div>

      {/* INFO USUARIO */}
      <div className="p-6 border-b border-neutral/10 bg-background/50">
        <p className="text-xs text-neutral/50 font-bold uppercase tracking-wider mb-1">
          Conectado como
        </p>
        <p
          className="text-sm font-semibold text-secondary truncate"
          title={usuario.email}
        >
          {usuario.email}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {isNutricionista && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md font-bold">
              Nutricionista
            </span>
          )}
          {isFarmacia && (
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md font-bold">
              Farmacia
            </span>
          )}
          {isAdmin && (
            <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-md font-bold">
              Administrador
            </span>
          )}
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
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
              className={`w-full flex items-center px-6 py-3 transition-all duration-200 ${
                activo
                  ? "bg-primary/10 text-primary font-bold border-r-4 border-primary"
                  : "text-neutral/70 hover:text-secondary hover:bg-neutral/5 font-medium border-r-4 border-transparent"
              }`}
            >
              <Icono
                size={20}
                className={`mr-3 transition-colors ${activo ? "text-primary" : "text-neutral/50"}`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* CERRAR SESIÓN */}
      <div className="p-4 border-t border-neutral/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl font-bold transition-colors"
        >
          <LogOut size={20} className="mr-2" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
