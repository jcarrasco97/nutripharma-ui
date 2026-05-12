import React, { useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Switch } from "@/shared/components/ui/Switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/Tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { Archive, Edit, MoreHorizontal, PackagePlus, RefreshCw, Trash2 } from "lucide-react";

const columnHelper = createColumnHelper();

// Badge de categoría — binario, categórico → justifica badge
const CategoriaBadge = ({ categoria }) => {
  const esPequeno = categoria === "PEQUENO";
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${esPequeno
        ? "bg-accent/20 text-primary"
        : "bg-neutral/10 text-neutral/60"
        }`}
    >
      {esPequeno ? "Pequeño" : "Grande"}
    </span>
  );
};

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
          <div className="flex items-center gap-3 min-w-[260px]">
            <div
              className={`p-2.5 rounded-md shrink-0 ${conStock ? "bg-accent/20 text-primary" : "bg-neutral/10 text-neutral/40"
                }`}
            >
              <PackagePlus size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className={`font-bold text-sm leading-tight ${conStock
                    ? "text-secondary"
                    : "text-neutral/50 line-through decoration-neutral/30"
                    }`}
                >
                  {p.nombreProducto}
                </p>
                {/* Badge categoría — binario/categórico ✓ */}
                {p.categoria && <CategoriaBadge categoria={p.categoria} />}
              </div>
              {!isActivos && p.fechaBaja && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                  <Archive size={10} />
                  Baja el {new Date(p.fechaBaja).toLocaleDateString("es-ES")}
                </p>
              )}
            </div>
          </div>
        );
      },
    }),

    // Acrónimo como columna — buscable y ordenable independientemente
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

    // Referencia como columna — permite búsqueda por código de referencia
    columnHelper.accessor("referencia", {
      id: "referencia",
      header: "Referencia",
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
        <span className="text-sm font-medium text-secondary whitespace-nowrap">
          {getValue() != null ? `${getValue()} €` : "—"}
        </span>
      ),
    }),

    columnHelper.accessor("pvp", {
      id: "pvp",
      header: "PVP",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-secondary whitespace-nowrap">
          {getValue() != null ? `${getValue()} €` : "—"}
        </span>
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
              <span className="text-sm font-medium text-neutral/50">—</span>
            </div>
          );
        }
        return (
          <div className="flex justify-center">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      checked={p.hayExistencias}
                      onCheckedChange={() => handleToggleStock?.(p.id)}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="text-xs font-semibold rounded-md border-neutral/10"
                >
                  {p.hayExistencias ? "Con stock" : "Sin stock"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                <Button variant="ghost" size="icon" className="rounded-md h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-md border-neutral/10 shadow-lg">
                {isActivos ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => abrirSheetEditar?.(p)}
                      className="rounded-md gap-2"
                    >
                      <Edit size={14} /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neutral/10" />
                    <DropdownMenuItem
                      onClick={() => handleEliminar?.(p.id, "producto")}
                      className="rounded-md gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                    >
                      <Trash2 size={14} /> Dar de baja
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleRestaurar?.(p.id, "producto")}
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
  ], [isActivos, abrirSheetEditar, handleEliminar, handleRestaurar, handleToggleStock]);

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
      searchKey="nombreProducto"
      searchPlaceholder="Buscar producto..."
      pageSize={5}
      emptyText={
        isActivos
          ? "No hay productos activos."
          : "No hay productos en el historial de bajas."
      }
      toolbarStart={toolbarStart}
      toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTableProductos;