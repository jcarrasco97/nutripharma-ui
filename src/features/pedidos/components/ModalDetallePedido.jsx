import React from "react";
import { X, Package, History } from "lucide-react";

const ModalDetallePedido = ({ pedido, onCerrar }) => {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#062e3a]/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-[#006633] to-[#68b54e] p-8 text-white flex justify-between items-center">
          <div>
            <span className="bg-white/20 text-[#bed000] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Detalle de Operación
            </span>
            <h3 className="text-2xl font-black mt-2 text-white">
              Pedido #{pedido.id}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-[#bed000] text-sm font-bold">
              <p className="flex items-center gap-1">
                <Package size={14} /> {pedido.lineas?.length || 0} líneas
              </p>
              <span className="text-white/50">•</span>
              <p className="flex items-center gap-1 text-white">
                <History size={14} /> {pedido.fechaPedido}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        <div className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {pedido.lineas?.map((linea) => {
              const precioUnidad =
                linea.precioUnitario || linea.precioAplicado || 0;
              const subtotal = linea.subtotal || precioUnidad * linea.cantidad;
              return (
                <div
                  key={linea.id}
                  className="bg-[#f4f7f4] rounded-2xl p-4 flex justify-between items-center border border-transparent hover:border-[#b1cb0c]/50 transition-all"
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className={`p-3 rounded-xl ${linea.pagadoConSaldo ? "bg-[#b1cb0c]/20 text-[#367933]" : "bg-white text-[#367933] border border-gray-200"}`}
                    >
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#062e3a]">
                        {linea.productoNombre}
                      </p>
                      <p className="text-xs font-bold text-[#342c1e]/70">
                        {linea.cantidad} uds • {precioUnidad.toFixed(2)}€/ud
                      </p>
                      {linea.bonificados > 0 && (
                        <span className="inline-flex bg-[#b1cb0c] text-[#062e3a] text-[10px] px-2 py-0.5 rounded-md mt-2 font-black">
                          🎁 +{linea.bonificados} BONIFICADOS
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-black text-lg ${linea.pagadoConSaldo ? "text-[#367933]" : "text-[#062e3a]"}`}
                    >
                      {subtotal.toFixed(2)}€
                    </p>
                    {linea.pagadoConSaldo && (
                      <p className="text-[10px] font-black text-[#367933]/70 uppercase">
                        Saldo
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 bg-[#062e3a] text-white flex justify-between items-center">
          <div>
            <p className="text-[#b1cb0c] text-xs font-black uppercase mb-1">
              Total abonado real
            </p>
            <p className="text-4xl font-black">
              {(pedido.totalPedido || 0).toFixed(2)}
              <span className="text-xl ml-1 text-[#bed000]">€</span>
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallePedido;
