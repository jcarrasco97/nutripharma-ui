import React from "react";
import { Activity } from "lucide-react";

// --- HOOKS Y COMPONENTES GLOBALES ---
import { useDashboard } from "./hooks/useDashboard";
import AppSidebar from "./AppSidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/shared/components/ui/Sidebar";
import { TooltipProvider } from "@/shared/components/ui/Tooltip";

// --- IMPORTACIONES MAESTRAS DE LOS MÓDULOS (Feature-First) ---
import {
  ConsultasPage, HistorialFarmaciaPage,
  DashboardAdminPage, DashboardFarmaciaPage, DashboardNutriPage,
  ValidacionesPage
} from "@/modules/operations";

import { AdministracionPage } from "@/modules/organization";
import { DocumentacionPage } from "@/modules/documents";
import { PedidosPage, SuministrosPage, SuministrosAdminPage } from "@/modules/sales";

const Dashboard = () => {
  const hook = useDashboard();

  if (!hook.usuario) return null;

  const tituloVistaActual = hook.menuItems.find(item => item.id === hook.vistaActual)?.label || "Dashboard";

  return (
    <TooltipProvider>
      <SidebarProvider className="flex h-screen overflow-hidden w-full">

        {/* Renderizamos el nuevo Sidebar (inamovible) */}
        <AppSidebar hook={hook} />

        {/* Renderizamos el área principal (deslizable) */}
        {/* 👇 FIX 1: Cambiamos bg-surface por bg-background para que el lienzo sea gris */}
        <SidebarInset className="flex flex-col flex-1 bg-background overflow-hidden">

          {/* HEADER DEL INSET (Fijo arriba) */}
          {/* 👇 FIX 2: Cambiamos bg-surface por bg-background para que la cabecera se funda con el fondo */}
          <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4 z-10">
            <SidebarTrigger className="text-neutral/70 hover:text-primary transition-colors" />
            <div className="w-px h-4 bg-neutral/20 mx-2" />

            <span className="font-semibold text-[15px] text-secondary">
              {tituloVistaActual}
            </span>
          </header>

          {/* MAIN CONTENT (El único que scrollea) */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
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
            ) : (
              <div className="bg-surface rounded-2xl shadow-sm border border-neutral/10 p-8 min-h-[500px] flex items-center justify-center">                <div className="text-center">
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
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default Dashboard;