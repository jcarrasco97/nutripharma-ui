import React from "react";
import {
  Eye,
  XCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Wallet,
  Banknote,
} from "lucide-react";

const ModalDetalleValidacion = ({
  detalle,
  pestañaActual,
  formEdicion,
  setFormEdicion,
  enviando,
  onCerrar,
  onCancelarConsulta,
  onEditarYValidar,
  calcularTotalesPedido,
  agruparLineasPorProducto,
}) => {
  if (!detalle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062e3a]/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in border border-[#342c1e]/20">
        <div className="p-6 bg-gradient-to-r from-[#062e3a] to-[#342c1e] text-white flex justify-between items-center">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Eye size={20} className="text-[#bed000]" /> Informe Detallado
          </h3>
          <button
            onClick={onCerrar}
            className="text-white/50 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* VISTA CONSULTAS */}
          {pestañaActual === "consultas" && (
            <div className="space-y-4">
              <div className="bg-[#b1cb0c]/10 p-4 rounded-2xl border border-[#b1cb0c]/30 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-[#367933] uppercase tracking-widest mb-1">
                    Jornada
                  </p>
                  <p className="font-black text-[#062e3a] text-lg">
                    {detalle.fecha} ({detalle.tipoTurno})
                  </p>
                  <p className="text-sm font-bold text-[#342c1e]/70 mt-1">
                    {detalle.horaInicio?.substring(0, 5)} -{" "}
                    {detalle.horaFin?.substring(0, 5)}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest ${
                    detalle.estado === "VALIDADA"
                      ? "bg-[#b1cb0c]/20 text-[#367933]"
                      : detalle.estado === "CANCELADA"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {detalle.estado.replace("_", " ")}
                </span>
              </div>

              <p className="font-bold text-[#342c1e]">
                Nutricionista:{" "}
                <span className="font-black text-[#062e3a]">
                  {detalle.nutricionistaNombre}
                </span>
              </p>
              <p className="font-bold text-[#342c1e]">
                Farmacia:{" "}
                <span className="font-black text-[#062e3a]">
                  {detalle.farmaciaNombre}
                </span>
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {Object.keys(formEdicion).map((campo) => (
                  <div
                    key={campo}
                    className="bg-[#f4f7f4] p-3 rounded-xl border border-gray-200"
                  >
                    <p className="text-xs text-[#342c1e]/60 uppercase font-black mb-2">
                      {campo
                        .replace("personalFarmacia", "Personal")
                        .replace("promociones", "Promo")}
                    </p>
                    <input
                      type="number"
                      min="0"
                      value={formEdicion[campo]}
                      onChange={(e) =>
                        setFormEdicion({
                          ...formEdicion,
                          [campo]: Number(e.target.value),
                        })
                      }
                      disabled={detalle.estado === "CANCELADA"}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xl font-black text-[#367933] focus:ring-2 focus:ring-[#b1cb0c] outline-none disabled:bg-transparent disabled:border-transparent"
                    />
                  </div>
                ))}
              </div>

              {detalle.mensajeIncidencia && (
                <div className="mt-4 text-sm text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-inner">
                  <p className="text-xs font-black uppercase mb-1 flex items-center gap-1">
                    <AlertTriangle size={14} /> Mensaje de Incidencia
                  </p>
                  <p className="font-medium">{detalle.mensajeIncidencia}</p>
                </div>
              )}

              {detalle.observacionesJornada && (
                <div className="mt-4">
                  <p className="text-xs font-black text-[#342c1e]/60 uppercase mb-1">
                    Notas de la Jornada
                  </p>
                  <p className="text-sm bg-gray-50 text-gray-700 p-4 rounded-xl border border-gray-100 font-medium">
                    {detalle.observacionesJornada}
                  </p>
                </div>
              )}

              {detalle.estado !== "CANCELADA" && (
                <div className="flex flex-col md:flex-row gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={onCancelarConsulta}
                    disabled={enviando}
                    className="flex-1 py-3 px-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black rounded-xl transition-colors flex justify-center items-center gap-2"
                  >
                    <XCircle size={18} /> Anular
                  </button>
                  <button
                    onClick={onEditarYValidar}
                    disabled={enviando}
                    className="flex-[2] py-3 px-4 bg-[#367933] text-white hover:bg-[#006633] font-black rounded-xl transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#367933]/20"
                  >
                    {enviando ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <ShieldCheck size={18} />
                    )}{" "}
                    Guardar y Validar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VISTA PEDIDOS */}
          {pestañaActual === "pedidos" &&
            (() => {
              const totales = calcularTotalesPedido(detalle.lineas);
              const agrupado = agruparLineasPorProducto(detalle.lineas);
              return (
                <div className="space-y-4">
                  <div className="bg-[#b1cb0c]/10 p-4 rounded-2xl border border-[#b1cb0c]/30 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-[#367933] uppercase tracking-widest mb-1">
                        Pedido #{detalle.id}
                      </p>
                      <p className="font-black text-[#062e3a] text-lg">
                        {detalle.farmaciaNombre}
                      </p>
                    </div>
                    <span className="bg-[#062e3a] text-white font-bold px-3 py-1 rounded-lg text-sm">
                      {detalle.estado}
                    </span>
                  </div>

                  <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                    <p className="bg-[#f4f7f4] text-xs font-black text-[#342c1e]/60 uppercase p-3 border-b border-gray-200">
                      Desglose Resumido
                    </p>
                    <div className="p-4 space-y-4 bg-white">
                      {agrupado.map(([nombreProd, cants], idx) => {
                        const totalLinea =
                          cants.real + cants.bonificados + cants.virtual;
                        return (
                          <div
                            key={idx}
                            className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                          >
                            <p className="font-black text-[#062e3a] mb-1">
                              {nombreProd}
                            </p>
                            <ul className="text-xs space-y-1 ml-2 font-bold">
                              {cants.real > 0 && (
                                <li className="text-[#342c1e]/70">
                                  • {cants.real}x (Dinero Real)
                                </li>
                              )}
                              {cants.bonificados > 0 && (
                                <li className="text-[#367933]">
                                  • {cants.bonificados}x (Bonificados/Gratis)
                                </li>
                              )}
                              {cants.virtual > 0 && (
                                <li className="text-[#b1cb0c]">
                                  • {cants.virtual}x (Saldo Virtual)
                                </li>
                              )}
                            </ul>
                            <p className="text-xs font-black text-[#062e3a]/60 mt-2">
                              TOTAL {nombreProd}: {totalLinea} uds.
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1 p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#342c1e]/60 uppercase flex items-center gap-1 tracking-widest">
                          <Wallet size={12} /> Virtual Usado
                        </span>
                        <span className="text-sm font-black text-[#b1cb0c]">
                          {totales.totalVirtual.toFixed(2)}€
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#062e3a] uppercase flex items-center gap-1 tracking-widest">
                          <Banknote size={12} /> Total Real
                        </span>
                        <span className="text-lg font-black text-[#367933]">
                          {totales.totalReal.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>

                  {detalle.repartos && detalle.repartos.length > 0 && (
                    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                      <p className="bg-[#f4f7f4] text-xs font-black text-[#342c1e]/60 uppercase p-3 border-b border-gray-200">
                        Comisión Asignada
                      </p>
                      <div className="p-4 space-y-2 bg-white">
                        {detalle.repartos.map((r, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-sm font-black text-[#062e3a]"
                          >
                            <span>{r.nutricionistaNombre}</span>
                            <span className="text-[#367933] bg-[#b1cb0c]/20 px-2 py-1 rounded-md">
                              {r.porcentaje}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          {/* VISTA SUMINISTROS */}
          {pestañaActual === "suministros" && (
            <div className="space-y-4">
              <div className="bg-[#b1cb0c]/10 p-4 rounded-2xl border border-[#b1cb0c]/30 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-[#367933] uppercase tracking-widest mb-1">
                    Petición Suministros
                  </p>
                  <p className="font-black text-[#062e3a] text-lg">
                    {detalle.nutricionistaNombre}
                  </p>
                </div>
                <span
                  className={`font-black px-3 py-1 rounded-lg text-sm text-white ${detalle.estado === "APROBADO" ? "bg-emerald-600" : "bg-red-500"}`}
                >
                  {detalle.estado}
                </span>
              </div>

              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                <p className="bg-[#f4f7f4] text-xs font-black text-[#342c1e]/60 uppercase p-3 border-b border-gray-200">
                  Materiales Enviados
                </p>
                <ul className="p-4 space-y-2 text-sm font-black text-[#062e3a] bg-white">
                  {detalle.materiales?.map((m, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                    >
                      <span>{m.nombre}</span>
                      <span className="text-xs text-[#367933] bg-[#b1cb0c]/20 px-2 py-1 rounded-md">
                        {m.cantidadEstandar} uds
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 text-right bg-gray-50">
          <button
            onClick={onCerrar}
            className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-200 text-[#342c1e] font-black rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleValidacion;
