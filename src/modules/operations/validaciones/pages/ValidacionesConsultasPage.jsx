import React, { useState, useMemo } from "react";
import {
  Clock,
  Loader2,
  Stethoscope,
  Eye,
  LayoutGrid,
  List,
  Filter,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { useValidaciones } from "../hooks/useValidaciones";
import ModalDetalleValidacion from "../components/ModalDetalleValidacion";
import { ModalVerEvidencia } from "@/modules/operations/consultas";
import HistorialValidaciones from "../components/HistorialValidaciones";
import PanelLiquidacion from "../components/PanelLiquidacion";

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
 * Vista independiente: Validaciones → Consultas
 * Renderiza pendientes de validar, panel de liquidación e historial de consultas.
 * El deep link desde el Dashboard admin (np_target_consulta_id) sigue
 * funcionando porque useValidaciones lo gestiona internamente cuando
 * pestañaActual === "consultas" (valor inicial por defecto del hook).
 */
const ValidacionesConsultasPage = () => {
  const hook = useValidaciones(); // pestañaActual inicia en "consultas" por defecto

  // ── ESTADOS UI ──
  const [vistaActiva, setVistaActiva] = useState("pendientes");
  const [modoVista, setModoVista] = useState("grid"); // "grid" | "list"
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("FECHA_DESC");

  const TABS = [
    { key: "pendientes", label: "Pendientes", count: hook.pendientes.length },
    {
      key: "liquidacion",
      label: "Liquidación",
      count: hook.pendientesLiquidar?.length || 0,
    },
    { key: "historial", label: "Historial", count: hook.historial.length },
  ];

  // ── LÓGICA DE FILTRADO Y ORDENACIÓN (Consultas Pendientes) ──
  const pendientesProcesados = useMemo(() => {
    let resultado = [...hook.pendientes];

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.nutricionistaNombre?.toLowerCase().includes(termino) ||
          c.farmaciaNombre?.toLowerCase().includes(termino)
      );
    }

    resultado.sort((a, b) => {
      const tA = new Date(a.fecha).getTime();
      const tB = new Date(b.fecha).getTime();

      if (orden === "FECHA_DESC") return tB - tA;
      if (orden === "FECHA_ASC") return tA - tB;
      if (orden === "NOMBRE_ASC")
        return (a.nutricionistaNombre || "").localeCompare(
          b.nutricionistaNombre || ""
        );
      return 0;
    });

    return resultado;
  }, [hook.pendientes, busqueda, orden]);

  // ── COLUMNAS DATATABLE (Vista Lista) ──
  const columnsList = useMemo(
    () => [
      columnHelper.accessor("fecha", {
        header: "Fecha / Turno",
        cell: ({ getValue, row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-secondary whitespace-nowrap">
              {getValue()}
            </span>
            {row.original.tipoTurno && (
              <span className="text-[11px] text-neutral/40 font-medium">
                {row.original.tipoTurno}
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("nutricionistaNombre", {
        header: "Responsable",
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-secondary">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("farmaciaNombre", {
        header: "Farmacia",
        cell: ({ getValue }) => (
          <span className="text-xs font-medium text-[#367933] flex items-center gap-1.5">
            <Stethoscope size={14} className="text-[#367933]" />
            {getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "acciones",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => hook.abrirDetalleConsulta(row.original)}
              className="h-8 gap-1.5 rounded-md bg-[#367933] text-white hover:bg-[#006633] font-bold text-xs shadow-md shadow-[#367933]/20 border-none"
            >
              <Search size={14} /> Revisar
            </Button>
          </div>
        ),
      }),
    ],
    [hook]
  );

  return (
    <>
      {/* ── MODAL VER EVIDENCIA (intacto) ── */}
      <ModalVerEvidencia
        urlEvidencia={hook.urlEvidenciaModal}
        fechaConsulta={hook.detalleSeleccionado?.fecha}
        evidenciaFecha={hook.detalleSeleccionado?.evidenciaFecha}
        onClose={hook.cerrarModalEvidencia}
      />

      {/* ── MODAL DETALLE VALIDACIÓN (intacto) ── */}
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

      {/* ── PÁGINA PRINCIPAL ── */}
      <div className="space-y-4 animate-fade-in pb-10 -mt-2 md:-mt-4">

        {/* ── CABECERA: TABS Y CONTROLES ── */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 min-h-[40px] mb-4">

          {/* TABS PRINCIPALES (3 pestañas) */}
          <div className="flex gap-2">
            {TABS.map((tab) => {
              const isActive = vistaActiva === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setVistaActiva(tab.key)}
                  className={`pb-2 text-[14px] font-medium transition-colors whitespace-nowrap border-b-2 px-1 outline-none flex items-center gap-1.5 ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
                  }`}
                >
                  {tab.label}
                  <Badge
                    className={`border-none text-[10px] font-black px-1.5 py-0 h-4 transition-colors ${
                      isActive
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

          {/* CONTROLES TOOLBAR — solo en vista "pendientes" */}
          {vistaActiva === "pendientes" && (
            <div className="flex items-center gap-3">

              {/* Botón Filtros → Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 gap-2 border-neutral/20 text-neutral/60 hover:text-secondary rounded-md bg-surface shadow-sm"
                  >
                    <Filter size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-72 p-4 rounded-md border-neutral/10 bg-surface shadow-xl space-y-4"
                >
                  {/* Buscador dentro del popover */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider">
                      Buscar responsable o farmacia
                    </label>
                    <div className="relative group">
                      <Search
                        size={14}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral/40 group-focus-within:text-primary transition-colors pointer-events-none"
                      />
                      <Input
                        placeholder="Ej: María, Farmacia Norte..."
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
                        className={`text-xs text-left px-3 py-2 rounded-md font-medium transition-colors ${
                          orden === "FECHA_DESC"
                            ? "bg-primary/10 text-primary"
                            : "text-secondary hover:bg-neutral/5"
                        }`}
                      >
                        Más recientes primero
                      </button>
                      <button
                        onClick={() => setOrden("FECHA_ASC")}
                        className={`text-xs text-left px-3 py-2 rounded-md font-medium transition-colors ${
                          orden === "FECHA_ASC"
                            ? "bg-primary/10 text-primary"
                            : "text-secondary hover:bg-neutral/5"
                        }`}
                      >
                        Más antiguos primero
                      </button>
                      <button
                        onClick={() => setOrden("NOMBRE_ASC")}
                        className={`text-xs text-left px-3 py-2 rounded-md font-medium transition-colors ${
                          orden === "NOMBRE_ASC"
                            ? "bg-primary/10 text-primary"
                            : "text-secondary hover:bg-neutral/5"
                        }`}
                      >
                        Responsable A-Z
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Separador */}
              <div className="w-px h-4 bg-neutral/20" />

              {/* Toggle Grid / List */}
              <div className="flex items-center bg-neutral/10 rounded-md p-0.5">
                <button
                  onClick={() => setModoVista("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    modoVista === "grid"
                      ? "bg-white text-secondary shadow-sm"
                      : "text-neutral/40 hover:text-secondary"
                  }`}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setModoVista("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    modoVista === "list"
                      ? "bg-white text-secondary shadow-sm"
                      : "text-neutral/40 hover:text-secondary"
                  }`}
                  title="Vista Lista"
                >
                  <List size={14} />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* ── ÁREA DE CONTENIDO: PENDIENTES ── */}
        {vistaActiva === "pendientes" && (
          <div>
            {hook.cargando ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : pendientesProcesados.length === 0 ? (
              <Empty className="py-20 border border-dashed border-neutral/10 rounded-md">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Stethoscope size={18} />
                  </EmptyMedia>
                  <EmptyTitle>Sin resultados</EmptyTitle>
                  <EmptyDescription>
                    {busqueda
                      ? "No hay consultas que coincidan con tu búsqueda."
                      : "No hay consultas pendientes de validación. ¡Buen trabajo!"}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                {/* ── RENDER GRID ── */}
                {modoVista === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-in fade-in duration-300">
                    {pendientesProcesados.map((c) => (
                      <div
                        key={c.id}
                        className="bg-surface rounded-md border border-neutral/10 p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors h-full shadow-sm group"
                      >
                        {/* Top: badge estado + fecha y turno */}
                        <div className="flex justify-between items-start gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md shrink-0">
                            <Clock size={10} /> Pendiente
                          </span>
                          <span className="text-[11px] font-bold text-neutral/40 group-hover:text-neutral/60 transition-colors text-right leading-tight">
                            {c.fecha}
                            {c.tipoTurno && (
                              <span className="block text-neutral/30">
                                {c.tipoTurno}
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Centro: nombre nutricionista + farmacia */}
                        <div className="flex-1">
                          <p className="text-sm font-bold text-secondary leading-tight">
                            {c.nutricionistaNombre}
                          </p>
                          <p className="text-xs font-medium text-neutral/50 mt-1 flex items-center gap-1">
                            <Stethoscope size={12} className="text-[#367933]" />
                            {c.farmaciaNombre}
                          </p>
                        </div>

                        {/* Bottom: botón acción */}
                        <Button
                          onClick={() => hook.abrirDetalleConsulta(c)}
                          className="mt-auto w-full justify-center gap-1.5 rounded-md bg-[#367933] text-white hover:bg-[#006633] font-bold text-xs h-10 shadow-md shadow-[#367933]/20 transition-all border-none"
                        >
                          <Search size={14} /> Revisar y Validar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── RENDER LISTA (DataTable) ── */}
                {modoVista === "list" && (
                  <div className="animate-in fade-in duration-300">
                    <DataTable
                      columns={columnsList}
                      data={pendientesProcesados}
                      searchKey={null}
                      showColumnsToggle={false}
                      pageSize={10}
                      emptyText="No se encontraron consultas."
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── ÁREA DE CONTENIDO: LIQUIDACIÓN ── */}
        {vistaActiva === "liquidacion" && (
          <div className="pt-2">
            <PanelLiquidacion hook={hook} />
          </div>
        )}

        {/* ── ÁREA DE CONTENIDO: HISTORIAL ── */}
        {vistaActiva === "historial" && (
          <div className="pt-2">
            <HistorialValidaciones
              key="consultas"
              historial={hook.historial}
              pestañaActual="consultas"
              onVerDetalle={(item) => hook.abrirDetalleConsulta(item)}
            />
          </div>
        )}

      </div>
    </>
  );
};

export default ValidacionesConsultasPage;
