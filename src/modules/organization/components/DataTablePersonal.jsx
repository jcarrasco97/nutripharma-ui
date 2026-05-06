import React, { useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { Archive, Edit, Mail, MoreHorizontal, RefreshCw, Shield, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper();

const DataTablePersonal = ({
  data = [], cargando = false, isActivos = true,
  abrirSheetEditar, handleEliminar, handleRestaurar,
  toolbarStart, toolbarEnd,
}) => {
  const columns = useMemo(() => [
    columnHelper.accessor("nombre", {
      id: "nombre", header: "Administrador", enableSorting: true,
      cell: ({ row }) => {
        const a = row.original;
        const initials = `${a.nombre?.charAt(0) ?? ""}${a.apellidos?.charAt(0) ?? ""}`;
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none ${isActivos ? "bg-secondary text-surface" : "bg-neutral/20 text-neutral/50"}`}>
              {initials}
            </div>
            <div>
              <p className={`font-bold text-sm leading-tight ${isActivos ? "text-secondary" : "text-neutral/50 line-through"}`}>
                {a.nombre} {a.apellidos}
              </p>
              {!isActivos && a.fechaBaja && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                  <Archive size={10} /> Baja el {new Date(a.fechaBaja).toLocaleDateString("es-ES")}
                </p>
              )}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("email", {
      id: "email", header: "Email", enableSorting: true,
      cell: ({ getValue }) => (
        <p className="text-sm font-bold text-primary flex items-center gap-1.5">
          <Mail size={13} className="shrink-0" /> {getValue()}
        </p>
      ),
    }),
    columnHelper.display({
      id: "rol", header: "Rol", enableSorting: false,
      cell: () => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral/60">
          <Shield size={13} className="text-primary" /> Administrador
        </div>
      ),
    }),
    columnHelper.display({
      id: "acciones", header: "", enableSorting: false,
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md h-8 w-8"><MoreHorizontal size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-md border-neutral/10">
                {isActivos ? (
                  <>
                    <DropdownMenuItem onClick={() => abrirSheetEditar?.(a)} className="rounded-md gap-2"><Edit size={14} /> Editar</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neutral/10" />
                    <DropdownMenuItem onClick={() => handleEliminar?.(a.id, "admin")} className="rounded-md gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"><Trash2 size={14} /> Dar de baja</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => handleRestaurar?.(a.id, "admin")} className="rounded-md gap-2"><RefreshCw size={14} /> Restaurar</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ], [isActivos, abrirSheetEditar, handleEliminar, handleRestaurar]);

  if (cargando) {
    return (
      <div className="space-y-3 py-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns} data={data}
      searchKey="nombre" searchPlaceholder="Buscar administrador..."
      pageSize={8}
      emptyText={isActivos ? "No hay personal activo." : "No hay personal en el historial de bajas."}
      toolbarStart={toolbarStart} toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTablePersonal;
