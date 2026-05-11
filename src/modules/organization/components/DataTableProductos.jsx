import React, { useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Switch } from "@/shared/components/ui/Switch";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { Archive, Edit, MoreHorizontal, PackagePlus, RefreshCw, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper();

const DataTableProductos = ({
  data = [], cargando = false, isActivos = true,
  abrirSheetEditar, handleEliminar, handleRestaurar, handleToggleStock,
  toolbarStart, toolbarEnd,
}) => {
  const columns = useMemo(() => [
    columnHelper.accessor("nombreProducto", {
      id: "nombreProducto",
      header: "Producto",
      enableSorting: true,
      cell: ({ row }) => {
        const p = row.original;
        const conStock = p.hayExistencias && isActivos;
        return (
          <div className="flex items-center gap-3 min-w-[250px]">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                conStock ? "bg-accent/20 text-primary" : "bg-neutral/10 text-neutral/40"
              }`}
            >
              <PackagePlus size={18} />
            </div>
            <div>
              <p
                className={`font-bold text-sm leading-tight flex items-center gap-2 flex-wrap ${
                  conStock ? "text-secondary" : "text-neutral/50 line-through decoration-neutral/30"
                }`}
              >
                {p.nombreProducto}
                {p.referencia && (
                  <span className="text-[10px] font-bold text-neutral/50 bg-neutral/10 px-1.5 py-0.5 rounded-md no-underline">
                    {p.referencia}
                  </span>
                )}
              </p>
              {!isActivos && p.fechaBaja && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                  <Archive size={10} /> Baja el {new Date(p.fechaBaja).toLocaleDateString("es-ES")}
                </p>
              )}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("acronimo", {
      id: "acronimo",
      header: "Acrónimo",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-secondary whitespace-nowrap">
          {getValue() || "—"}
        </span>
      ),
    }),
    columnHelper.accessor("pvf", {
      id: "pvf",
      header: "PVF",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-primary whitespace-nowrap">
          {getValue() != null ? `${getValue()} €` : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("pvp", {
      id: "pvp",
      header: () => <div className="text-left w-full">PVP</div>,
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="text-left">
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            {getValue() != null ? `${getValue()} €` : "—"}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("hayExistencias", {
      id: "stock",
      header: () => <div className="text-center w-full">Stock</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const p = row.original;
        if (!isActivos) {
          return (
            <div className="flex justify-center">
              <span className="text-sm font-medium text-neutral/50">Baja</span>
            </div>
          );
        }
        return (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Switch checked={p.hayExistencias} onCheckedChange={() => handleToggleStock?.(p.id)} />
              <span className={`text-xs font-bold ${p.hayExistencias ? "text-primary" : "text-neutral/40"}`}>
                {p.hayExistencias ? "Con stock" : "Sin stock"}
              </span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "acciones",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const p = row.original;
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
                    <DropdownMenuItem onClick={() => abrirSheetEditar?.(p)} className="rounded-lg gap-2">
                      <Edit size={14} /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neutral/10" />
                    <DropdownMenuItem
                      onClick={() => handleEliminar?.(p.id, "producto")}
                      className="rounded-lg gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                    >
                      <Trash2 size={14} /> Dar de baja
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => handleRestaurar?.(p.id, "producto")} className="rounded-lg gap-2">
                    <RefreshCw size={14} /> Restaurar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ], [isActivos, abrirSheetEditar, handleEliminar, handleRestaurar, handleToggleStock]);

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
      columns={columns} data={data}
      searchKey="nombreProducto" searchPlaceholder="Buscar producto..."
      pageSize={5}
      emptyText={isActivos ? "No hay productos activos." : "No hay productos en el historial de bajas."}
      toolbarStart={toolbarStart} toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTableProductos;
