import React from "react";
import {
  CheckCircle,
  Clock,
  Package,
  Stethoscope,
  Loader2,
  ShieldCheck,
  FileBox,
  Search,
} from "lucide-react";

import { useValidaciones } from "../hooks/useValidaciones";
import ModalRepartoComisiones from "../components/ModalRepartoComisiones";
import ModalDetalleValidacion from "../components/ModalDetalleValidacion";
import { ModalVerEvidencia } from "@/modules/operations/consultas";
import HistorialValidaciones from "../components/HistorialValidaciones"; // <-- AÑADIDO IMPORT
import PanelLiquidacion from "../components/PanelLiquidacion";

const ValidacionesPage = () => {
  const hook = useValidaciones();

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* 1. LOS MODALES EXTERNALIZADOS */}
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
          hook.ejecutarEnvioBackend(
            hook.pedidoEnProceso.id,
            hook.repartosActuales,
          )
        }
      />

      <ModalVerEvidencia
        urlEvidencia={hook.urlEvidenciaModal}
        fechaConsulta={hook.detalleSeleccionado?.fecha}
        evidenciaFecha={hook.detalleSeleccionado?.evidenciaFecha}
        onClose={hook.cerrarModalEvidencia}
      />

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
        onIniciarEnvio={() =>
          hook.iniciarProcesoEnvio(hook.detalleSeleccionado)
        }
        onEstadoSuministro={hook.handleEstadoSuministro}
        onCancelarPedido={hook.handleCancelarPedido}
        indexActual={hook.indexActual}
        totalPendientes={hook.totalPendientes}
        hayAnterior={hook.hayAnterior}
        haySiguiente={hook.haySiguiente}
        onAnterior={hook.irAnterior}
        onSiguiente={hook.irSiguiente}
      />

      {/* 2. CABECERA PRINCIPAL */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="bg-[#062e3a] p-4 rounded-3xl text-white shadow-lg shadow-[#062e3a]/20">
          <ShieldCheck size={32} className="text-[#bed000]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#062e3a]">
            Centro de Validaciones
          </h2>
          <p className="text-[#342c1e]/70 font-bold mt-1">
            Bandeja de entrada para control de calidad y auditoría.
          </p>
        </div>
      </div>

      {/* 3. PESTAÑAS (TABS) */}
      <div className="flex flex-wrap gap-2 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => hook.setPestañaActual("consultas")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${hook.pestañaActual === "consultas" ? "bg-[#367933] text-white shadow-md" : "text-[#342c1e]/60 hover:bg-[#f4f7f4]"}`}
        >
          <Stethoscope size={18} /> Consultas
        </button>
        <button
          onClick={() => hook.setPestañaActual("pedidos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${hook.pestañaActual === "pedidos" ? "bg-[#367933] text-white shadow-md" : "text-[#342c1e]/60 hover:bg-[#f4f7f4]"}`}
        >
          <Package size={18} /> Pedidos
        </button>
        <button
          onClick={() => hook.setPestañaActual("suministros")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${hook.pestañaActual === "suministros" ? "bg-[#367933] text-white shadow-md" : "text-[#342c1e]/60 hover:bg-[#f4f7f4]"}`}
        >
          <FileBox size={18} /> Material
        </button>
      </div>

      {/* 3.1. SUB-PESTAÑAS CONSULTAS (NUEVO) */}
      {hook.pestañaActual === "consultas" && (
        <div className="flex gap-2 bg-[#f4f7f4] p-1.5 rounded-2xl w-fit ml-4 -mt-4 mb-4 border border-gray-200">
          <button
            onClick={() => hook.setSubPestañaConsultas("validar")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${hook.subPestañaConsultas === "validar" ? "bg-white text-[#062e3a] shadow-sm" : "text-gray-400 hover:text-[#062e3a]"}`}
          >
            Pendientes de Validar
          </button>
          <button
            onClick={() => hook.setSubPestañaConsultas("liquidar")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${hook.subPestañaConsultas === "liquidar" ? "bg-[#b1cb0c]/20 text-[#367933] shadow-sm" : "text-gray-400 hover:text-[#367933]"}`}
          >
            Cierre de Caja (Liquidar)
          </button>
        </div>
      )}

      {/* 4. BANDEJA DE PENDIENTES / LIQUIDACIÓN */}
      <div>
        <h3 className="text-sm font-black text-[#342c1e]/50 mb-4 px-2 uppercase tracking-widest">
          {hook.pestañaActual === "consultas" && hook.subPestañaConsultas === "liquidar" ? "Panel de Contabilidad" : "Requiere tu Atención"}
        </h3>

        {hook.cargando ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#367933]" size={40} />
          </div>
        ) : hook.pestañaActual === "consultas" && hook.subPestañaConsultas === "liquidar" ? (
          <PanelLiquidacion hook={hook} />
        ) : hook.pendientes.length === 0 ? (
          <div className="bg-[#f4f7f4] p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
            <CheckCircle size={48} className="mx-auto text-[#b1cb0c] mb-4" />
            <h3 className="text-xl font-black text-[#062e3a] mb-2">Bandeja Vacía</h3>
            <p className="text-[#342c1e]/70 font-bold">No hay elementos pendientes de validación. ¡Buen trabajo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* --- TARJETAS CONSULTAS --- */}
            {hook.pestañaActual === "consultas" &&
              hook.pendientes.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-[#b1cb0c]/60 hover:border-[#367933] transition-all flex flex-col shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <Clock size={12} /> Pendiente
                    </span>
                    <span className="text-xs font-bold text-[#342c1e]/60 flex items-center gap-1">
                      {c.fecha} • {c.tipoTurno || "Turno"}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#062e3a]">
                    {c.nutricionistaNombre}
                  </h3>
                  <p className="text-sm font-bold text-[#367933] mb-4">
                    📍 {c.farmaciaNombre}
                  </p>
                  <button
                    onClick={() => hook.abrirDetalleConsulta(c)}
                    className="w-full bg-[#367933] hover:bg-[#006633] text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 mt-auto shadow-lg shadow-[#367933]/20 active:scale-[0.98]"
                  >
                    <Search size={18} /> Revisar y Validar
                  </button>
                </div>
              ))}

            {/* --- TARJETAS PEDIDOS --- */}
            {hook.pestañaActual === "pedidos" &&
              hook.pendientes.map((p) => (
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

            {/* --- TARJETAS SUMINISTROS --- */}
            {hook.pestañaActual === "suministros" &&
              hook.pendientes.map((s) => (
                <div
                  key={s.id}
                  className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-[#b1cb0c]/60 hover:border-[#367933] transition-all flex flex-col shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <Clock size={12} /> Nueva Petición
                    </span>
                    <span className="text-xs font-bold text-[#342c1e]/60">
                      {new Date(s.fechaPeticion).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#062e3a] leading-tight">
                    {s.nutricionistaNombre}
                  </h3>
                  <p className="text-sm font-bold text-[#367933] mb-4">
                    📦 {s.materiales ? s.materiales.length : 0} artículos
                    solicitados
                  </p>
                  <button
                    onClick={() => hook.setDetalleSeleccionado(s)}
                    className="w-full bg-[#367933] hover:bg-[#006633] text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 mt-auto shadow-lg shadow-[#367933]/20 active:scale-[0.98]"
                  >
                    <Search size={18} /> Revisar Petición
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 5. TABLA HISTORIAL (AHORA MODULAR Y ESCALABLE) */}
      <HistorialValidaciones
        key={hook.pestañaActual} // 👇 ESTA ES LA MAGIA: Obliga a React a desmontar y montar una tabla nueva y limpia cada vez que cambias de pestaña
        historial={hook.historial}
        pestañaActual={hook.pestañaActual}
        onVerDetalle={(item) =>
          hook.pestañaActual === "consultas"
            ? hook.abrirDetalleConsulta(item)
            : hook.setDetalleSeleccionado(item)
        }
      />
    </div>
  );
};

export default ValidacionesPage;
