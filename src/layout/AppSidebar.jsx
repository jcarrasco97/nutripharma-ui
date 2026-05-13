import React, { useState } from "react";
import {
  LogOut, Activity, Stethoscope, ShoppingCart,
  PackageOpen, Settings, FileText, ChevronDown,
  Package, FileBox, Calculator,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/shared/components/ui/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/shared/components/ui/Dialog";
import { Button } from "@/shared/components/ui/Button";

// ─── CLASES 100% LINEAR (Ultra compactas y sutiles) ───
const NAV_BASE =
  "h-8 text-[13px] transition-colors duration-150 font-medium " +
  "!bg-transparent !text-neutral/70 rounded-md " +
  "hover:!bg-neutral/10 hover:!text-secondary";

const NAV_ACTIVE =
  "h-8 text-[13px] transition-colors duration-150 font-semibold " +
  "!bg-neutral/10 !text-secondary rounded-md"; // Gris sutil, no color primario

// ─── Componente principal ────────────────────────────────────────────────────
const AppSidebar = ({ hook }) => {
  const { setOpenMobile } = useSidebar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const rolLabel = hook.isAdmin
    ? "Admin"
    : hook.isFarmacia
      ? "Farmacia"
      : "Nutricionista";

  // Extraemos iniciales para el icono tipo Linear
  const nombreReal = hook.usuario?.nombre || "Usuario";
  const iniciales = nombreReal.substring(0, 2).toUpperCase();

  // ─── ESTRATEGIA DE REFACTORIZACIÓN (Strangler Fig Pattern) ───

  const rutasTerminadas = ['usuarios', 'documentacion'];
  const legacyItems = hook.menuItems.filter(item => !rutasTerminadas.includes(item.id));
  const empresaItems = hook.menuItems.filter(item => rutasTerminadas.includes(item.id));

  // 2. NUEVA ESTRUCTURA VISUAL: Operaciones (rutas nuevas independientes)
  const operacionesItems = hook.isAdmin ? [
    { id: "validaciones-consultas", label: "Consultas", icon: Stethoscope },
    { id: "validaciones-pedidos", label: "Pedidos", icon: Package },
    { id: "validaciones-suministros", label: "Material", icon: FileBox },
  ] : [];

  // 3. CONTABILIDAD (solo para admin)
  const contabilidadItems = hook.isAdmin ? [
    { id: "cierre-caja", label: "Cierre de Caja", icon: Calculator },
  ] : [];


  return (
    <>
      <Sidebar collapsible="offcanvas" className="border-none !bg-transparent">

        {/* ── HEADER TIPO LINEAR (Workspace Switcher) ── */}
        <SidebarHeader className="!bg-transparent pt-4 pb-2 px-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 w-full hover:bg-neutral/5 p-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                {/* Cuadrado de color sólido con iniciales */}
                <div className="w-5 h-5 rounded-md bg-[#e24a8d] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                  {iniciales}
                </div>
                <div className="flex flex-col items-start truncate flex-1">
                  <span className="text-[13px] font-bold text-secondary leading-none">
                    {nombreReal}
                  </span>
                  <span className="text-[10px] text-neutral/50 font-medium leading-none mt-1">
                    {rolLabel} Workspace
                  </span>
                </div>
                <ChevronDown size={14} className="text-neutral/40 shrink-0" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56 rounded-xl border-neutral/10 shadow-lg mt-1 p-1.5">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs font-bold text-secondary">{hook.usuario?.email || "usuario@nutripharma.com"}</p>
                <p className="text-[10px] text-neutral/50">Nutripharma ERP</p>
              </div>
              <DropdownMenuSeparator className="bg-neutral/10" />
              <DropdownMenuItem
                className="text-secondary focus:bg-neutral/5 text-[13px] font-medium gap-2 cursor-pointer rounded-md py-1.5"
              >
                <Settings size={14} /> Preferencias
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral/10" />
              {/* Al hacer clic, abrimos el modal de confirmación y cerramos el Dropdown */}
              <DropdownMenuItem
                onSelect={() => setShowLogoutDialog(true)}
                className="text-red-600 focus:bg-red-50 focus:text-red-700 font-medium text-[13px] gap-2 cursor-pointer rounded-md py-1.5"
              >
                <LogOut size={14} /> Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>

        {/* ── NAVEGACIÓN ── */}
        <SidebarContent className="px-3 pt-2 gap-5">

          {/* GRUPO 1: Vistas Legacy */}
          {legacyItems.length > 0 && (
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {legacyItems.map((item) => {
                    const isActive = hook.vistaActual === item.id;
                    const Icono = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={isActive}
                          onClick={() => {
                            hook.setVistaActual(item.id);
                            setOpenMobile(false);
                          }}
                          className={isActive ? NAV_ACTIVE : NAV_BASE}
                        >
                          <Icono size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* GRUPO 2: Operaciones (NUEVO DISEÑO) */}
          {operacionesItems.length > 0 && (
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="text-[10px] font-bold text-neutral/40 tracking-widest uppercase mb-1 px-2">
                Operaciones
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {operacionesItems.map((item) => {
                    const isActive = hook.vistaActual === item.id;
                    const Icono = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={isActive}
                          onClick={() => {
                            hook.setVistaActual(item.id);
                            setOpenMobile(false);
                          }}
                          className={isActive ? NAV_ACTIVE : NAV_BASE}
                        >
                          <Icono size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* GRUPO 3: Contabilidad */}
          {contabilidadItems.length > 0 && (
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="text-[10px] font-bold text-neutral/40 tracking-widest uppercase mb-1 px-2">
                Contabilidad
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {contabilidadItems.map((item) => {
                    const isActive = hook.vistaActual === item.id;
                    const Icono = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={isActive}
                          onClick={() => {
                            hook.setVistaActual(item.id);
                            setOpenMobile(false);
                          }}
                          className={isActive ? NAV_ACTIVE : NAV_BASE}
                        >
                          <Icono size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* GRUPO 4: Empresa (TERMINADO) */}
          {empresaItems.length > 0 && (
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="text-[10px] font-bold text-neutral/40 tracking-widest uppercase mb-1 px-2">
                Empresa
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {empresaItems.map((item) => {
                    const isActive = hook.vistaActual === item.id;
                    const Icono = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          tooltip={item.label}
                          isActive={isActive}
                          onClick={() => {
                            hook.setVistaActual(item.id);
                            setOpenMobile(false);
                          }}
                          className={isActive ? NAV_ACTIVE : NAV_BASE}
                        >
                          <Icono size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

        </SidebarContent>
        {/* El SidebarFooter ya no existe. Todo está arriba. */}
      </Sidebar>

      {/* ── DIALOG DE CERRAR SESIÓN (Extraído fuera del menú desplegable para no dar errores) ── */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>¿Cerrar sesión?</DialogTitle>
            <DialogDescription>
              Se cerrará la sesión actual y tendrás que volver a ingresar tus credenciales de acceso.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl border-neutral/20">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={hook.handleLogout} className="rounded-xl">
              Cerrar Sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppSidebar;