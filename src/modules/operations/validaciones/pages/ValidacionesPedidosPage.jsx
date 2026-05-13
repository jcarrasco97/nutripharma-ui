import React from "react";
import {
  CheckCircle,
  Clock,
  Package,
  Loader2,
  ShieldCheck,
  Search,
} from "lucide-react";

import { useValidaciones } from "../hooks/useValidaciones";
import ModalRepartoComisiones from "../components/ModalRepartoComisiones";
import ModalDetalleValidacion from "../components/ModalDetalleValidacion";
import HistorialValidaciones from "../components/HistorialValidaciones";

/**
 * Vista independiente: Validaciones → Pedidos
 * Renderiza pedidos pendientes de envío + historial de pedidos.
 */
const ValidacionesPedidosPage = () => {
  // Forzamos pestañaActual a "pedidos" desde el montaje del hook.
  // Como useState acepta un inicializador lazy, sobrescribimos el valor
  // predeterminado después del primer render con un efecto imperativo
  // en el propio hook. En su lugar, aprovechamos que el hook expone
  // setPestañaActual y lo llamamos de forma controlada aquí.
  const hook = useValidaciones();

  // Aseguramos que el hook arranque en la pestaña correcta sin modificar
  // useValidaciones: simplemente forzamos el cambio en el primer render.
  // Como `pestañaActual` inicia en "consultas", necesitamos movernos a "pedidos".
  React.useEffect(() => {
    hook.setPestañaActual("pedidos");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo en el montaje

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* MODAL REPARTO COMISIONES */}
      <ModalRepartoComisiones
        mostrar={hook.mostrarModalReparto}
        repartosActuales={hook.repartosActuales}
        sumaReparto={hook.sumaReparto}
        enviando={hook.enviando}
        onCerrar={() => {
          hook.setMostrarModalReparto(false);
          hook.setPedidoEnProceso(null);
        }}
        onCambioSlider={hook.handleCambioSlider}
        onRepartoEquitativo={hook.setRepartoEquitativo}
        onConfirmarEnvio={() =>
          hook.ejecutarEnvioBackend(hook.pedidoEnProceso.id, hook.repartosActuales)
        }
      />

      {/* MODAL DETALLE */}
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

      {/* CABECERA */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="bg-[#062e3a] p-4 rounded-3xl text-white shadow-lg shadow-[#062e3a]/20">
          <ShieldCheck size={32} className="text-[#bed000]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#062e3a]">
            Validación de Pedidos
          </h2>
          <p className="text-[#342c1e]/70 font-bold mt-1">
            Pedidos pendientes de envío y su historial completo.
          </p>
        </div>
      </div>

      {/* BANDEJA DE PENDIENTES */}
      <div>
        <h3 className="text-sm font-black text-[#342c1e]/50 mb-4 px-2 uppercase tracking-widest">
          Requiere tu Atención
        </h3>

        {hook.cargando ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#367933]" size={40} />
          </div>
        ) : hook.pendientes.length === 0 ? (
          <div className="bg-[#f4f7f4] p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
            <CheckCircle size={48} className="mx-auto text-[#b1cb0c] mb-4" />
            <h3 className="text-xl font-black text-[#062e3a] mb-2">Bandeja Vacía</h3>
            <p className="text-[#342c1e]/70 font-bold">
              No hay pedidos pendientes de envío. ¡Buen trabajo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {hook.pendientes.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-[#b1cb0c]/60 hover:border-[#367933] transition-all flex flex-col shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                    <Clock size={12} /> Envío Pendiente
                  </span>
                  <span className="text-xs font-bold text-[#342c1e]/60">
                    {p.fechaPedido}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#062e3a]">
                  Pedido #{p.id}
                </h3>
                <p className="text-sm font-bold text-[#367933] mb-4">
                  📦 Destino: {p.farmaciaNombre}
                </p>
                <button
                  onClick={() => hook.setDetalleSeleccionado(p)}
                  className="w-full bg-[#367933] hover:bg-[#006633] text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 mt-auto shadow-lg shadow-[#367933]/20 active:scale-[0.98]"
                >
                  <Search size={18} /> Revisar Pedido
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HISTORIAL */}
      <HistorialValidaciones
        key="pedidos"
        historial={hook.historial}
        pestañaActual="pedidos"
        onVerDetalle={(item) => hook.setDetalleSeleccionado(item)}
      />
    </div>
  );
};

export default ValidacionesPedidosPage;
