import React from "react";
import { Menu, Activity } from "lucide-react";
import logoUrl from "@/assets/logo.svg";

// --- HOOKS Y COMPONENTES GLOBALES ---
import { useDashboard } from "./hooks/useDashboard";
import Sidebar from "./Sidebar";

// --- IMPORTACIONES MAESTRAS DE LOS MÓDULOS (Feature-First) ---
import {
  ConsultasPage, HistorialFarmaciaPage,
  DashboardAdminPage, DashboardFarmaciaPage, DashboardNutriPage,
  ValidacionesPage
} from "@/modules/operations";

import { AdministracionPage, PersonalInternoPage } from "@/modules/organization";
import { DocumentacionPage } from "@/modules/documents";
import { PedidosPage, SuministrosPage, SuministrosAdminPage } from "@/modules/sales";

const Dashboard = () => {
  const hook = useDashboard();

  if (!hook.usuario) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans overflow-hidden">
      {/* SIDEBAR COMPONENTE AisLADO */}
      <Sidebar
        usuario={hook.usuario}
        menuAbierto={hook.menuAbierto}
        setMenuAbierto={hook.setMenuAbierto}
        vistaActual={hook.vistaActual}
        setVistaActual={hook.setVistaActual}
        menuItems={hook.menuItems}
        handleLogout={hook.handleLogout}
        isAdmin={hook.isAdmin}
        isNutricionista={hook.isNutricionista}
        isFarmacia={hook.isFarmacia}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300 z-10">
        {/* HEADER MÓVIL */}
        <header className="md:hidden bg-surface border-b border-neutral/10 text-neutral p-4 flex justify-between items-center z-20 shadow-sm">
          <div className="flex items-center">
            <img src={logoUrl} alt="NutriPharma Logo" className="h-8 w-auto" />
          </div>
          <button
            onClick={() => hook.setMenuAbierto(!hook.menuAbierto)}
            className="p-2 bg-neutral/5 rounded-lg hover:bg-neutral/10 transition-colors text-neutral"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* ÁREA DE RENDERIZADO DE LAS VISTAS (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-0">
          {/* 👇 CIRUGÍA: Protegemos las vistas por ROL para evitar el 403 del backend 👇 */}
          {hook.vistaActual === "resumen" && hook.isNutricionista ? (
            <DashboardNutriPage />
          ) : hook.vistaActual === "resumen-farmacia" && hook.isFarmacia ? (
            <DashboardFarmaciaPage />
          ) : hook.vistaActual === "resumen-admin" && hook.isAdmin ? (
            <DashboardAdminPage setVistaActual={hook.setVistaActual} />
          ) : hook.vistaActual === "consultas" ? (
            <ConsultasPage />
          ) : hook.vistaActual === "pedidos" ? (
            <PedidosPage />
          ) : hook.vistaActual === "documentacion" ? (
            <DocumentacionPage />
          ) : hook.vistaActual === "suministros" ? (
            <SuministrosPage />
          ) : hook.vistaActual === "validaciones" ? (
            <ValidacionesPage />
          ) : hook.vistaActual === "admin-suministros" ? (
            <SuministrosAdminPage />
          ) : hook.vistaActual === "historial-farmacia" ? (
            <HistorialFarmaciaPage />
          ) : hook.vistaActual === "usuarios" ? (
            <AdministracionPage />
          ) : hook.vistaActual === "personal-interno" ? (
            <PersonalInternoPage />
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
          className="fixed inset-0 bg-neutral/40 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => hook.setMenuAbierto(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;