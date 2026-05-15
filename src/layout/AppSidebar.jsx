import React, { useState } from "react";
import { LogOut, Settings, ChevronDown, ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/shared/components/ui/Sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/shared/components/ui/Collapsible";
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

// ─── CLASES DE NAVEGACIÓN ─────────────────────────────────────────────────────
const NAV_BASE =
  "h-8 text-[13px] transition-colors duration-150 font-medium " +
  "!bg-transparent !text-neutral/70 rounded-md " +
  "hover:!bg-neutral/10 hover:!text-secondary";

const NAV_ACTIVE =
  "h-8 text-[13px] transition-colors duration-150 font-semibold " +
  "!bg-neutral/10 !text-secondary rounded-md";

// ─── Cabecera de grupo colapsable ─────────────────────────────────────────────
// CollapsibleTrigger de Shadcn gestiona el estado abierto/cerrado.
// La flecha hereda la rotación del estado del padre via prop isOpen.
const GroupTrigger = ({ label, isOpen }) => (
  <CollapsibleTrigger className="flex items-center gap-1.5 w-full px-2 py-1 mb-0.5 rounded-md text-[11px] font-bold text-neutral/40 tracking-widest uppercase hover:text-neutral/60 hover:bg-neutral/5 transition-colors duration-150">
    <ChevronRight
      size={11}
      strokeWidth={2.5}
      className={
        "shrink-0 transition-transform duration-200 " +
        (isOpen ? "rotate-90" : "rotate-0")
      }
    />
    {label}
  </CollapsibleTrigger>
);

// ─── Lista de ítems de navegación ────────────────────────────────────────────
const NavGroup = ({ items, vistaActual, setVistaActual, setOpenMobile }) => (
  <SidebarMenu className="gap-0.5">
    {items.map((item) => {
      const isActive = vistaActual === item.id;
      const Icono = item.icon;
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            tooltip={item.label}
            isActive={isActive}
            onClick={() => {
              setVistaActual(item.id);
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
);

// ─── Componente principal ──────────────────────────────────────────────────────
const AppSidebar = ({ hook }) => {
  const { setOpenMobile } = useSidebar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Estado de apertura de cada grupo. Todos abiertos por defecto.
  const [openGroups, setOpenGroups] = useState({
    inicio: true,
    trabajo: true,
  });

  const toggleGroup = (key) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // ─── Metadatos de usuario ────────────────────────────────────────────────
  const rolLabel = hook.isAdmin
    ? "Admin"
    : hook.isFarmacia
      ? "Farmacia"
      : "Nutricionista";

  const nombreReal = hook.usuario?.nombre || "Usuario";
  const iniciales = nombreReal.substring(0, 2).toUpperCase();

  // ─── Clasificación de IDs por grupo ──────────────────────────────────────
  const inicioIds = ["rendimiento", "calendario", "informes"];
  const resumenIds = ["resumen", "resumen-farmacia"];

  // Área de trabajo varía por rol
  const trabajoIds = hook.isAdmin
    ? ["validaciones-consultas", "pedidos", "validaciones-suministros"]
    : hook.isFarmacia
      ? ["pedidos", "historial-farmacia"]
      : ["pedidos", "consultas", "suministros"]; // nutricionista

  const empresaIds = ["usuarios", "documentacion"];

  const inicioItems = hook.menuItems.filter((i) => inicioIds.includes(i.id));
  const resumenItems = hook.menuItems.filter((i) => resumenIds.includes(i.id));
  const trabajoItems = hook.menuItems.filter((i) => trabajoIds.includes(i.id));
  const empresaItems = hook.menuItems.filter((i) => empresaIds.includes(i.id));

  const todosGestionados = [...inicioIds, ...resumenIds, ...trabajoIds, ...empresaIds];
  const otrosItems = hook.menuItems.filter((i) => !todosGestionados.includes(i.id));

  const navProps = {
    vistaActual: hook.vistaActual,
    setVistaActual: hook.setVistaActual,
    setOpenMobile,
  };

  return (
    <>
      <Sidebar collapsible="offcanvas" className="border-none !bg-transparent">

        {/* ── HEADER: Workspace Switcher ── */}
        <SidebarHeader className="!bg-transparent pt-4 pb-2 px-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 w-full hover:bg-neutral/5 p-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
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
                <p className="text-xs font-bold text-secondary">
                  {hook.usuario?.email || "usuario@nutripharma.com"}
                </p>
                <p className="text-[10px] text-neutral/50">Nutripharma ERP</p>
              </div>
              <DropdownMenuSeparator className="bg-neutral/10" />
              <DropdownMenuItem className="text-secondary focus:bg-neutral/5 text-[13px] font-medium gap-2 cursor-pointer rounded-md py-1.5">
                <Settings size={14} /> Preferencias
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral/10" />
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
        <SidebarContent className="px-3 pt-2 gap-0">

          {/* ════════════════════════════════
              RAMA ADMIN
          ════════════════════════════════ */}
          {hook.isAdmin && (
            <>
              {/* GRUPO: Inicio (colapsable) */}
              {inicioItems.length > 0 && (
                <Collapsible
                  open={openGroups.inicio}
                  onOpenChange={() => toggleGroup("inicio")}
                  className="mb-1"
                >
                  <SidebarGroup className="p-0">
                    <GroupTrigger label="Inicio" isOpen={openGroups.inicio} />
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <NavGroup items={inicioItems} {...navProps} />
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              )}

              {/* GRUPO: Área de trabajo (colapsable) */}
              {trabajoItems.length > 0 && (
                <Collapsible
                  open={openGroups.trabajo}
                  onOpenChange={() => toggleGroup("trabajo")}
                  className="mb-1"
                >
                  <SidebarGroup className="p-0">
                    <GroupTrigger label="Área de trabajo" isOpen={openGroups.trabajo} />
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <NavGroup items={trabajoItems} {...navProps} />
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              )}

              {/* Administración + Documentación — planos, sin separador, sin grupo */}
              {empresaItems.length > 0 && (
                <SidebarGroup className="p-0 mt-1">
                  <SidebarGroupContent>
                    <NavGroup items={empresaItems} {...navProps} />
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </>
          )}

          {/* ════════════════════════════════
              RAMA NUTRICIONISTA / FARMACIA
          ════════════════════════════════ */}
          {!hook.isAdmin && (
            <>
              {/* Resumen — ítem plano, sin grupo (es único) */}
              {resumenItems.length > 0 && (
                <SidebarGroup className="p-0 mb-1">
                  <SidebarGroupContent>
                    <NavGroup items={resumenItems} {...navProps} />
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {/* GRUPO: Área de trabajo (colapsable — igual que admin) */}
              {trabajoItems.length > 0 && (
                <Collapsible
                  open={openGroups.trabajo}
                  onOpenChange={() => toggleGroup("trabajo")}
                  className="mb-1"
                >
                  <SidebarGroup className="p-0">
                    <GroupTrigger label="Área de trabajo" isOpen={openGroups.trabajo} />
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <NavGroup items={trabajoItems} {...navProps} />
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              )}

              {/* Ítems no clasificados (por si los hubiera) */}
              {otrosItems.length > 0 && (
                <SidebarGroup className="p-0 mb-1">
                  <SidebarGroupContent>
                    <NavGroup items={otrosItems} {...navProps} />
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {/* Documentación — plana, sin separador */}
              {empresaItems.length > 0 && (
                <SidebarGroup className="p-0 mt-1">
                  <SidebarGroupContent>
                    <NavGroup items={empresaItems} {...navProps} />
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </>
          )}

        </SidebarContent>
      </Sidebar>

      {/* ── DIALOG: Cerrar sesión ── */}
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