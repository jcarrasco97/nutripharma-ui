import React from "react";
import {
  ShoppingCart,
  ShoppingBag,
  Wallet,
  Info,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";

const CestaPedidos = ({
  carrito,
  modificarCantidad,
  totalReal,
  totalVirtual,
  umbralAlcanzado,
  farmaciaSeleccionada,
  enviando,
  handleRealizarPedido,
  esAdmin,
  getPrecioAplicado,
}) => {
  return (
    <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-8 sticky top-6">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl ${esAdmin ? "bg-[#062e3a]/10 text-[#062e3a]" : "bg-[#b1cb0c]/20 text-[#367933]"}`}
          >
            <ShoppingCart size={24} />
          </div>
          <h3 className="text-xl font-black text-[#062e3a]">Mi Cesta</h3>
        </div>
        <span className="bg-[#062e3a] text-white text-xs font-black px-4 py-1.5 rounded-full">
          {carrito.length} artículos
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 mb-8 custom-scrollbar">
        {carrito.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-[#f4f7f4] rounded-[2rem] border-2 border-dashed border-gray-200">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-[#342c1e]/60 font-bold">Tu cesta está vacía.</p>
          </div>
        ) : (
          carrito.map((item) => (
            <div
              key={`${item.productoId}-${item.pagadoConSaldo}`}
              className={`p-5 rounded-[1.5rem] border-2 transition-all ${item.pagadoConSaldo ? "bg-[#b1cb0c]/10 border-[#b1cb0c]/30" : "bg-[#f4f7f4] border-transparent"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <p className="font-black text-[#062e3a] text-sm">
                    {item.productoInfo.nombreProducto}
                  </p>
                  {item.pagadoConSaldo && (
                    <span className="bg-[#367933] text-white text-[9px] font-black px-2 py-0.5 rounded-md mt-1 uppercase">
                      Saldo
                    </span>
                  )}
                </div>
                <p
                  className={`font-black ${item.pagadoConSaldo ? "text-[#367933]" : "text-[#062e3a]"}`}
                >
                  {(
                    item.cantidad * getPrecioAplicado(item.productoInfo)
                  ).toFixed(2)}
                  €
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                  <button
                    onClick={() =>
                      modificarCantidad(
                        item.productoId,
                        -1,
                        item.pagadoConSaldo,
                      )
                    }
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-black text-sm">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() =>
                      modificarCantidad(item.productoId, 1, item.pagadoConSaldo)
                    }
                    className="p-2 text-gray-400 hover:text-[#367933]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {!item.pagadoConSaldo && item.bonificados > 0 && (
                  <div className="bg-[#b1cb0c] text-[#062e3a] px-2 py-1 rounded-lg text-[9px] font-black">
                    +{item.bonificados} REGALO
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#f4f7f4] rounded-[2rem] p-6 space-y-4 mb-8">
        {totalVirtual > 0 && (
          <div className="flex justify-between items-center text-[#367933] px-2 text-sm font-bold">
            <span>
              <Wallet size={14} className="inline mr-1" /> Saldo usado
            </span>
            <span>-{totalVirtual.toFixed(2)}€</span>
          </div>
        )}
        <div className="flex justify-between items-end border-t border-gray-200 pt-4 px-2">
          <div>
            <p className="text-xs font-black text-[#342c1e] uppercase">
              A Pagar Real
            </p>
            {!umbralAlcanzado && totalReal > 0 && (
              <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                <Info size={10} /> Mínimo 80€
              </p>
            )}
          </div>
          <p
            className={`text-4xl font-black ${umbralAlcanzado ? "text-[#367933]" : "text-[#062e3a]"}`}
          >
            {totalReal.toFixed(2)}€
          </p>
        </div>
      </div>

      <button
        onClick={handleRealizarPedido}
        disabled={
          carrito.length === 0 ||
          enviando ||
          (!umbralAlcanzado && totalVirtual > 0) ||
          !farmaciaSeleccionada
        }
        className={`w-full text-white font-black py-5 rounded-[1.5rem] shadow-xl flex items-center justify-center gap-4 transition-all ${esAdmin ? "bg-[#062e3a] hover:bg-[#062e3a]/90" : "bg-[#367933] hover:bg-[#006633]"} disabled:bg-gray-300 disabled:shadow-none`}
      >
        {enviando ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <ShoppingBag size={24} />{" "}
            {esAdmin ? "Procesar Proxy" : "Confirmar Pedido"}
          </>
        )}
      </button>
    </div>
  );
};

export default CestaPedidos;
