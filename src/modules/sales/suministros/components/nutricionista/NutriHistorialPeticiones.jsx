import React, { useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Clock, Package, X, MoreHorizontal, Eye } from "lucide-react";

import { DataTable } from "@/shared/components/ui/DataTable";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/Dialog";

const columnHelper = createColumnHelper();

/**
 * Badge de estado con colores según valor.
 */
const estadoBadge = (estado) => {
  const e = estado || "";
  let classes =
    "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap ";
  if (e === "APROBADO") classes += "bg-primary/10 text-primary";
  else if (["CANCELADO", "RECHAZADO"].includes(e))
    classes += "bg-destructive/10 text-destructive";
  else classes += "bg-amber-100 text-amber-700";
  return <span className={classes}>{e.replace("_", " ")}</span>;
};

const NutriHistorialPeticiones = ({
  peticionesFiltradas,
  mesFiltro,
  setMesFiltro,
  estadoFiltro,
  setEstadoFiltro,
  ordenFiltro,
  setOrdenFiltro,
  mesesDisponibles,
}) => {
  // ── Estado del modal de detalle ──
  const [detalle, setDetalle] = useState(null);

  const opciones = useMemo(() => {
    return mesesDisponibles.filter((m) => m !== "Todos");
  }, [mesesDisponibles]);

  const formatoMesCorto = (key) => {
    if (!key || key === "Todos") return "Todos los meses";
    const [year, month] = key.split("-");
    if (!year || !month) return key;
    const nombre = new Date(year, month - 1).toLocaleString("es-ES", {
      month: "short",
    });
    return `${nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "")} ${year}`;
  };

  // ── Columnas: Materiales | Fecha | Estado ──
  const columns = useMemo(
    () => [
      // 1. Materiales — primer nombre + badge "+X" clicable
      columnHelper.accessor("materiales", {
        id: "materiales",
        header: "Materiales",
        enableSorting: true,
        cell: ({ row }) => {
          const items = row.original.materiales || [];
          const primero = items[0]?.nombre || "Sin material";
          const resto = items.length - 1;

          return (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-secondary truncate">
                {primero}
              </span>
              {resto > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetalle(row.original);
                  }}
                  className="shrink-0"
                >
                  <Badge
                    size="sm"
                    className="text-[10px] font-bold border-none bg-primary/10 text-primary rounded-md cursor-pointer hover:bg-primary/20 transition-colors px-1.5 py-0.5 h-auto"
                  >
                    +{resto}
                  </Badge>
                </button>
              )}
            </div>
          );
        },
      }),

      // 2. Fecha
      columnHelper.accessor("fechaPeticion", {
        id: "fecha",
        header: "Fecha",
        enableSorting: true,
        cell: ({ getValue }) => {
          const raw = getValue();
          if (!raw) return <span className="text-neutral/40">—</span>;
          return (
            <span className="text-sm font-medium text-secondary whitespace-nowrap">
              {new Date(raw).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          );
        },
      }),

      // 3. Estado
      columnHelper.accessor("estado", {
        id: "estado",
        header: "Estado",
        enableSorting: true,
        cell: ({ getValue }) => estadoBadge(getValue()),
      }),

      // 4. Acciones
      columnHelper.display({
        id: "acciones",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-md border-neutral/10 shadow-lg w-40">
                <DropdownMenuItem
                  onClick={() => setDetalle(row.original)}
                  className="rounded-md gap-2 text-sm font-medium cursor-pointer"
                >
                  <Eye size={14} /> Ver detalles
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }),
    ],
    []
  );

  // ── Toolbar: Filtros Shadcn Select ──
  const toolbar = (
    <div className="flex items-center gap-2 flex-wrap">
      <Select
        value={mesFiltro || "Todos"}
        onValueChange={(val) => setMesFiltro(val)}
      >
        <SelectTrigger className="h-10 w-[160px] bg-surface border-neutral/10 rounded-md text-secondary font-medium">
          <SelectValue placeholder="Todos los meses" />
        </SelectTrigger>
        <SelectContent className="rounded-md border-neutral/10">
          <SelectItem value="Todos">Todos los meses</SelectItem>
          {opciones.map((m) => (
            <SelectItem key={m} value={m} className="font-medium">
              {formatoMesCorto(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={peticionesFiltradas}
        searchKey={null}
        showColumnsToggle={true}
        pageSize={10}
        emptyText="No se encontraron peticiones."
        toolbarStart={toolbar}
      />

      {/* ── Modal de detalle completo de la petición ── */}
      <Dialog
        open={!!detalle}
        onOpenChange={(open) => {
          if (!open) setDetalle(null);
        }}
      >
        <DialogContent className="p-0 overflow-hidden max-w-md border border-neutral/10 bg-surface flex flex-col gap-0">
          <DialogTitle className="sr-only">Detalle de petición</DialogTitle>

          {/* Header */}
          <div className="bg-secondary px-4 py-3 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Package size={15} className="text-accent" />
              <span className="text-surface text-sm font-semibold">
                Detalle de Petición
              </span>
            </div>
            <button
              onClick={() => setDetalle(null)}
              className="text-surface/40 hover:text-surface transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          {detalle && (
            <div className="px-5 py-5 space-y-3 overflow-y-auto custom-scrollbar">
              {/* Info de cabecera */}
              <div className="bg-surface border border-neutral/10 p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                    Petición de Material
                  </p>
                  <p className="text-xs font-medium text-neutral/50 mt-0.5 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(detalle.fechaPeticion).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {estadoBadge(detalle.estado)}
              </div>

              {/* Lista de materiales completa */}
              <div className="border border-neutral/10 rounded-md overflow-hidden">
                <p className="bg-neutral/5 text-[10px] font-bold text-neutral/50 uppercase px-4 py-2.5 border-b border-neutral/10 tracking-wider">
                  Materiales Solicitados
                </p>
                <div className="divide-y divide-neutral/5 bg-surface">
                  {detalle.materiales?.map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center px-4 py-2.5"
                    >
                      <span className="text-sm font-semibold text-secondary">
                        {m.nombre}
                      </span>
                      <Badge className="text-[10px] font-bold border-none bg-primary/10 text-primary rounded-md h-auto px-1.5 py-0.5">
                        {m.cantidadEstandar} uds
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NutriHistorialPeticiones;
