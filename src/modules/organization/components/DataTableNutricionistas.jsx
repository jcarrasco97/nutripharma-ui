import React, { useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { Archive, Edit, MoreHorizontal, RefreshCw, Store, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper();

const DataTableNutricionistas = ({
  data = [],
  cargando = false,
  isActivos = true,
  abrirSheetEditar,
  abrirModalAsignaciones,
  handleEliminar,
  handleRestaurar,
  toolbarStart,
  toolbarEnd,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre", {
        id: "nombre",
        header: "Nutricionista",
        enableSorting: true,
        cell: ({ row }) => {
          const n = row.original;
          const initials = `${n.nombre?.charAt(0) ?? ""}${n.apellidos?.charAt(0) ?? ""}`;
          return (
            <div className="flex items-center gap-3 min-w-[220px]">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none ${
                  isActivos
                    ? "bg-secondary text-surface"
                    : "bg-neutral/20 text-neutral/60"
                }`}
              >
                {initials}
              </div>
              <div>
                <p
                  className={`font-bold text-sm leading-tight ${
                    isActivos ? "text-secondary" : "text-neutral/50 line-through"
                  }`}
                >
                  {n.nombre} {n.apellidos}
                </p>
                {!isActivos && n.fechaBaja && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                    <Archive size={10} />
                    Baja el {new Date(n.fechaBaja).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("email", {
        id: "contacto",
        header: "Contacto",
        enableSorting: true,
        cell: ({ row }) => {
          const n = row.original;
          return (
            <div className="min-w-[180px]">
              <p className="text-sm font-medium text-secondary truncate">{n.email}</p>
              <p className="text-xs text-neutral/60 font-medium mt-0.5">{n.telefono}</p>
            </div>
          );
        },
      }),
      columnHelper.accessor("horasContratoMensual", {
        id: "horas",
        header: "Contrato",
        enableSorting: true,
        cell: ({ getValue }) => (
          <Badge className="bg-secondary/10 text-secondary border-none text-xs font-bold px-2.5 py-0.5 rounded-md">
            {getValue() ?? "–"}h/mes
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "asignaciones",
        header: "Farmacias",
        enableSorting: false,
        cell: ({ row }) => {
          const n = row.original;
          const count = n.asignaciones?.length ?? 0;
          return (
            <button
              onClick={() => isActivos && abrirModalAsignaciones?.(n, "nutricionista")}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                count > 0
                  ? "bg-accent/20 text-primary hover:bg-accent/40 cursor-pointer"
                  : "bg-neutral/10 text-neutral/40 cursor-default"
              }`}
            >
              <Store size={11} />
              {count > 0 ? `${count} Farmacias` : "Sin asignaciones"}
            </button>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const n = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-md h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-md border-neutral/10">
                  {isActivos ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => abrirSheetEditar?.(n)}
                        className="rounded-md gap-2"
                      >
                        <Edit size={14} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-neutral/10" />
                      <DropdownMenuItem
                        onClick={() => handleEliminar?.(n.id, "nutricionista")}
                        className="rounded-md gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                      >
                        <Trash2 size={14} /> Dar de baja
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleRestaurar?.(n.id, "nutricionista")}
                      className="rounded-md gap-2"
                    >
                      <RefreshCw size={14} /> Restaurar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      }),
    ],
    [isActivos, abrirSheetEditar, abrirModalAsignaciones, handleEliminar, handleRestaurar]
  );

  if (cargando) {
    return (
      <div className="space-y-3 py-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="nombre"
      searchPlaceholder="Buscar nutricionista..."
      pageSize={8}
      emptyText={
        isActivos
          ? "No hay nutricionistas activos."
          : "No hay nutricionistas en el historial de bajas."
      }
      toolbarStart={toolbarStart}
      toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTableNutricionistas;
