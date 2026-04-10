import React, { useMemo } from "react";
import {
  Eye,
  XCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Wallet,
  Banknote,
  Camera,
  Clock,
  Package,
  Gift,
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
  onVerFoto,
  onBorrarEvidencia,
}) => {
  // 1️⃣ PRIMERO LOS HOOKS (Siempre arriba)
  const lineasPedidoAgrupadas = useMemo(() => {
    if (pestañaActual !== "pedidos" || !detalle || !detalle.lineas) {
      return { agrupadas: [], totales: { euros: 0, virtual: 0 } };
    }

    const mapa = {};
    let tEuros = 0;
    let tVirtual = 0;

    detalle.lineas.forEach((linea) => {
      const nombre = linea.productoNombre || "Producto Desconocido";
      const precioUd = linea.precioUnitario || linea.precioAplicado || 0;

      if (!mapa[nombre]) {
        mapa[nombre] = {
          nombre: nombre,
          udsCompradas: 0,
          udsRegalo: 0,
          udsVirtuales: 0,
          subEuros: 0,
          subVirtual: 0,
        };
      }

      if (linea.bonificados) mapa[nombre].udsRegalo += linea.bonificados;

      if (linea.pagadoConSaldo) {
        mapa[nombre].udsVirtuales += linea.cantidad;
        mapa[nombre].subVirtual += linea.cantidad * precioUd;
        tVirtual += linea.cantidad * precioUd;
      } else {
        mapa[nombre].udsCompradas += linea.cantidad;
        mapa[nombre].subEuros += linea.cantidad * precioUd;
        tEuros += linea.cantidad * precioUd;
      }
    });

    return {
      agrupadas: Object.values(mapa),
      totales: { euros: tEuros, virtual: tVirtual },
    };
  }, [detalle, pestañaActual]);

  const formatFecha = (isoString) => {
    if (!isoString) return "Desconocida";
    return new Date(isoString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const formatFechaHora = (isoString) => {
    if (!isoString) return "Pendiente";
    return new Date(isoString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 3️⃣ RETURN CONDICIONAL
  if (!detalle) return null;

  // 4️⃣ RENDERIZADO VISUAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062e3a]/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in border border-[#342c1e]/20 flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-[#062e3a] to-[#342c1e] text-white flex justify-between items-center shrink-0">
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

        <div className="p-6 overflow-y-auto custom-scrollbar bg-[#f4f7f4] flex-1">
          {/* ============================================================== */}
          {/* VISTA CONSULTAS */}
          {/* ============================================================== */}
          {pestañaActual === "consultas" && (
            <div className="space-y-4">
              <div className="bg-[#b1cb0c]/10 p-4 rounded-2xl border border-[#b1cb0c]/30 flex justify-between items-center bg-white">
                <div>
                  <p className="text-xs font-black text-[#367933] uppercase tracking-widest mb-1">
                    Jornada
                  </p>
                  <p className="font-black text-[#062e3a] text-lg">
                    {formatFecha(detalle.fecha)} ({detalle.tipoTurno})
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

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="font-bold text-[#342c1e]">
                  Nutricionista:{" "}
                  <span className="font-black text-[#062e3a]">
                    {detalle.nutricionistaNombre}
                  </span>
                </p>
                <p className="font-bold text-[#342c1e] mt-2">
                  Farmacia:{" "}
                  <span className="font-black text-[#062e3a]">
                    {detalle.farmaciaNombre}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {Object.keys(formEdicion).map((campo) => (
                  <div
                    key={campo}
                    className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
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
                      className="w-full bg-[#f4f7f4] border border-gray-300 rounded-lg px-3 py-2 text-xl font-black text-[#367933] focus:ring-2 focus:ring-[#b1cb0c] outline-none disabled:bg-transparent disabled:border-transparent"
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
                  <p className="text-sm bg-white text-gray-700 p-4 rounded-xl border border-gray-200 font-medium shadow-sm">
                    {detalle.observacionesJornada}
                  </p>
                </div>
              )}

              <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                  <p className="text-xs font-black text-[#342c1e]/60 uppercase flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#367933]" />{" "}
                    Certificación de Prueba
                  </p>
                </div>
                {detalle.evidenciaUrl ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Momento de Subida:
                      </span>
                      <span className="text-[#062e3a] bg-[#f4f7f4] px-2 py-1 rounded border border-gray-200 shadow-sm">
                        {formatFechaHora(detalle.evidenciaFecha)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => onVerFoto(detalle.id)}
                        className="flex-1 py-2 bg-[#b1cb0c]/20 text-[#367933] hover:bg-[#b1cb0c]/40 font-black text-xs uppercase tracking-widest rounded-lg flex justify-center items-center gap-2 transition-colors border border-[#b1cb0c]/50"
                      >
                        <Eye size={16} /> Ver Foto
                      </button>
                      {detalle.estado !== "CANCELADA" && (
                        <button
                          onClick={() => onBorrarEvidencia(detalle.id)}
                          disabled={enviando}
                          className="py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 font-black text-xs uppercase tracking-widest rounded-lg flex justify-center items-center transition-colors border border-red-200 disabled:opacity-50"
                          title="Rechazar y borrar foto"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <Camera size={16} /> Sin evidencia adjunta
                  </div>
                )}
              </div>

              {detalle.estado !== "CANCELADA" && (
                <div className="flex flex-col md:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={onCancelarConsulta}
                    disabled={enviando}
                    className="flex-1 py-3 px-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm"
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

          {/* ============================================================== */}
          {/* VISTA PEDIDOS (ACTUALIZADA: UI UNIFICADA Y UNIDADES EN GRANDE) */}
          {/* ============================================================== */}
          {pestañaActual === "pedidos" && (
            <div className="space-y-4">
              {/* Bloque Superior: Info y Autoría */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <p className="text-sm font-black text-[#367933] uppercase tracking-widest">
                    Pedido #{detalle.id}
                  </p>
                  <span className="bg-[#062e3a] text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                    {detalle.estado}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#342c1e] space-y-1">
                  <p className="flex justify-between">
                    Fecha:{" "}
                    <span className="font-black text-[#062e3a]">
                      {detalle.fechaPedido || detalle.fecha}
                    </span>
                  </p>
                  {/* 👇 AHORA USA EL NOMBRE REAL DEL BACKEND 👇 */}
                  <p className="flex justify-between">
                    Realizado por:{" "}
                    <span className="font-black text-[#367933] bg-[#367933]/10 px-2 rounded">
                      {detalle.creadoPorNombre}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    Farmacia Destino:{" "}
                    <span className="font-black text-[#062e3a]">
                      {detalle.farmaciaNombre}
                    </span>
                  </p>
                </div>
              </div>

              {/* Desglose: Unidades más grandes y oscuras */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <p className="bg-[#e9ece9] text-[10px] font-black text-[#062e3a] uppercase p-3 border-b border-gray-200 tracking-widest flex items-center gap-2">
                  <Package size={14} /> Desglose de Unidades
                </p>
                <div className="p-4 space-y-4 bg-white">
                  {lineasPedidoAgrupadas.agrupadas.map((prod, idx) => {
                    const totalArticulosProd =
                      prod.udsCompradas + prod.udsRegalo + prod.udsVirtuales;
                    return (
                      <div
                        key={idx}
                        className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-black text-[#062e3a] text-sm leading-tight pr-4">
                            {prod.nombre}
                          </p>
                          {/* 👇 UNIDADES: GRANDES, NEGRAS Y VISIBLES 👇 */}
                          <div className="text-center min-w-[80px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                              Total
                            </p>
                            <p className="text-2xl font-black text-black bg-[#f4f7f4] px-3 py-1 rounded-lg border border-gray-300 shadow-sm">
                              {totalArticulosProd}
                            </p>
                          </div>
                        </div>

                        <ul className="text-xs space-y-1 font-bold">
                          {prod.udsCompradas > 0 && (
                            <li className="text-[#342c1e]/70">
                              • {prod.udsCompradas}x Compra Real (
                              {prod.subEuros.toFixed(2)}€)
                            </li>
                          )}
                          {prod.udsRegalo > 0 && (
                            <li className="text-[#b1cb0c] flex items-center gap-1">
                              <Gift size={12} /> {prod.udsRegalo}x Regalo/Bonif.
                            </li>
                          )}
                          {prod.udsVirtuales > 0 && (
                            <li className="text-[#367933] flex items-center gap-1">
                              <Wallet size={12} /> {prod.udsVirtuales}x Pagado
                              con Saldo
                            </li>
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Totales finales */}
                <div className="p-4 bg-[#f4f7f4] border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[#062e3a] uppercase tracking-widest">
                      Total Abonado
                    </span>
                    <span className="text-2xl font-black text-[#062e3a]">
                      {(
                        detalle.totalPedido ||
                        lineasPedidoAgrupadas.totales.euros
                      ).toFixed(2)}
                      €
                    </span>
                  </div>
                </div>
              </div>

              {detalle.repartos && detalle.repartos.length > 0 && (
                <div className="mt-4 border border-[#b1cb0c]/30 rounded-xl overflow-hidden shadow-sm bg-white">
                  <p className="bg-[#b1cb0c]/10 text-[10px] font-black text-[#367933] uppercase p-3 border-b border-[#b1cb0c]/20 tracking-widest">
                    Reparto de Comisión a Nutricionistas
                  </p>
                  <div className="p-4 space-y-2">
                    {detalle.repartos.map((r, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm font-black text-[#062e3a]"
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#b1cb0c]"></div>
                          {r.nutricionistaNombre}
                        </span>
                        <span className="text-[#367933] bg-[#b1cb0c]/20 px-3 py-1 rounded-lg">
                          {r.porcentaje}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VISTA SUMINISTROS */}
          {/* ============================================================== */}
          {pestañaActual === "suministros" && (
            <div className="space-y-4">
              <div className="bg-[#b1cb0c]/10 p-4 rounded-2xl border border-[#b1cb0c]/30 flex justify-between items-center bg-white">
                <div>
                  <p className="text-xs font-black text-[#367933] uppercase tracking-widest mb-1">
                    Petición Suministros
                  </p>
                  <p className="font-black text-[#062e3a] text-lg">
                    {detalle.nutricionistaNombre}
                  </p>
                </div>
                <span
                  className={`font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest text-white ${detalle.estado === "APROBADO" ? "bg-emerald-600" : "bg-red-500"}`}
                >
                  {detalle.estado}
                </span>
              </div>

              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <p className="bg-[#e9ece9] text-[10px] font-black text-[#062e3a] uppercase p-3 border-b border-gray-200 tracking-widest">
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
      </div>
    </div>
  );
};

export default ModalDetalleValidacion;
