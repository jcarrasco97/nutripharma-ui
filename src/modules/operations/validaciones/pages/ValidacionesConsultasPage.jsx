import React from "react";
import {
  CheckCircle,
  Clock,
  Stethoscope,
  Loader2,
  ShieldCheck,
  Search,
} from "lucide-react";

import { useValidaciones } from "../hooks/useValidaciones";
import ModalDetalleValidacion from "../components/ModalDetalleValidacion";
import { ModalVerEvidencia } from "@/modules/operations/consultas";
import HistorialValidaciones from "../components/HistorialValidaciones";

/**
 * Vista independiente: Validaciones → Consultas
 * Renderiza pendientes de validar + historial de consultas.
 * El deep link desde el Dashboard admin (np_target_consulta_id) sigue
 * funcionando porque useValidaciones lo gestiona internamente cuando
 * pestañaActual === "consultas" (valor inicial por defecto del hook).
 */
const ValidacionesConsultasPage = () => {
  const hook = useValidaciones(); // pestañaActual inicia en "consultas" por defecto

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* MODALES */}
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
            Validación de Consultas
          </h2>
          <p className="text-[#342c1e]/70 font-bold mt-1">
            Consultas pendientes de validar y su historial completo.
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
              No hay consultas pendientes de validación. ¡Buen trabajo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {hook.pendientes.map((c) => (
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
          </div>
        )}
      </div>

      {/* HISTORIAL */}
      <HistorialValidaciones
        key="consultas"
        historial={hook.historial}
        pestañaActual="consultas"
        onVerDetalle={(item) => hook.abrirDetalleConsulta(item)}
      />
    </div>
  );
};

export default ValidacionesConsultasPage;
