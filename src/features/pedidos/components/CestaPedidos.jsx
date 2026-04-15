import React from "react";
import Button from "../../../core/components/ui/Button"; import {
  ShoppingCart,
  ShoppingBag,
  Wallet,
  Info,
  Plus,
  Minus,
  Loader2,
  Gift
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

  // 🧠 LÓGICA DE AGRUPACIÓN
  const itemsAgrupados = Object.values(
    carrito.reduce((acc, item) => {
      if (!acc[item.productoId]) {
        acc[item.productoId] = {
          productoId: item.productoId,
          productoInfo: item.productoInfo,
          cantidadReal: 0,
          cantidadSaldo: 0,
          bonificados: 0,
        };
      }
      if (item.pagadoConSaldo) {
        acc[item.productoId].cantidadSaldo += item.cantidad;
      } else {
        acc[item.productoId].cantidadReal += item.cantidad;
        acc[item.productoId].bonificados += item.bonificados;
      }
      return acc;
    }, {})
  );

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
          {carrito.reduce((total, item) => total + item.cantidad, 0)} items
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 mb-8 custom-scrollbar">
        {itemsAgrupados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-[#f4f7f4] rounded-[2rem] border-2 border-dashed border-gray-200">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-[#342c1e]/60 font-bold">Tu cesta está vacía.</p>
          </div>
        ) : (
          itemsAgrupados.map((item) => {
            const precioUnitario = getPrecioAplicado(item.productoInfo);
            const subtotalReal = item.cantidadReal * precioUnitario;
            const subtotalSaldo = item.cantidadSaldo * precioUnitario;
            const totalUnidadesFisicas = item.cantidadReal + item.cantidadSaldo + item.bonificados;

            return (
              <div
                key={item.productoId}
                className="bg-[#f4f7f4] p-6 rounded-[1.5rem] border-2 border-transparent"
              >
                {/* 1. CABECERA DEL PRODUCTO (Solo Nombre y Total Unidades) */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-200/60 pb-4">
                  <p className="font-black text-[#062e3a] text-sm pr-4 uppercase">
                    {item.productoInfo.nombreProducto}
                  </p>
                  <div className="bg-[#062e3a]/5 px-3 py-1 rounded-lg text-right">
                    <p className="text-[14px] font-black text-[#062e3a] uppercase tracking-wider">
                      {totalUnidadesFisicas} Unidades
                    </p>
                  </div>
                </div>

                {/* 2. DESGLOSE Y CONTROLES */}
                <div className="space-y-4">

                  {/* Fila: Compra Regular */}
                  {item.cantidadReal > 0 && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black text-[#342c1e]/60 uppercase tracking-widest block mb-0.5">
                          Compra Regular
                        </span>
                        <span className="text-sm font-black text-[#062e3a]">
                          {subtotalReal.toFixed(2)}€
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.bonificados > 0 && (
                          <div className="flex items-center gap-1 bg-[#b1cb0c]/20 text-[#367933] px-2 py-1 rounded-lg text-[12px] font-black">
                            <Gift size={14} /> +{item.bonificados} Regalo
                          </div>
                        )}
                        <div className="flex items-center bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                          <button
                            onClick={() => modificarCantidad(item.productoId, -1, false)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={item.cantidadReal === 0 ? "" : item.cantidadReal}
                            onFocus={(e) => e.target.select()} // UX PRO: Al pinchar, selecciona todo el texto para reescribir encima
                            onChange={(e) => {
                              // 1. Capturamos lo que escribe. Si borra todo, asumimos 0.
                              const nuevoValor = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                              if (isNaN(nuevoValor) || nuevoValor < 0) return;

                              // 2. Calculamos la diferencia (delta) para usar tu hook existente
                              const delta = nuevoValor - item.cantidadReal;
                              modificarCantidad(item.productoId, delta, false);
                            }}
                            // El truco de Tailwind para ocultar las flechitas feas del input number
                            className="w-10 text-center font-black text-xs text-[#062e3a] bg-transparent outline-none focus:bg-[#b1cb0c]/10 focus:ring-1 focus:ring-[#b1cb0c]/50 rounded transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => modificarCantidad(item.productoId, 1, false)}
                            className="p-1.5 text-gray-400 hover:text-[#367933] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fila: Usando Saldo */}
                  {item.cantidadSaldo > 0 && (
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="flex items-center gap-1 text-[10px] font-black text-[#367933] uppercase tracking-widest mb-0.5">
                          <Wallet size={12} /> Usando Saldo
                        </span>
                        <span className="text-sm font-black text-[#367933]">
                          {subtotalSaldo.toFixed(2)}€
                        </span>
                      </div>

                      <div className="flex items-center bg-[#b1cb0c]/10 rounded-xl p-1 border border-[#b1cb0c]/30 shadow-sm">
                        <button
                          onClick={() => modificarCantidad(item.productoId, -1, true)}
                          className="p-1.5 text-[#367933]/60 hover:text-red-500 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={item.cantidadSaldo === 0 ? "" : item.cantidadSaldo}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const nuevoValor = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                            if (isNaN(nuevoValor) || nuevoValor < 0) return;
                            const delta = nuevoValor - item.cantidadSaldo;
                            modificarCantidad(item.productoId, delta, true);
                          }}
                          className="w-10 text-center font-black text-xs text-[#367933] bg-transparent outline-none focus:bg-[#367933]/10 focus:ring-1 focus:ring-[#367933]/30 rounded transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => modificarCantidad(item.productoId, 1, true)}
                          className="p-1.5 text-[#367933]/60 hover:text-[#367933] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. TICKET DE RESUMEN FINAL (Visualmente distinto) */}
      <div className="bg-[#062e3a] rounded-[2rem] p-6 space-y-4 mb-8 relative overflow-hidden shadow-lg border border-[#062e3a]">

        {totalVirtual > 0 && (
          <div className="flex justify-between items-center px-2 text-sm font-bold text-white/80 border-b border-white/10 pb-4">
            <span>
              <Wallet size={14} className="inline mr-2" />
              Saldo descontado
            </span>
            <span className="text-[#bed000] font-black tracking-wide">
              -{totalVirtual.toFixed(2)}€
            </span>
          </div>
        )}

        <div className="flex justify-between items-end pt-2 px-2">
          <div>
            <p className="text-xs font-black text-white/60 uppercase tracking-widest">
              A Pagar Real
            </p>
            {!umbralAlcanzado && totalReal > 0 && (
              <p className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-1 bg-red-400/10 px-2 py-0.5 rounded-md">
                <Info size={10} /> Mínimo 80€
              </p>
            )}
          </div>
          <p className={`text-4xl font-black ${umbralAlcanzado ? "text-white" : "text-white/50"}`}>
            {totalReal.toFixed(2)}€
          </p>
        </div>
      </div>

      {/* 👇 BOTÓN CORPORATIVO IMPLEMENTADO 👇 */}
      <Button
        onClick={handleRealizarPedido}
        disabled={
          carrito.length === 0 ||
          (!umbralAlcanzado && totalVirtual > 0) ||
          !farmaciaSeleccionada
        }
        isLoading={enviando}
        variant="primary"
        className="w-full py-5 rounded-[1.5rem] text-lg"
      >
        <ShoppingBag size={24} />
        {esAdmin ? "Procesar Proxy" : "Confirmar Pedido"}
      </Button>
    </div>
  );
};

export default CestaPedidos;