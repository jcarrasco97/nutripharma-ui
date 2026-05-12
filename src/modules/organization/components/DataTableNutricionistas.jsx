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
// 👇 1. Importamos el icono genérico User
import { Archive, Edit, MoreHorizontal, RefreshCw, Store, Trash2, User } from "lucide-react";

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
          return (
            <div className="flex items-center gap-3 min-w-[250px]">
              {/* 👇 2. Reemplazamos las iniciales por el Icono Genérico (Mismo estilo que Farmacias) */}
              <div
                className={`p-2.5 rounded-md shrink-0 ${isActivos
                  ? "bg-secondary/10 text-secondary"
                  : "bg-neutral/10 text-neutral/40"
                  }`}
              >
                <User size={18} />
              </div>
              <div>
                <p
                  className={`font-bold text-sm leading-tight ${isActivos ? "text-secondary" : "text-neutral/50 line-through"
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

      // 👇 4. Contrato como texto plano (Adiós Badge)
      columnHelper.accessor("horasContratoMensual", {
        id: "horas",
        header: "Contrato",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="text-left">
            <span className="text-sm font-medium text-secondary whitespace-nowrap">
              {getValue() ? `${getValue()} h` : "—"}
            </span>
          </div>
        ),
      }),

      // 👇 3.1. Teléfono en su propia columna
      columnHelper.accessor("telefono", {
        id: "telefono",
        // Forzamos explícitamente la alineación a la izquierda
        header: "Teléfono",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="text-left">
            <span className="text-sm font-medium text-secondary whitespace-nowrap">
              {getValue() || "—"}
            </span>
          </div>
        ),
      }),
      // 👇 3. Email en su propia columna
      columnHelper.accessor("email", {
        id: "email",
        header: "Email",
        enableSorting: true,
        cell: ({ getValue }) => (
          // Hemos quitado el truncate y el max-w-[200px]
          // Añadimos min-w-[220px] y whitespace-nowrap para que respire
          <span className="text-sm font-medium text-secondary whitespace-nowrap min-w-[220px] block">
            {getValue() || "—"}
          </span>
        ),
      }),

      // 👇 5. Asignaciones estilo Github/Vercel (Icono + Número)
      // 👇 Columna FARMACIAS centrada
      columnHelper.display({
        id: "asignaciones",
        // 1. Centramos el texto del Header
        header: "Farmacias",
        enableSorting: true,
        cell: ({ row }) => {
          const n = row.original;
          const count = n.asignaciones?.length ?? 0;
          return (
            // 2. Centramos el Badge dentro de la celda
            <div className="flex justify-center">
              <button
                onClick={() => isActivos && count > 0 && abrirModalAsignaciones?.(n, "nutricionista")}
                disabled={!isActivos || count === 0}
                title={count > 0 ? "Ver farmacias asignadas" : "Sin asignaciones"}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${count > 0 && isActivos
                  ? "bg-accent/20 text-primary hover:bg-accent/30 cursor-pointer"
                  : "bg-neutral/10 text-neutral/40 cursor-default"
                  }`}
              >
                <Store size={14} />
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
          const n = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-md h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-md border-neutral/10 shadow-lg">
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
      pageSize={5}
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