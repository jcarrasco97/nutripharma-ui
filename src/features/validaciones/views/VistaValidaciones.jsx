import React from "react";
import {
  CheckCircle,
  Clock,
  Package,
  Stethoscope,
  Loader2,
  ShieldCheck,
  XCircle,
  FileBox,
  Search,
  MapPin,
} from "lucide-react";

import { useValidaciones } from "../hooks/useValidaciones"; // <-- Tu Cerebro
import ModalRepartoComisiones from "../components/ModalRepartoComisiones"; // <-- Tu Modal 1
import ModalDetalleValidacion from "../components/ModalDetalleValidacion"; // <-- Tu Modal 2

const VistaValidaciones = () => {
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

      {/* 4. BANDEJA DE PENDIENTES */}
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
            <h3 className="text-xl font-black text-[#062e3a] mb-2">
              Bandeja Vacía
            </h3>
            <p className="text-[#342c1e]/70 font-bold">
              No hay elementos pendientes de validación. ¡Buen trabajo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <span className="text-xs font-bold text-[#342c1e]/60">
                      {c.fecha}
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
                    Farmacia: {p.farmaciaNombre}
                  </p>
                  <button
                    onClick={() => hook.iniciarProcesoEnvio(p)}
                    className="w-full bg-[#367933] hover:bg-[#006633] text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 mt-auto shadow-lg shadow-[#367933]/20 active:scale-[0.98]"
                  >
                    <Package size={18} /> Marcar como Enviado
                  </button>
                </div>
              ))}

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
                  <h3 className="text-lg font-black text-[#062e3a] mb-6">
                    {s.nutricionistaNombre}
                  </h3>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() =>
                        hook.handleEstadoSuministro(s.id, "CANCELADO")
                      }
                      className="px-4 bg-red-50 text-red-600 font-bold rounded-xl flex justify-center items-center"
                    >
                      <XCircle size={18} />
                    </button>
                    <button
                      onClick={() =>
                        hook.handleEstadoSuministro(s.id, "APROBADO")
                      }
                      className="flex-1 bg-[#367933] text-white font-black py-4 rounded-xl flex justify-center items-center gap-2"
                    >
                      <CheckCircle size={18} /> Aprobar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 5. TABLA HISTORIAL */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-black text-[#062e3a] capitalize">
              Historial de {hook.pestañaActual}
            </h3>
            <p className="text-sm text-[#342c1e]/70 font-bold mt-1">
              Registro de operaciones ya procesadas
            </p>
          </div>
          <div className="flex items-center bg-[#f4f7f4] px-4 py-3 rounded-xl border border-gray-200 w-full md:w-auto">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Filtrar por nombre o fecha..."
              value={hook.busqueda}
              onChange={(e) => hook.setBusqueda(e.target.value)}
              className="bg-transparent outline-none text-sm w-full font-bold text-[#062e3a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest">
                  Fecha
                </th>
                <th className="pb-3 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest">
                  Usuario
                </th>
                <th className="pb-3 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest text-center">
                  Estado
                </th>
                <th className="pb-3 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest text-right pr-4">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {hook.historialFiltrado.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-12 text-center text-[#342c1e]/60 font-bold bg-[#f4f7f4]/50 rounded-b-xl"
                  >
                    No hay registros que coincidan.
                  </td>
                </tr>
              ) : (
                hook.historialFiltrado.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f4f7f4] transition-colors group"
                  >
                    <td className="py-4 text-sm font-bold text-[#342c1e]/70 pl-2">
                      {hook.pestañaActual === "suministros"
                        ? new Date(item.fechaPeticion).toLocaleDateString()
                        : item.fecha || item.fechaPedido}
                    </td>
                    <td className="py-4 text-sm font-black text-[#062e3a]">
                      {item.nutricionistaNombre || item.farmaciaNombre}
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest ${
                          [
                            "VALIDADA",
                            "ENVIADO",
                            "LIQUIDADO",
                            "APROBADO",
                          ].includes(item.estado)
                            ? "bg-[#b1cb0c]/20 text-[#367933]"
                            : ["CANCELADA", "RECHAZADA"].includes(item.estado)
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={() =>
                          hook.pestañaActual === "consultas"
                            ? hook.abrirDetalleConsulta(item)
                            : hook.setDetalleSeleccionado(item)
                        }
                        className="bg-white border border-gray-200 text-[#342c1e] hover:bg-[#062e3a] hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VistaValidaciones;
