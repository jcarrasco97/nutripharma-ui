import React, { useState, useMemo } from "react";
import { Clock, Loader2, Package, Eye, LayoutGrid, List, Filter, Search, ArrowUpDown } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { useValidaciones } from "../hooks/useValidaciones";
import ModalDetalleValidacion from "../components/ModalDetalleValidacion";
import HistorialValidaciones from "../components/HistorialValidaciones";

import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { DataTable } from "@/shared/components/ui/DataTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/Popover";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/shared/components/ui/Empty";

const columnHelper = createColumnHelper();

/**
 * Vista independiente: Validaciones → Suministros / Material
 */
const ValidacionesSuministrosPage = () => {
  const hook = useValidaciones("suministros");
  const [vistaActiva, setVistaActiva] = useState("pendientes");

  // ── ESTADOS DE LA TOOLBAR PENDIENTES ──
  const [modoVista, setModoVista] = useState("grid"); // "grid" | "list"
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("FECHA_DESC");

  const TABS = [
    { key: "pendientes", label: "Pendientes", count: hook.pendientes.length },
    { key: "historial", label: "Historial", count: hook.historial.length },
  ];

  // ── LÓGICA DE FILTRADO Y ORDENACIÓN ──
  const pendientesProcesados = useMemo(() => {
    let resultado = [...hook.pendientes];

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter((p) =>
        p.nutricionistaNombre?.toLowerCase().includes(termino)
      );
    }

    resultado.sort((a, b) => {
      const tA = new Date(a.fechaPeticion).getTime();
      const tB = new Date(b.fechaPeticion).getTime();

      if (orden === "FECHA_DESC") return tB - tA;
      if (orden === "FECHA_ASC") return tA - tB;
      if (orden === "NOMBRE_ASC") return (a.nutricionistaNombre || "").localeCompare(b.nutricionistaNombre || "");
      return 0;
    });

    return resultado;
  }, [hook.pendientes, busqueda, orden]);

  // ── COLUMNAS DATATABLE ──
  const columnsList = useMemo(() => [
    columnHelper.accessor("fechaPeticion", {
      header: "Fecha y Hora",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-secondary whitespace-nowrap">
          {new Date(getValue()).toLocaleString("es-ES", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
          })}
        </span>
      )
    }),
    columnHelper.accessor("nutricionistaNombre", {
      header: "Responsable",
      cell: ({ getValue }) => <span className="text-sm font-bold text-secondary">{getValue()}</span>
    }),
    columnHelper.accessor("materiales", {
      header: "Artículos",
      cell: ({ getValue }) => (
        <span className="text-xs font-medium text-neutral/60 flex items-center gap-1.5">
          <Package size={14} className="text-[#367933]" />
          {getValue()?.length || 0} artículos
        </span>
      )
    }),
    columnHelper.display({
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => hook.setDetalleSeleccionado(row.original)}
            className="h-8 gap-1.5 rounded-md bg-[#367933] text-white hover:bg-[#006633] font-bold text-xs shadow-md shadow-[#367933]/20 border-none"
          >
            <Eye size={14} /> Revisar
          </Button>
        </div>
      )
    })
  ], [hook]);

  return (
    <>
      <ModalDetalleValidacion
        detalle={hook.detalleSeleccionado}
        pestañaActual={hook.pestañaActual}
        formEdicion={hook.formEdicion}
        setFormEdicion={hook.setFormEdicion}
        enviando={hook.enviando}
        onCerrar={() => hook.setDetalleSeleccionado(null)}
        onCancelarConsulta={hook.handleCancelarConsulta}
        onEditarYValidar={hook.handleEditarYValidar}
        calcularTotalesPedido={hook.calcularTotalesPedido}
        agruparLineasPorProducto={hook.agruparLineasPorProducto}
        onVerFoto={hook.handleVerFoto}
        onBorrarEvidencia={hook.handleBorrarEvidenciaAdmin}
        onIniciarEnvio={() => hook.iniciarProcesoEnvio(hook.detalleSeleccionado)}
        onEstadoSuministro={hook.handleEstadoSuministro}
        onCancelarPedido={hook.handleCancelarPedido}
        indexActual={hook.indexActual}
        totalPendientes={hook.totalPendientes}
        hayAnterior={hook.hayAnterior}
        haySiguiente={hook.haySiguiente}
        onAnterior={hook.irAnterior}
        onSiguiente={hook.irSiguiente}
      />

      <div className="space-y-4 animate-fade-in pb-10 -mt-2 md:-mt-4">

        {/* ── CABECERA: TABS Y CONTROLES ── */}
        {/* FIX: Quitamos border-b y pb-2. Añadimos min-h-[40px] mb-4 para estabilizar la altura */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 min-h-[40px] mb-4">

          {/* TABS PRINCIPALES */}
          <div className="flex gap-2">
            {TABS.map((tab) => {
              const isActive = vistaActiva === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setVistaActiva(tab.key)}
                  // FIX: Eliminado el mb-[-9px]
                  className={`pb-2 text-[14px] font-medium transition-colors whitespace-nowrap border-b-2 px-1 outline-none flex items-center gap-1.5 ${isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
                    }`}
                >
                  {tab.label}
                  <Badge
                    className={`border-none text-[10px] font-black px-1.5 py-0 h-4 transition-colors ${isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-neutral/10 text-neutral/60"
                      }`}
                  >
                    {tab.count}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* CONTROLES DE VISTA PENDIENTES */}
          {vistaActiva === "pendientes" && (
            <div className="flex items-center gap-3">

              {/* Botón Filtro/Ordenar -> Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 gap-2 border-neutral/20 text-neutral/60 hover:text-secondary rounded-md bg-surface shadow-sm">
                    <Filter size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-4 rounded-md border-neutral/10 bg-surface shadow-xl space-y-4">
                  {/* Buscador dentro del popover */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider">Buscar Responsable</label>
                    <div className="relative group">
                      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                      <Input
                        placeholder="Ej: María..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-8 h-9 text-xs bg-transparent border-neutral/20 focus-visible:ring-primary/30 text-secondary rounded-md"
                      />
                    </div>
                  </div>
                  {/* Ordenación dentro del popover */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider flex items-center gap-1">
                      <ArrowUpDown size={12} /> Ordenar por
                    </label>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        onClick={() => setOrden("FECHA_DESC")}
                        className={`text-xs text-left px-3 py-2 rounded-md font-medium transition-colors ${orden === "FECHA_DESC" ? "bg-primary/10 text-primary" : "text-secondary hover:bg-neutral/5"}`}
                      >
                        Más recientes primero
                      </button>
                      <button
                        onClick={() => setOrden("FECHA_ASC")}
                        className={`text-xs text-left px-3 py-2 rounded-md font-medium transition-colors ${orden === "FECHA_ASC" ? "bg-primary/10 text-primary" : "text-secondary hover:bg-neutral/5"}`}
                      >
                        Más antiguos primero
                      </button>
                      <button
                        onClick={() => setOrden("NOMBRE_ASC")}
                        className={`text-xs text-left px-3 py-2 rounded-md font-medium transition-colors ${orden === "NOMBRE_ASC" ? "bg-primary/10 text-primary" : "text-secondary hover:bg-neutral/5"}`}
                      >
                        Alfabéticamente (A-Z)
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Separador */}
              <div className="w-px h-4 bg-neutral/20"></div>

              {/* Tabs Grid/List (estilo minimalista) */}
              <div className="flex items-center bg-neutral/10 rounded-md p-0.5">
                <button
                  onClick={() => setModoVista("grid")}
                  className={`p-1.5 rounded-md transition-all ${modoVista === "grid" ? "bg-white text-secondary shadow-sm" : "text-neutral/40 hover:text-secondary"}`}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setModoVista("list")}
                  className={`p-1.5 rounded-md transition-all ${modoVista === "list" ? "bg-white text-secondary shadow-sm" : "text-neutral/40 hover:text-secondary"}`}
                  title="Vista Lista"
                >
                  <List size={14} />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* ── ÁREA DE CONTENIDO ── */}
        {vistaActiva === "pendientes" && (
          <div>
            {hook.cargando ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : pendientesProcesados.length === 0 ? (
              <Empty className="py-20 border border-dashed border-neutral/10 rounded-md">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><Package size={18} /></EmptyMedia>
                  <EmptyTitle>Sin resultados</EmptyTitle>
                  <EmptyDescription>
                    {busqueda ? "No hay peticiones que coincidan con tu búsqueda." : "No hay solicitudes de material pendientes."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                {/* RENDER GRID */}
                {modoVista === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-in fade-in duration-300">
                    {pendientesProcesados.map((s) => (
                      <div key={s.id} className="bg-surface rounded-md border border-neutral/10 p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors h-full shadow-sm group">

                        <div className="flex justify-between items-start gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md shrink-0">
                            <Clock size={10} /> Pendiente
                          </span>
                          <span className="text-[11px] font-bold text-neutral/40 group-hover:text-neutral/60 transition-colors text-right leading-tight">
                            {new Date(s.fechaPeticion).toLocaleString("es-ES", {
                              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-bold text-secondary leading-tight">
                            {s.nutricionistaNombre}
                          </p>
                          <p className="text-xs font-medium text-neutral/50 mt-1 flex items-center gap-1">
                            <Package size={12} className="text-[#367933]" />
                            {s.materiales ? s.materiales.length : 0} artículos
                          </p>
                        </div>

                        <Button
                          onClick={() => hook.setDetalleSeleccionado(s)}
                          className="mt-auto w-full justify-center gap-1.5 rounded-md bg-[#367933] text-white hover:bg-[#006633] font-bold text-xs h-10 shadow-md shadow-[#367933]/20 transition-all border-none"
                        >
                          <Eye size={14} /> Revisar petición
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* RENDER LISTA DATATABLE (Sin Search, sin Columnas, sin Card envolvente) */}
                {modoVista === "list" && (
                  <div className="animate-in fade-in duration-300">
                    <DataTable
                      columns={columnsList}
                      data={pendientesProcesados}
                      searchKey={null} // <--- Quita el input de búsqueda nativo
                      showColumnsToggle={false} // <--- Requiere la modificación del paso 1
                      pageSize={10}
                      emptyText="No se encontraron peticiones."
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── VISTA: HISTORIAL ── */}
        {vistaActiva === "historial" && (
          <div className="pt-2">
            <HistorialValidaciones
              key="suministros"
              historial={hook.historial}
              pestañaActual="suministros"
              onVerDetalle={(item) => hook.setDetalleSeleccionado(item)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ValidacionesSuministrosPage;
