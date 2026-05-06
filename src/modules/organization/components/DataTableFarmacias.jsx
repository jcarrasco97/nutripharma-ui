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
import { Archive, Edit, MoreHorizontal, RefreshCw, Store, Trash2, Users } from "lucide-react";

const columnHelper = createColumnHelper();

const DataTableFarmacias = ({
  data = [],
  nutricionistas = [],
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
        header: "Farmacia",
        enableSorting: true,
        cell: ({ row }) => {
          const f = row.original;
          return (
            <div className="flex items-center gap-3 min-w-[240px]">
              <div
                className={`p-2.5 rounded-md shrink-0 ${
                  isActivos
                    ? "bg-accent/20 text-primary"
                    : "bg-neutral/10 text-neutral/40"
                }`}
              >
                <Store size={18} />
              </div>
              <div>
                <p
                  className={`font-bold text-sm leading-tight flex flex-wrap items-center gap-1.5 ${
                    isActivos ? "text-secondary" : "text-neutral/50 line-through"
                  }`}
                >
                  {f.nombre}
                </p>
                {!isActivos && f.fechaBaja && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                    <Archive size={10} />
                    Baja el {new Date(f.fechaBaja).toLocaleDateString("es-ES")}
                  </p>
                )}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("direccion", {
        id: "contacto",
        header: "Dirección / CIF",
        enableSorting: false,
        cell: ({ row }) => {
          const f = row.original;
          return (
            <div className="min-w-[180px]">
              <p className="text-sm font-medium text-secondary truncate">{f.direccion}</p>
              <p className="text-xs text-neutral/60 font-medium mt-0.5">CIF: {f.cif}</p>
            </div>
          );
        },
      }),
      columnHelper.accessor("esProvinciaLocal", {
        id: "tipo",
        header: "Tipo",
        enableSorting: true,
        cell: ({ getValue }) => {
          const local = getValue();
          return (
            <Badge
              className={`border-none text-xs font-bold px-2.5 py-0.5 rounded-md whitespace-nowrap ${
                local
                  ? "bg-secondary/10 text-secondary"
                  : "bg-neutral/10 text-neutral/60"
              }`}
            >
              {local ? "Almería (PVF)" : "Externa (PVP)"}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("porcentajeComision", {
        id: "comision",
        header: "Comisión",
        enableSorting: true,
        cell: ({ getValue }) => (
          <Badge className="bg-accent/20 text-primary border-none text-xs font-bold px-2.5 py-0.5 rounded-md">
            {getValue()}%
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "asignaciones",
        header: "Nutricionistas",
        enableSorting: false,
        cell: ({ row }) => {
          const f = row.original;
          const count = nutricionistas.filter((n) =>
            n.asignaciones?.some((a) => a.farmaciaId === f.id)
          ).length;
          return (
            <button
              onClick={() => isActivos && abrirModalAsignaciones?.(f, "farmacia")}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                count > 0
                  ? "bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer"
                  : "bg-neutral/10 text-neutral/40 cursor-default"
              }`}
            >
              <Users size={11} />
              {count > 0 ? `${count} Nutricionistas` : "Sin nutricionistas"}
            </button>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const f = row.original;
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
                        onClick={() => abrirSheetEditar?.(f)}
                        className="rounded-md gap-2"
                      >
                        <Edit size={14} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-neutral/10" />
                      <DropdownMenuItem
                        onClick={() => handleEliminar?.(f.id, "farmacia")}
                        className="rounded-md gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                      >
                        <Trash2 size={14} /> Dar de baja
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleRestaurar?.(f.id, "farmacia")}
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
    [isActivos, nutricionistas, abrirSheetEditar, abrirModalAsignaciones, handleEliminar, handleRestaurar]
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
      searchPlaceholder="Buscar farmacia..."
      pageSize={8}
      emptyText={
        isActivos
          ? "No hay farmacias activas."
          : "No hay farmacias en el historial de bajas."
      }
      toolbarStart={toolbarStart}
      toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTableFarmacias;
