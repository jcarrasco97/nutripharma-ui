import React, { useMemo } from "react";
import { XCircle, Package, Gift, Wallet, Banknote } from "lucide-react";

const ModalDetallePedido = ({ pedido, onCerrar }) => {
  // 1️⃣ HOOKS SIEMPRE ARRIBA
  const lineasAgrupadas = useMemo(() => {
    if (!pedido || !pedido.lineas) return [];

    const mapa = {};

    pedido.lineas.forEach((linea) => {
      const nombre = linea.productoNombre || "Producto Desconocido";
      const precioUd = linea.precioUnitario || linea.precioAplicado || 0;

      if (!mapa[nombre]) {
        mapa[nombre] = {
          nombre: nombre,
          precioUnitario: precioUd,
          udsCompradas: 0,
          udsRegalo: 0,
          udsVirtuales: 0,
          subtotalEuros: 0,
          subtotalVirtual: 0,
        };
      }

      if (linea.bonificados) {
        mapa[nombre].udsRegalo += linea.bonificados;
      }

      if (linea.pagadoConSaldo) {
        mapa[nombre].udsVirtuales += linea.cantidad;
        mapa[nombre].subtotalVirtual += linea.cantidad * precioUd;
      } else {
        mapa[nombre].udsCompradas += linea.cantidad;
        mapa[nombre].subtotalEuros += linea.cantidad * precioUd;
      }
    });

    return Object.values(mapa);
  }, [pedido]);

  const { totalEuros, totalVirtual } = useMemo(() => {
    return lineasAgrupadas.reduce(
      (acc, linea) => ({
        totalEuros: acc.totalEuros + linea.subtotalEuros,
        totalVirtual: acc.totalVirtual + linea.subtotalVirtual,
      }),
      { totalEuros: 0, totalVirtual: 0 },
    );
  }, [lineasAgrupadas]);

  // 2️⃣ RETURN CONDICIONAL
  if (!pedido) return null;

  // 4️⃣ RENDERIZADO VISUAL
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#062e3a]/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in border border-[#342c1e]/20 flex flex-col max-h-[90vh]">
        {/* Cabecera Estilo Validaciones */}
        <div className="p-6 bg-gradient-to-r from-[#062e3a] to-[#342c1e] text-white flex justify-between items-center shrink-0">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Package size={20} className="text-[#bed000]" /> Detalle del Pedido
          </h3>
          <button
            onClick={onCerrar}
            className="text-white/50 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar bg-[#f4f7f4] flex-1 space-y-4">
          {/* Bloque 1: Info General del Pedido */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <p className="text-sm font-black text-[#367933] uppercase tracking-widest">
                Pedido #{pedido.id}
              </p>
              <span className="bg-[#062e3a] text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                {pedido.estado}
              </span>
            </div>
            <div className="text-sm font-bold text-[#342c1e] space-y-1">
              <p className="flex justify-between items-center">
                Fecha:{" "}
                <span className="font-black text-[#062e3a]">
                  {pedido.fechaPedido || pedido.fecha}
                </span>
              </p>
              {/* 👇 ELIMINADA LA LÍNEA DE "REALIZADO POR" 👇 */}
              <p className="flex justify-between items-center mt-1">
                Destino:{" "}
                <span className="font-black text-[#062e3a]">
                  {pedido.farmaciaNombre}
                </span>
              </p>
            </div>
          </div>

          {/* Bloque 2: Lista Agrupada Inteligente */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <p className="bg-[#e9ece9] text-[10px] font-black text-[#062e3a] uppercase p-3 border-b border-gray-200 tracking-widest flex items-center gap-2">
              <Package size={14} /> Desglose de Unidades
            </p>
            <div className="p-4 space-y-4 bg-white">
              {lineasAgrupadas.map((prod, idx) => {
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
                      {/* 👇 UNIDADES EN GIGANTE Y OSCURO PARA MONTAR CAJAS 👇 */}
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
                        <li className="text-[#342c1e]/70 flex justify-between items-center">
                          <span>• {prod.udsCompradas}x Compra Real</span>
                          <span>{prod.subtotalEuros.toFixed(2)}€</span>
                        </li>
                      )}
                      {prod.udsRegalo > 0 && (
                        <li className="text-[#b1cb0c] flex items-center gap-1 mt-1">
                          <Gift size={12} /> {prod.udsRegalo}x Regalo/Bonif.
                        </li>
                      )}
                      {prod.udsVirtuales > 0 && (
                        <li className="text-[#367933] flex justify-between items-center mt-1">
                          <span className="flex items-center gap-1">
                            <Wallet size={12} /> {prod.udsVirtuales}x Pagado con
                            Saldo
                          </span>
                          <span>{prod.subtotalVirtual.toFixed(2)}€</span>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>

          {/* Bloque 2.5: Observaciones (solo si existen) */}
          {pedido.observaciones?.trim() && (
            <div className="bg-amber-50/50 border border-dashed border-amber-200/50 rounded-xl p-4 flex gap-3 items-start">
              <div className="bg-amber-100/60 p-1.5 rounded-md shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-700/70 uppercase tracking-widest mb-1">
                  Observaciones
                </p>
                <p className="text-sm font-medium text-[#342c1e]/80 leading-relaxed whitespace-pre-wrap">
                  {pedido.observaciones}
                </p>
              </div>
            </div>
          )}

            {/* Resumen de Totales */}
            <div className="space-y-2 p-4 border-t border-gray-200 bg-[#f4f7f4]">
              {totalVirtual > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                  <span className="text-[10px] font-black text-[#367933] uppercase flex items-center gap-1 tracking-widest">
                    <Wallet size={12} /> Saldo Consumido
                  </span>
                  <span className="text-sm font-black text-[#367933]">
                    {totalVirtual.toFixed(2)}€
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-black text-[#062e3a] uppercase flex items-center gap-1 tracking-widest">
                  <Banknote size={16} /> Total Abonado
                </span>
                <span className="text-2xl font-black text-[#062e3a]">
                  {(pedido.totalPedido || totalEuros).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallePedido;
