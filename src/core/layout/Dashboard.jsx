import React from "react";
import { Menu, Activity } from "lucide-react";

// --- HOOKS Y COMPONENTES ---
import { useDashboard } from "./hooks/useDashboard";
import Sidebar from "./components/Sidebar";

// --- IMPORTACIONES DE VISTAS (Features) ---
import VistaResumen from "../../features/analytics/views/VistaResumen";
import VistaResumenFarmacia from "../../features/analytics/views/VistaResumenFarmacia";
import VistaResumenAdmin from "../../features/analytics/views/VistaResumenAdmin";
import VistaConsultas from "../../features/consultas/views/VistaConsultas";
import VistaHistorialFarmacia from "../../features/consultas/views/VistaHistorialFarmacia";
import VistaPedidos from "../../features/pedidos/views/VistaPedidos";
import VistaSuministros from "../../features/suministros/views/VistaSuministros";
import VistaAdminSuministros from "../../features/suministros/views/VistaAdminSuministros";
import VistaDocumentacion from "../../features/documentacion/views/VistaDocumentacion";
import VistaValidaciones from "../../features/validaciones/views/VistaValidaciones";
import VistaAdministracion from "../../features/administracion/views/VistaAdministracion";
import VistaPersonalInterno from "../../features/administracion/views/VistaPersonalInterno";

const Dashboard = () => {
  const hook = useDashboard();

  if (!hook.usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* BOTÓN MOBILE HAMBURGUESA */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#367933] text-white rounded-lg shadow-md"
        onClick={() => hook.setMenuAbierto(!hook.menuAbierto)}
      >
        <Menu size={24} />
      </button>

      {/* MENÚ LATERAL EXTERNALIZADO */}
      <Sidebar {...hook} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* TOPBAR DESKTOP */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 hidden md:flex">
          <h2 className="text-2xl font-bold text-[#062e3a] capitalize">
            {hook.vistaActual.replace("-", " ")}
          </h2>
        </header>

        {/* ÁREA DE RENDERIZADO DE VISTAS */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#f4f7f4]/30">
          {hook.vistaActual === "resumen-admin" ? (
            <VistaResumenAdmin />
          ) : hook.vistaActual === "resumen" ? (
            hook.isFarmacia ? (
              <VistaResumenFarmacia cambiarVista={hook.setVistaActual} />
            ) : (
              <VistaResumen />
            )
          ) : hook.vistaActual === "consultas" ? (
            <VistaConsultas />
          ) : hook.vistaActual === "pedidos" ? (
            <VistaPedidos />
          ) : hook.vistaActual === "suministros" ? (
            <VistaSuministros />
          ) : hook.vistaActual === "documentacion" ? (
            <VistaDocumentacion />
          ) : hook.vistaActual === "validaciones" ? (
            <VistaValidaciones />
          ) : hook.vistaActual === "admin-suministros" ? (
            <VistaAdminSuministros />
          ) : hook.vistaActual === "historial-farmacia" ? (
            <VistaHistorialFarmacia />
          ) : hook.vistaActual === "usuarios" ? (
            <VistaAdministracion />
          ) : hook.vistaActual === "personal-interno" ? (
            <VistaPersonalInterno />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] flex items-center justify-center">
              <div className="text-center">
                <Activity size={48} className="mx-auto text-[#b1cb0c] mb-4" />
                <h3 className="text-xl font-bold text-[#062e3a]">
                  Módulo en construcción
                </h3>
                <p className="text-[#342c1e] mt-2">
                  Estás en la vista:{" "}
                  <span className="font-bold text-[#367933]">
                    {hook.vistaActual}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* OVERLAY MOBILE PARA CERRAR EL MENÚ AL HACER CLIC FUERA */}
      {hook.menuAbierto && (
        <div
          className="fixed inset-0 bg-[#062e3a]/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => hook.setMenuAbierto(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
