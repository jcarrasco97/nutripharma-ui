import React, { useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
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
            <div className="flex items-center gap-3 min-w-[250px]">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  isActivos
                    ? "bg-accent/20 text-primary"
                    : "bg-neutral/10 text-neutral/40"
                }`}
              >
                <Store size={18} />
              </div>
              <div>
                <p
                  className={`font-bold text-sm leading-tight ${
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
        id: "direccion",
        header: "Dirección",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-secondary whitespace-nowrap min-w-[200px] block">
            {getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("cif", {
        id: "cif",
        header: "CIF",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            {getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "comisionTipo",
        header: "Comisión (Tipo)",
        enableSorting: false,
        cell: ({ row }) => {
          const f = row.original;
          const tipo = f.esProvinciaLocal ? "PVF" : "PVP";
          const comision = f.porcentajeComision;
          return (
            <span className="text-sm font-medium text-secondary whitespace-nowrap">
              {comision != null ? `${comision}% (${tipo})` : "—"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "asignaciones",
        header: () => <div className="text-center w-full">Nutricionistas</div>,
        enableSorting: false,
        cell: ({ row }) => {
          const f = row.original;
          const count = nutricionistas.filter((n) =>
            n.asignaciones?.some((a) => a.farmaciaId === f.id)
          ).length;
          return (
            <div className="flex justify-center">
              <button
                onClick={() => isActivos && count > 0 && abrirModalAsignaciones?.(f, "farmacia")}
                disabled={!isActivos || count === 0}
                title={count > 0 ? "Ver nutricionistas asignados" : "Sin nutricionistas"}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  count > 0 && isActivos
                    ? "bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer"
                    : "bg-neutral/10 text-neutral/40 cursor-default"
                }`}
              >
                <Users size={14} />
                <span>{count}</span>
              </button>
            </div>
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
                  <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-neutral/10 shadow-lg">
                  {isActivos ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => abrirSheetEditar?.(f)}
                        className="rounded-lg gap-2"
                      >
                        <Edit size={14} /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-neutral/10" />
                      <DropdownMenuItem
                        onClick={() => handleEliminar?.(f.id, "farmacia")}
                        className="rounded-lg gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                      >
                        <Trash2 size={14} /> Dar de baja
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleRestaurar?.(f.id, "farmacia")}
                      className="rounded-lg gap-2"
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
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
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
      pageSize={5}
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
