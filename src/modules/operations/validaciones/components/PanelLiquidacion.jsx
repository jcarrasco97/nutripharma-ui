import React, { useMemo } from "react";
import {
  CheckSquare,
  Square,
  Loader2,
  BadgeEuro,
  MoreHorizontal,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@/shared/components/ui/DataTable";
import { Button } from "@/shared/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";

const columnHelper = createColumnHelper();

const PanelLiquidacion = ({ hook }) => {
  const {
    pendientesLiquidar,
    seleccionadasLiquidacion,
    toggleSeleccionLiquidacion,
    seleccionarTodasLiquidacion,
    handleLiquidarLote,
    listaNutrisGlobal,
    filtroNutriLiquidacion,
    setFiltroNutriLiquidacion,
    filtroMesLiquidacion,
    setFiltroMesLiquidacion,
    ordenLiquidacion,
    enviando,
    abrirDetalleConsulta,
  } = hook;

  // ── 1. Meses disponibles ──
  const mesesDisponibles = useMemo(() => {
    const meses = new Set();
    pendientesLiquidar.forEach((c) => {
      if (c.fecha) meses.add(c.fecha.substring(0, 7));
    });
    return Array.from(meses).sort((a, b) => b.localeCompare(a));
  }, [pendientesLiquidar]);

  // ── 2. Filtrar y ordenar consultas ──
  const consultasFiltradas = useMemo(() => {
    const filtradas = pendientesLiquidar.filter((c) => {
      const pasaNutri = filtroNutriLiquidacion
        ? c.nutricionistaNombre === filtroNutriLiquidacion
        : true;
      const pasaMes =
        filtroMesLiquidacion !== "ALL"
          ? c.fecha?.startsWith(filtroMesLiquidacion)
          : true;
      return pasaNutri && pasaMes;
    });

    return filtradas.sort((a, b) => {
      const comisionA = (a.nuevas || 0) * 25 + (a.revisiones || 0) * 20;
      const comisionB = (b.nuevas || 0) * 25 + (b.revisiones || 0) * 20;
      const fechaA = new Date(a.fecha || 0).getTime();
      const fechaB = new Date(b.fecha || 0).getTime();

      switch (ordenLiquidacion) {
        case "FECHA_ASC":     return fechaA - fechaB;
        case "COMISION_ASC":  return comisionA - comisionB;
        case "COMISION_DESC": return comisionB - comisionA;
        case "FECHA_DESC":
        default:              return fechaB - fechaA;
      }
    });
  }, [pendientesLiquidar, filtroNutriLiquidacion, filtroMesLiquidacion, ordenLiquidacion]);

  // ── 3. Matemáticas del carrito ──
  const desglose = useMemo(() => {
    let nuevas = 0;
    let revisiones = 0;

    consultasFiltradas.forEach((c) => {
      if (seleccionadasLiquidacion.includes(c.id)) {
        nuevas     += c.nuevas     || 0;
        revisiones += c.revisiones || 0;
      }
    });

    const totalNuevas     = nuevas     * 25;
    const totalRevisiones = revisiones * 20;
    const totalEuros      = totalNuevas + totalRevisiones;

    return { nuevas, revisiones, totalNuevas, totalRevisiones, totalEuros };
  }, [consultasFiltradas, seleccionadasLiquidacion]);

  const todosSeleccionados =
    consultasFiltradas.length > 0 &&
    consultasFiltradas.every((c) => seleccionadasLiquidacion.includes(c.id));

  const haySeleccion = seleccionadasLiquidacion.length > 0;

  const formatMes = (iso) => {
    const [year, month] = iso.split("-");
    const date = new Date(year, month - 1);
    const nombreStr = date.toLocaleDateString("es-ES", { month: "long" });
    return `${nombreStr.charAt(0).toUpperCase() + nombreStr.slice(1)} ${year}`;
  };

  // ── 4. Columnas del DataTable ──
  const columnsLiquidacion = useMemo(
    () => [
      // Selección con checkbox global en header
      columnHelper.display({
        id: "select",
        header: () => (
          <button
            onClick={() =>
              seleccionarTodasLiquidacion(consultasFiltradas.map((c) => c.id))
            }
            className="p-1 rounded-md hover:bg-neutral/5 transition-colors"
            title={todosSeleccionados ? "Deseleccionar todo" : "Seleccionar todo"}
          >
            {todosSeleccionados ? (
              <CheckSquare size={16} className="text-[#367933]" />
            ) : (
              <Square size={16} className="text-neutral/30" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const isSelected = seleccionadasLiquidacion.includes(row.original.id);
          return (
            <button
              onClick={() => toggleSeleccionLiquidacion(row.original.id)}
              className="p-1 rounded-md hover:bg-neutral/5 transition-colors"
              title={isSelected ? "Deseleccionar" : "Seleccionar"}
            >
              {isSelected ? (
                <CheckSquare size={16} className="text-[#367933]" />
              ) : (
                <Square size={16} className="text-neutral/30" />
              )}
            </button>
          );
        },
      }),

      // Fecha
      columnHelper.accessor("fecha", {
        header: "Fecha",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            {getValue() ? new Date(getValue()).toLocaleDateString("es-ES") : "—"}
          </span>
        ),
      }),

      // Responsable — id="responsable" para que searchKey funcione
      columnHelper.accessor("nutricionistaNombre", {
        id: "responsable",
        header: "Responsable",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-secondary">{getValue()}</span>
        ),
      }),

      // Farmacia
      columnHelper.accessor("farmaciaNombre", {
        id: "farmaciaNombre",
        header: "Farmacia",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-xs font-medium text-neutral/60">{getValue()}</span>
        ),
      }),

      // Nuevas
      columnHelper.accessor("nuevas", {
        header: "Nuevas",
        enableSorting: true,
        cell: ({ getValue }) => {
          const v = getValue() || 0;
          return v > 0 ? (
            <span className="text-sm font-bold text-primary tabular-nums">{v}</span>
          ) : (
            <span className="text-neutral/30 text-xs">—</span>
          );
        },
      }),

      // Revisiones
      columnHelper.accessor("revisiones", {
        header: "Revis.",
        enableSorting: true,
        cell: ({ getValue }) => {
          const v = getValue() || 0;
          return v > 0 ? (
            <span className="text-sm font-bold text-secondary tabular-nums">{v}</span>
          ) : (
            <span className="text-neutral/30 text-xs">—</span>
          );
        },
      }),

      // Total por fila
      columnHelper.display({
        id: "total",
        header: "Total",
        cell: ({ row }) => {
          const total =
            (row.original.nuevas || 0) * 25 +
            (row.original.revisiones || 0) * 20;
          return (
            <span className="font-black text-sm text-secondary tabular-nums">
              {total.toFixed(2)}€
            </span>
          );
        },
      }),

      // Acciones con DropdownMenu
      columnHelper.display({
        id: "acciones",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral/40 hover:text-secondary rounded-md"
                >
                  <MoreHorizontal size={16} />
                  <span className="sr-only">Opciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-md border-neutral/10">
                <DropdownMenuItem
                  onClick={() => abrirDetalleConsulta(row.original)}
                  className="text-sm font-medium text-secondary cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                  Ver Informe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      seleccionadasLiquidacion,
      toggleSeleccionLiquidacion,
      seleccionarTodasLiquidacion,
      consultasFiltradas,
      todosSeleccionados,
      abrirDetalleConsulta,
    ]
  );

  // ── 5. Toolbar: Select Nutricionista + Select Mes (Shadcn, h-10) ──
  const toolbarStart = (
    <div className="flex items-center gap-2">
      {/* Selector de nutricionista */}
      <Select
        value={filtroNutriLiquidacion || "__ALL__"}
        onValueChange={(val) =>
          setFiltroNutriLiquidacion(val === "__ALL__" ? "" : val)
        }
      >
        <SelectTrigger size="default" className="w-[200px]">
          <SelectValue placeholder="Todas las nutricionistas" />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectItem value="__ALL__">Todas las nutricionistas</SelectItem>
          {(listaNutrisGlobal || []).map((n) => {
            const nombreCompleto = `${n.nombre} ${n.apellidos}`;
            return (
              <SelectItem key={n.id} value={nombreCompleto}>
                {nombreCompleto}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Selector de mes */}
      <Select
        value={filtroMesLiquidacion || "ALL"}
        onValueChange={(val) => setFiltroMesLiquidacion(val)}
      >
        <SelectTrigger size="default" className="w-[160px]">
          <SelectValue placeholder="Todos los meses" />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectItem value="ALL">Todos los meses</SelectItem>
          {mesesDisponibles.map((m) => (
            <SelectItem key={m} value={m}>
              {formatMes(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 animate-fade-in">

      {/* ── STICKY SUMMARY BAR ── */}
      <div
        className={`
          sticky top-0 z-30 bg-[#062e3a] rounded-md px-5 py-3
          flex items-center justify-between gap-4
          transition-all duration-200
        `}
      >
        {/* BLOQUE IZQUIERDO: total + desglose */}
        <div className={`flex flex-col transition-opacity duration-200 ${haySeleccion ? "opacity-100" : "opacity-30"}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 leading-none mb-0.5">
            Total a liquidar
          </p>
          <p className="text-xl font-bold text-[#b1cb0c] tabular-nums leading-tight">
            {desglose.totalEuros.toFixed(2)}€
          </p>
          <p className="text-xs text-white/50 mt-0.5 tabular-nums">
            {desglose.nuevas} nuevas ({desglose.totalNuevas.toFixed(2)}€)
            {" + "}
            {desglose.revisiones} revis. ({desglose.totalRevisiones.toFixed(2)}€)
          </p>
        </div>

        {/* CENTRO: contador de seleccionadas */}
        <p className="text-xs text-white/40 shrink-0">
          {seleccionadasLiquidacion.length} seleccionadas
        </p>

        {/* BLOQUE DERECHO: CTA */}
        <button
          onClick={handleLiquidarLote}
          disabled={!haySeleccion || enviando}
          className="
            flex items-center gap-2 px-5 h-10 rounded-md shrink-0
            bg-primary text-white text-sm font-semibold
            hover:bg-[#006633] active:scale-[0.98]
            transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
          "
        >
          {enviando ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <BadgeEuro size={14} />
          )}
          Confirmar cierre
        </button>
      </div>

      {/* ── DATATABLE sin wrapper adicional ── */}
      <DataTable
        columns={columnsLiquidacion}
        data={consultasFiltradas}
        searchKey="farmaciaNombre"
        searchPlaceholder="Buscar farmacia..."
        pageSize={10}
        toolbarStart={toolbarStart}
        showColumnsToggle={true}
        emptyText="No hay consultas pendientes con estos filtros."
      />

    </div>
  );
};

export default PanelLiquidacion;