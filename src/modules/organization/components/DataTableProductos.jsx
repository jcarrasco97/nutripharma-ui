import React, { useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/Badge";
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
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className={`p-2.5 rounded-md shrink-0 ${conStock ? "bg-accent/20 text-primary" : "bg-neutral/10 text-neutral/40"}`}>
              <PackagePlus size={18} />
            </div>
            <div>
              <p className={`font-bold text-sm flex items-center gap-2 flex-wrap ${conStock ? "text-secondary" : "text-neutral/50 line-through decoration-neutral/30"}`}>
                {p.nombreProducto}
                <Badge className="bg-neutral/10 text-neutral/60 border-none text-[10px] font-bold px-1.5 py-0 rounded-md no-underline">
                  {p.referencia}
                </Badge>
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
      id: "acronimo", header: "Acrónimo", enableSorting: true,
      cell: ({ getValue }) => <span className="text-sm font-medium text-secondary">{getValue() ?? "–"}</span>,
    }),
    columnHelper.display({
      id: "precios", header: "Precios", enableSorting: false,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="min-w-[120px]">
            <p className="text-sm font-bold text-secondary">PVF: <span className="text-primary">{p.pvf}€</span></p>
            <p className="text-xs text-neutral/60 font-medium mt-0.5">PVP: {p.pvp}€</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("hayExistencias", {
      id: "stock", header: "Stock", enableSorting: true,
      cell: ({ row }) => {
        const p = row.original;
        if (!isActivos) return <Badge className="bg-neutral/10 text-neutral/60 border-none text-xs font-bold px-2 py-0.5 rounded-md">Baja</Badge>;
        return (
          <div className="flex items-center gap-2">
            <Switch checked={p.hayExistencias} onCheckedChange={() => handleToggleStock?.(p.id)} />
            <span className={`text-xs font-bold ${p.hayExistencias ? "text-primary" : "text-neutral/40"}`}>
              {p.hayExistencias ? "Con stock" : "Sin stock"}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "acciones", header: "", enableSorting: false,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md h-8 w-8"><MoreHorizontal size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-md border-neutral/10">
                {isActivos ? (
                  <>
                    <DropdownMenuItem onClick={() => abrirSheetEditar?.(p)} className="rounded-md gap-2"><Edit size={14} /> Editar</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neutral/10" />
                    <DropdownMenuItem onClick={() => handleEliminar?.(p.id, "producto")} className="rounded-md gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"><Trash2 size={14} /> Dar de baja</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => handleRestaurar?.(p.id, "producto")} className="rounded-md gap-2"><RefreshCw size={14} /> Restaurar</DropdownMenuItem>
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
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns} data={data}
      searchKey="nombreProducto" searchPlaceholder="Buscar producto..."
      pageSize={8}
      emptyText={isActivos ? "No hay productos activos." : "No hay productos en el historial de bajas."}
      toolbarStart={toolbarStart} toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTableProductos;
