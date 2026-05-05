import React from "react";
import { LogOut } from "lucide-react";
import logoUrl from "@/assets/logo.svg";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/shared/components/ui/Sidebar";
import { Badge } from "@/shared/components/ui/Badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/components/ui/Dialog";

import { Button } from "@/shared/components/ui/Button";

// ─── CLASES "NUCLEARES" (Con ! para forzar el override) ───

const NAV_BASE =
  "h-11 text-[15px] transition-all duration-200 font-medium " +
  "!bg-transparent !text-neutral/70 " +
  "hover:!bg-neutral/10 hover:!text-secondary";

const NAV_ACTIVE =
  "h-11 text-[15px] transition-all duration-200 font-bold " +
  "!bg-primary/10 !text-primary " +
  "hover:!bg-primary/15 hover:!text-primary";

const LOGOUT_BTN =
  "h-11 text-[15px] transition-all duration-200 font-bold w-full " +
  "!bg-transparent !text-destructive " +
  "hover:!bg-destructive/10 hover:!text-destructive";

// ─── Componente principal ────────────────────────────────────────────────────
const AppSidebar = ({ hook }) => {
  const { setOpenMobile } = useSidebar();

  const rolLabel = hook.isAdmin
    ? "Admin"
    : hook.isFarmacia
      ? "Farmacia"
      : "Nutricionista";

  return (
    <Sidebar collapsible="icon" className="border-r border-neutral/10 bg-background">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <SidebarHeader className="bg-background">
        <div className="flex items-center gap-3 px-3 py-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
          <img src={logoUrl} alt="Logo NutriPharma" className="size-10 shrink-0" />
          <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium text-secondary leading-none">
              Nutripharma
            </span>
            <Badge variant="accent" className="h-4 py-0 text-[8px] uppercase w-fit">
              {rolLabel}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      {/* ── NAVEGACIÓN ─────────────────────────────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-3">
            {hook.menuItems.map((item) => {
              const isActive = hook.vistaActual === item.id;
              const Icono = item.icon;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={isActive}
                    onClick={() => {
                      hook.setVistaActual(item.id);
                      // Auto-cierre en móvil: el menú se pliega al seleccionar
                      setOpenMobile(false);
                    }}
                    className={isActive ? NAV_ACTIVE : NAV_BASE}
                  >
                    {/* Icono: tamaño 22 para que luzca bien en el panel minimizado */}
                    <Icono size={22} className="shrink-0" />

                    {/* Label: oculto en modo colapsado (solo icono) */}
                    <span className="group-data-[collapsible=icon]:hidden truncate">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── FOOTER — CERRAR SESIÓN CON CONFIRMACIÓN ────────────────────────── */}
      <SidebarFooter>
        <Dialog>
          <SidebarMenu>
            <SidebarMenuItem>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Cerrar Sesión"
                  className={LOGOUT_BTN}
                >
                  <LogOut size={22} className="shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden truncate">
                    Cerrar Sesión
                  </span>
                </SidebarMenuButton>
              </DialogTrigger>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* ── Dialog de confirmación ── */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Estás seguro que deseas salir?</DialogTitle>
              <DialogDescription>
                Se cerrará la sesión actual y tendrás que volver a ingresar tus
                credenciales.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={hook.handleLogout}>
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarFooter>

    </Sidebar>
  );
};

export default AppSidebar;