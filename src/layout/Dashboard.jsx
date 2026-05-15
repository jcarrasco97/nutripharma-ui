import React, { useState } from "react";
import { Activity } from "lucide-react";

import { useDashboard } from "./hooks/useDashboard";
import AppSidebar from "./AppSidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/Sidebar";
import { TooltipProvider } from "@/shared/components/ui/Tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/components/ui/HoverCard";

import {
  ConsultasPage,
  HistorialFarmaciaPage,
  AdminRendimientoPage,       // ← ahora mapea a "rendimiento"
  DashboardFarmaciaPage,
  DashboardNutriPage,
  ValidacionesConsultasPage,
  ValidacionesSuministrosPage,
} from "@/modules/operations";

import { AdministracionPage } from "@/modules/organization";
import { DocumentacionPage } from "@/modules/documents";
import { PedidosPage, SuministrosPage } from "@/modules/sales";
import { useIsMobile } from "@/shared/hooks/use-mobile";

import AdminCalendarioPage from "@/modules/operations/dashboard/pages/AdminCalendarioPage";
import AdminInformesPage from "@/modules/operations/dashboard/pages/AdminInformesPage";

// ─── TOP HEADER ──────────────────────────────────────────────────────────────
const TopHeader = ({ tituloVistaActual, hook }) => {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const [isHoverMenuOpen, setIsHoverMenuOpen] = useState(false);
  const showHoverMenu = state === "collapsed" && !isMobile;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 bg-transparent px-4 z-10 border-b border-neutral/5">
      {showHoverMenu ? (
        <HoverCard open={isHoverMenuOpen} onOpenChange={setIsHoverMenuOpen} openDelay={150} closeDelay={200}>
          <HoverCardTrigger asChild>
            <SidebarTrigger className="text-neutral/40 hover:text-secondary transition-colors" />
          </HoverCardTrigger>
          <HoverCardContent
            side="bottom" align="start" sideOffset={12}
            className="w-56 p-2 bg-surface border-neutral/10 shadow-xl rounded-xl z-50 flex flex-col gap-1"
          >
            <span className="text-[10px] font-bold text-neutral/40 tracking-widest uppercase mb-1 px-2 mt-1">
              Navegación Rápida
            </span>
            {hook.menuItems.map((item) => {
              const isActive = hook.vistaActual === item.id;
              const Icono = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { hook.setVistaActual(item.id); setIsHoverMenuOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-all duration-200 ${isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "bg-transparent text-neutral/70 font-medium hover:bg-neutral/10 hover:text-secondary"
                    }`}
                >
                  <Icono size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </HoverCardContent>
        </HoverCard>
      ) : (
        <SidebarTrigger className="text-neutral/40 hover:text-secondary transition-colors" />
      )}
      <div className="w-px h-4 bg-neutral/20 mx-2" />
      <span className="font-semibold text-[14px] text-secondary">{tituloVistaActual}</span>
    </header>
  );
};



// ─── DASHBOARD PRINCIPAL ──────────────────────────────────────────────────────
const Dashboard = () => {
  const hook = useDashboard();
  if (!hook.usuario) return null;

  const tituloVistaActual =
    hook.menuItems.find((item) => item.id === hook.vistaActual)?.label ||
    "Dashboard";

  return (
    <TooltipProvider>
      <SidebarProvider className="flex h-screen overflow-hidden w-full bg-background">
        <AppSidebar hook={hook} />
        <SidebarInset className="flex flex-col flex-1 bg-surface overflow-hidden md:m-2 md:rounded-2xl border border-neutral/10 shadow-sm transition-all duration-300">
          <TopHeader tituloVistaActual={tituloVistaActual} hook={hook} />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">

            {/* ── NUTRICIONISTA ── */}
            {hook.vistaActual === "resumen" && hook.isNutricionista && <DashboardNutriPage />}

            {/* ── FARMACIA ── */}
            {hook.vistaActual === "resumen-farmacia" && hook.isFarmacia && <DashboardFarmaciaPage />}

            {/* ── ADMIN: grupo Inicio ── */}
            {hook.vistaActual === "rendimiento" && hook.isAdmin && <AdminRendimientoPage setVistaActual={hook.setVistaActual} />}
            {hook.vistaActual === "calendario" && hook.isAdmin && <AdminCalendarioPage setVistaActual={hook.setVistaActual} />}
            {hook.vistaActual === "informes" && hook.isAdmin && <AdminInformesPage />}

            {/* ── ADMIN: grupo Área de trabajo ── */}
            {hook.vistaActual === "validaciones-consultas" && <ValidacionesConsultasPage />}
            {hook.vistaActual === "validaciones-suministros" && <ValidacionesSuministrosPage />}

            {/* ── COMPARTIDOS ── */}
            {hook.vistaActual === "pedidos" && <PedidosPage />}
            {hook.vistaActual === "consultas" && <ConsultasPage />}
            {hook.vistaActual === "suministros" && <SuministrosPage />}
            {hook.vistaActual === "documentacion" && <DocumentacionPage />}
            {hook.vistaActual === "historial-farmacia" && <HistorialFarmaciaPage />}
            {hook.vistaActual === "usuarios" && <AdministracionPage />}

            {/* ── FALLBACK ── */}
            {![
              "resumen", "resumen-farmacia",
              "rendimiento", "calendario", "informes",
              "validaciones-consultas", "validaciones-suministros",
              "pedidos", "consultas", "suministros",
              "documentacion", "historial-farmacia", "usuarios",
            ].includes(hook.vistaActual) && (
                <div className="bg-surface rounded-2xl shadow-sm border border-neutral/10 p-8 min-h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity size={48} className="mx-auto text-[#b1cb0c] mb-4" />
                    <h3 className="text-xl font-bold text-[#062e3a]">Módulo en construcción</h3>
                    <p className="text-[#342c1e] mt-2">
                      Vista: <span className="font-bold text-[#367933]">{hook.vistaActual}</span>
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