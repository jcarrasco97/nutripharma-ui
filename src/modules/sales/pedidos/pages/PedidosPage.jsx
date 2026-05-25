import React from "react";
import { useState, useMemo } from "react";
import {
  Clock,
  Loader2,
  AlertCircle,
  Package,
  Eye,
  LayoutGrid,
  List,
  Filter,
  Search,
  ArrowUpDown,
  ArrowLeft,
  Plus,
  History,
  Settings,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

// ── Hooks ──
import { usePedidos } from "../hooks/usePedidos";
import { useValidaciones } from "@/modules/operations/validaciones";

// ── Modales ──
import ModalDetallePedido from "../components/ModalDetallePedido";
import { ModalDetalleValidacion } from "@/modules/operations/validaciones";
import ModalRepartoComisiones from "@/modules/operations/validaciones/components/ModalRepartoComisiones";
import { configuracionService } from "../services/configuracionService";

// ── Sub-componentes de Pedidos (usuario) ──
import { CatalogoProductos } from "@/modules/sales/catalogo";
import CestaPedidos from "../components/CestaPedidos";
import HistorialPedidosUsuario from "../components/HistorialPedidosUsuario";

// ── Sub-componentes de Validaciones (admin) ──
import HistorialValidaciones from "@/modules/operations/validaciones/components/HistorialValidaciones";

// ── UI Kit ──
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

const PedidosPage = () => {
  // ── Hooks (la lógica interna NO se toca) ──
  const hookPedidos = usePedidos();
  const hookValidaciones = useValidaciones("pedidos");

  // ── Estados de UI ──
  const [vistaActiva, setVistaActiva] = useState("nuevo");

  // FIX: Forzamos que el Admin vaya a pendientes una vez el hook confirme su rol
  React.useEffect(() => {
    if (hookPedidos.esAdmin) {
      setVistaActiva("pendientes");
    }
  }, [hookPedidos.esAdmin]);

  const [modoVista, setModoVista] = useState("grid");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("FECHA_DESC");

  // Helper para volver al modo lectura (solo admin)
  const volverALectura = () => setVistaActiva("pendientes");

  // ── Tabs dinámicos (SOLO PARA ADMIN) ──
  const TABS = useMemo(() => {
    if (!hookPedidos.esAdmin) return []; // Los usuarios B2B no tienen pestañas

    return [
      {
        key: "pendientes",
        label: "Pendientes",
        count: hookValidaciones.pendientes.length,
      },
      {
        key: "historial",
        label: "Historial",
        count: hookValidaciones.historial.length,
      },
    ];
  }, [
    hookPedidos.esAdmin,
    hookValidaciones.pendientes.length,
    hookValidaciones.historial.length,
  ]);

  // ── Filtrado & Ordenación de pendientes (solo admin) ──
  const pendientesProcesados = useMemo(() => {
    let resultado = [...hookValidaciones.pendientes];

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.farmaciaNombre?.toLowerCase().includes(termino) ||
          p.creadoPorNombre?.toLowerCase().includes(termino)
      );
    }

    resultado.sort((a, b) => {
      if (orden === "FECHA_DESC")
        return new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime();
      if (orden === "FECHA_ASC")
        return new Date(a.fechaPedido).getTime() - new Date(b.fechaPedido).getTime();
      if (orden === "DESTINO_ASC")
        return (a.farmaciaNombre || "").localeCompare(b.farmaciaNombre || "");
      return 0;
    });

    return resultado;
  }, [hookValidaciones.pendientes, busqueda, orden]);

  // ── Columnas DataTable (vista lista de pendientes) ──
  const columnsList = useMemo(
    () => [
      columnHelper.accessor("fechaPedido", {
        header: "Fecha",
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("creadoPorNombre", {
        header: "Responsable",
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-secondary">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("farmaciaNombre", {
        header: "Destino",
        cell: ({ getValue }) => (
          <span className="text-xs font-medium text-[#367933] flex items-center gap-1.5">
            <Package size={14} className="text-[#367933]" />
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
              onClick={() => hookValidaciones.setDetalleSeleccionado(row.original)}
              className="h-8 gap-1.5 rounded-md bg-[#367933] text-white hover:bg-[#006633] font-bold text-xs shadow-md shadow-[#367933]/20 border-none"
            >
              <Eye size={14} /> Revisar
            </Button>
          </div>
        ),
      }),
    ],
    [hookValidaciones]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // GUARDS: carga y error del hook de pedidos (catálogo)
  // ─────────────────────────────────────────────────────────────────────────
  if (hookPedidos.cargando && vistaActiva === "nuevo") {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-neutral/60 font-bold animate-pulse">
          Cargando catálogo y entorno...
        </p>
      </div>
    );
  }

  if (hookPedidos.errorCarga && vistaActiva === "nuevo") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-10 text-center max-w-2xl mx-auto">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-800">Error de carga</h3>
        <p className="text-red-600 mt-2">{hookPedidos.errorCarga}</p>
        <button
          onClick={hookPedidos.cargarDatos}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── MODALES ── */}
      <ModalDetallePedido
        pedido={hookPedidos.pedidoSeleccionado}
        onCerrar={() => hookPedidos.setPedidoSeleccionado(null)}
      />

      <ModalRepartoComisiones
        mostrar={hookValidaciones.mostrarModalReparto}
        repartosActuales={hookValidaciones.repartosActuales}
        sumaReparto={hookValidaciones.sumaReparto}
        enviando={hookValidaciones.enviando}
        onCerrar={() => {
          hookValidaciones.setMostrarModalReparto(false);
          hookValidaciones.setPedidoEnProceso(null);
        }}
        onCambioSlider={hookValidaciones.handleCambioSlider}
        onRepartoEquitativo={hookValidaciones.setRepartoEquitativo}
        onConfirmarEnvio={() =>
          hookValidaciones.ejecutarEnvioBackend(
            hookValidaciones.pedidoEnProceso.id,
            hookValidaciones.repartosActuales
          )
        }
      />

      <ModalDetalleValidacion
        detalle={hookValidaciones.detalleSeleccionado}
        pestañaActual={hookValidaciones.pestañaActual}
        formEdicion={hookValidaciones.formEdicion}
        setFormEdicion={hookValidaciones.setFormEdicion}
        enviando={hookValidaciones.enviando}
        onCerrar={() => hookValidaciones.setDetalleSeleccionado(null)}
        onCancelarConsulta={hookValidaciones.handleCancelarConsulta}
        onEditarYValidar={hookValidaciones.handleEditarYValidar}
        calcularTotalesPedido={hookValidaciones.calcularTotalesPedido}
        agruparLineasPorProducto={hookValidaciones.agruparLineasPorProducto}
        onVerFoto={hookValidaciones.handleVerFoto}
        onBorrarEvidencia={hookValidaciones.handleBorrarEvidenciaAdmin}
        onIniciarEnvio={() =>
          hookValidaciones.iniciarProcesoEnvio(hookValidaciones.detalleSeleccionado)
        }
        onEstadoSuministro={hookValidaciones.handleEstadoSuministro}
        onCancelarPedido={hookValidaciones.handleCancelarPedido}
        indexActual={hookValidaciones.indexActual}
        totalPendientes={hookValidaciones.totalPendientes}
        hayAnterior={hookValidaciones.hayAnterior}
        haySiguiente={hookValidaciones.haySiguiente}
        onAnterior={hookValidaciones.irAnterior}
        onSiguiente={hookValidaciones.irSiguiente}
      />

      {/* ── PÁGINA PRINCIPAL ── */}
      <div className="space-y-4 animate-fade-in pb-10 -mt-2 md:-mt-4">

        {/* ── CABECERA DINÁMICA POR ROL ── */}
        {hookPedidos.esAdmin ? (
          /* 👑 CABECERA ADMIN (Gestor) */
          vistaActiva === "nuevo" ? (
            <div className="mb-6 flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-neutral/60 hover:text-secondary -ml-4"
                onClick={volverALectura}
              >
                <ArrowLeft size={16} className="mr-2" /> Volver a la gestión de pedidos
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-neutral/60 hover:text-secondary border-neutral/20 shadow-sm">
                    <Settings size={14} /> Ajustes Monedero
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 rounded-md shadow-xl border-neutral/10 bg-surface z-50" align="end">
                  <h4 className="font-bold text-sm text-secondary mb-1">Configuración Global</h4>
                  <p className="text-[11px] text-neutral/60 mb-4 leading-snug">
                    Cambia el importe mínimo de compra real necesario para que las farmacias puedan canjear su saldo virtual.
                  </p>
                  <div className="flex gap-2 items-center">
                    <div className="relative w-full">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral/40 font-bold text-xs">€</span>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        defaultValue={hookPedidos.limiteMonedero}
                        id="input-limite"
                        className="h-8 pl-6 text-sm bg-transparent border-neutral/20 focus-visible:ring-primary/30"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      className="h-8 bg-primary text-white shrink-0 font-bold text-xs px-4"
                      onClick={async () => {
                         const val = parseFloat(document.getElementById('input-limite').value);
                         if(!isNaN(val) && val >= 0) {
                            try {
                              await configuracionService.actualizarLimiteMonedero(val);
                              hookPedidos.setLimiteMonedero(val);
                              alert('Límite actualizado correctamente a nivel global.');
                            } catch(e) {
                              alert('Error al actualizar el límite del monedero.');
                            }
                         }
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 min-h-[40px] mb-4">
              <div className="flex gap-2">
                {TABS.map((tab) => {
                  const isActive = vistaActiva === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setVistaActiva(tab.key)}
                      className={`pb-2 text-[14px] font-medium transition-colors whitespace-nowrap border-b-2 px-1 outline-none flex items-center gap-1.5 ${isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
                        }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <Badge
                          className={`border-none text-[10px] font-black px-1.5 py-0 h-4 transition-colors ${isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-neutral/10 text-neutral/60"
                            }`}
                        >
                          {tab.count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                {vistaActiva === "pendientes" && (
                  <>
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
                      <PopoverContent align="end" className="w-72 p-4 rounded-md border-neutral/10 bg-surface shadow-xl space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider">
                            Buscar destino o responsable
                          </label>
                          <div className="relative group">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                            <Input
                              placeholder="Ej: Farmacia Norte..."
                              value={busqueda}
                              onChange={(e) => setBusqueda(e.target.value)}
                              className="w-full pl-8 h-9 text-xs bg-transparent border-neutral/20 focus-visible:ring-primary/30 text-secondary rounded-md"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider flex items-center gap-1">
                            <ArrowUpDown size={12} /> Ordenar por
                          </label>
                          <div className="grid grid-cols-1 gap-1">
                            {[
                              { key: "FECHA_DESC", label: "Más recientes primero" },
                              { key: "FECHA_ASC", label: "Más antiguos primero" },
                              { key: "DESTINO_ASC", label: "Destino A-Z" },
                            ].map((o) => (
                              <button
                                key={o.key}
                                onClick={() => setOrden(o.key)}
                                className={`text-xs text-left px-3 py-2 rounded-md font-medium transition-colors ${orden === o.key ? "bg-primary/10 text-primary" : "text-secondary hover:bg-neutral/5"
                                  }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div className="w-px h-4 bg-neutral/20" />

                    <div className="flex items-center bg-neutral/10 rounded-md p-0.5">
                      <button
                        onClick={() => setModoVista("grid")}
                        className={`p-1.5 rounded-md transition-all ${modoVista === "grid" ? "bg-white text-secondary shadow-sm" : "text-neutral/40 hover:text-secondary"
                          }`}
                        title="Vista Cuadrícula"
                      >
                        <LayoutGrid size={14} />
                      </button>
                      <button
                        onClick={() => setModoVista("list")}
                        className={`p-1.5 rounded-md transition-all ${modoVista === "list" ? "bg-white text-secondary shadow-sm" : "text-neutral/40 hover:text-secondary"
                          }`}
                        title="Vista Lista"
                      >
                        <List size={14} />
                      </button>
                    </div>
                    <div className="w-px h-4 bg-neutral/20" />
                  </>
                )}

                <Button onClick={() => setVistaActiva("nuevo")} className="bg-primary text-white rounded-md gap-2 h-8 x-4">
                  <Plus size={16} /> Nuevo Pedido
                </Button>
              </div>
            </div>
          )
        ) : (
          /* 🛒 CABECERA USUARIO (Tienda B2B) */
          <div className="mb-4 flex justify-end items-center">
            {vistaActiva === "nuevo" ? (
              <Button
                variant="outline"
                className="border-neutral/20 text-secondary hover:bg-neutral/5 rounded-xl gap-2 h-10 px-4"
                onClick={() => setVistaActiva("historial")}
              >
                <History size={16} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-neutral/60 hover:text-secondary -ml-4 mr-auto"
                onClick={() => setVistaActiva("nuevo")}
              >
                <ArrowLeft size={16} className="mr-2" /> Volver a la tienda
              </Button>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            CONTENIDO: PENDIENTES (admin only)
           ════════════════════════════════════════════════════════════════════ */}
        {vistaActiva === "pendientes" && (
          <div>
            {hookValidaciones.cargando ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : pendientesProcesados.length === 0 ? (
              <Empty className="py-20 border border-dashed border-neutral/10 rounded-md">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Package size={18} />
                  </EmptyMedia>
                  <EmptyTitle>Sin resultados</EmptyTitle>
                  <EmptyDescription>
                    {busqueda
                      ? "No hay pedidos que coincidan con tu búsqueda."
                      : "No hay pedidos pendientes de envío. ¡Buen trabajo!"}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                {modoVista === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-in fade-in duration-300">
                    {pendientesProcesados.map((p) => (
                      <div
                        key={p.id}
                        className="bg-surface rounded-md border border-neutral/10 p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors h-full shadow-sm group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md shrink-0">
                            <Clock size={10} /> Envío Pendiente
                          </span>
                          <span className="text-[11px] font-bold text-neutral/40 group-hover:text-neutral/60 transition-colors text-right leading-tight">
                            {p.fechaPedido}
                          </span>
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-bold text-secondary leading-tight">
                            Pedido #{p.id}
                          </p>
                          <p className="text-xs font-medium text-neutral/50 mt-1 flex items-center gap-1">
                            <Package size={12} className="text-[#367933]" />
                            Destino: {p.farmaciaNombre}
                          </p>
                        </div>

                        <Button
                          onClick={() => hookValidaciones.setDetalleSeleccionado(p)}
                          className="mt-auto w-full justify-center gap-1.5 rounded-md bg-[#367933] text-white hover:bg-[#006633] font-bold text-xs h-10 shadow-md shadow-[#367933]/20 transition-all border-none"
                        >
                          <Eye size={14} /> Revisar Pedido
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {modoVista === "list" && (
                  <div className="animate-in fade-in duration-300">
                    <DataTable
                      columns={columnsList}
                      data={pendientesProcesados}
                      searchKey={null}
                      showColumnsToggle={false}
                      pageSize={10}
                      emptyText="No se encontraron pedidos."
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            CONTENIDO: NUEVO PEDIDO
           ════════════════════════════════════════════════════════════════════ */}
        {vistaActiva === "nuevo" && (
          // Mobile: 1 col con pb-32 (espacio para barra flotante)
          // Desktop xl+: grid 2 columnas (catálogo + cesta sidebar)
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-32 xl:pb-6">
            <div className="xl:col-span-8">
              <CatalogoProductos
                productos={hookPedidos.productos}
                ordenProductos={hookPedidos.ordenProductos}
                setOrdenProductos={hookPedidos.setOrdenProductos}
                farmaciaActual={hookPedidos.farmaciaActual}
                esAdmin={hookPedidos.esAdmin}
                esFarmacia={hookPedidos.esFarmacia}
                farmacias={hookPedidos.farmacias}
                farmaciaSeleccionada={hookPedidos.farmaciaSeleccionada}
                setFarmaciaSeleccionada={hookPedidos.setFarmaciaSeleccionada}
                agregarAlCarrito={hookPedidos.agregarAlCarrito}
                modificarCantidad={hookPedidos.modificarCantidad}
                umbralAlcanzado={hookPedidos.umbralAlcanzado}
                saldoRestante={hookPedidos.saldoRestante}
                getPrecioAplicado={hookPedidos.getPrecioAplicado}
                totalReal={hookPedidos.totalReal}
                carrito={hookPedidos.carrito}
                limiteMonedero={hookPedidos.limiteMonedero}
              />
            </div>

            <div className="xl:col-span-4">
              <CestaPedidos
                carrito={hookPedidos.carrito}
                modificarCantidad={hookPedidos.modificarCantidad}
                totalReal={hookPedidos.totalReal}
                totalVirtual={hookPedidos.totalVirtual}
                umbralAlcanzado={hookPedidos.umbralAlcanzado}
                farmaciaSeleccionada={hookPedidos.farmaciaSeleccionada}
                enviando={hookPedidos.enviando}
                handleRealizarPedido={hookPedidos.handleRealizarPedido}
                esAdmin={hookPedidos.esAdmin}
                getPrecioAplicado={hookPedidos.getPrecioAplicado}
                observacionesPedido={hookPedidos.observacionesPedido}
                setObservacionesPedido={hookPedidos.setObservacionesPedido}
                limiteMonedero={hookPedidos.limiteMonedero}
              />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            CONTENIDO: HISTORIAL (adaptado al rol)
           ════════════════════════════════════════════════════════════════════ */}
        {vistaActiva === "historial" && (
          <div className="pt-2">
            {hookPedidos.esAdmin ? (
              <HistorialValidaciones
                key="pedidos"
                historial={hookValidaciones.historial}
                pestañaActual="pedidos"
                onVerDetalle={(item) =>
                  hookValidaciones.setDetalleSeleccionado(item)
                }
              />
            ) : (
              <HistorialPedidosUsuario
                esAdmin={hookPedidos.esAdmin}
                esNutricionista={hookPedidos.esNutricionista}
                pedidosFiltrados={hookPedidos.pedidosFiltrados}
                mesFiltro={hookPedidos.mesFiltro}
                setMesFiltro={hookPedidos.setMesFiltro}
                ordenFiltro={hookPedidos.ordenFiltro}
                setOrdenFiltro={hookPedidos.setOrdenFiltro}
                mesesDisponibles={hookPedidos.mesesDisponibles || []}
                setPedidoSeleccionado={hookPedidos.setPedidoSeleccionado}
              />
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default PedidosPage;