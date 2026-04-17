import React from "react";
import { ShoppingBag, Plus, Wallet, Check, Banknote, Gift } from "lucide-react";

const CatalogoProductos = ({
  productos,
  ordenProductos,
  setOrdenProductos,
  farmaciaActual,
  esAdmin,
  esFarmacia,
  farmacias,
  farmaciaSeleccionada,
  setFarmaciaSeleccionada,
  agregarAlCarrito,
  umbralAlcanzado,
  saldoRestante,
  totalReal,
  getPrecioAplicado,
  carrito, // <-- ¡NUEVA PROP RECIBIDA!
}) => (
  <div className="space-y-6">
    {/* BLOQUE SUPERIOR UNIFICADO: Selector + Monedero */}
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-6">
      {/* Cabecera y Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-3xl text-white ${esAdmin ? "bg-[#062e3a]" : "bg-[#367933]"}`}
          >
            <ShoppingBag size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#062e3a]">
              {esAdmin ? "Pedido Proxy" : "Hacer Pedido"}
            </h2>
            <p className="text-[#342c1e] font-medium">
              Catálogo para{" "}
              <span className="font-black text-[#367933]">
                {farmaciaActual?.nombre || "..."}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {!esFarmacia && (
            <select
              value={farmaciaSeleccionada}
              onChange={(e) => setFarmaciaSeleccionada(e.target.value)}
              className="w-full sm:w-auto p-4 bg-[#f4f7f4] border-2 border-transparent rounded-2xl text-sm font-bold text-[#062e3a] outline-none focus:border-[#b1cb0c] cursor-pointer appearance-none pr-10"
            >
              {farmacias.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          )}

          <select
            value={ordenProductos}
            onChange={(e) => setOrdenProductos(e.target.value)}
            className="w-full sm:w-auto p-4 bg-[#062e3a] border-2 border-transparent rounded-2xl text-sm font-bold text-white outline-none focus:border-[#b1cb0c] cursor-pointer appearance-none pr-10"
          >
            <option value="por_defecto"> Destacados (Por defecto)</option>
            <option value="recomendados"> Recomendados</option>
            <option value="mas_vendidos"> Más vendidos</option>
            <option value="precio_asc"> Precio Ascendente</option>
            <option value="precio_desc"> Precio Descendente</option>
            <option value="alfabetico">A-Z Alfabético</option>
            <option value="za">Z-A Alfabético</option>
          </select>

        </div>
      </div>

      {/* Tarjeta Monedero Integrada */}
      <div
        className={`relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lg ${umbralAlcanzado ? "bg-gradient-to-r from-[#006633] to-[#68b54e]" : "bg-gradient-to-r from-[#062e3a] to-[#342c1e]"}`}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="bg-white/20 p-3 rounded-[1.25rem] backdrop-blur-md">
              <Wallet size={28} />
            </div>
            <div>
              <p className="text-[#bed000] text-[10px] font-black uppercase tracking-widest mb-1">
                Monedero Farmacia
              </p>
              <p className="text-4xl font-black">{saldoRestante.toFixed(2)}€</p>
            </div>
          </div>

          {umbralAlcanzado ? (
            <div className="bg-[#b1cb0c]/20 border border-[#b1cb0c]/30 px-5 py-2.5 rounded-2xl flex items-center gap-3 w-full md:w-auto justify-center">
              <Check className="text-[#b1cb0c]" size={18} strokeWidth={4} />
              <p className="text-xs font-black uppercase text-[#b1cb0c]">
                Saldo Desbloqueado
              </p>
            </div>
          ) : (
            <div className="text-right w-full md:w-auto flex flex-col items-end">
              <div className="bg-white/10 px-5 py-2.5 rounded-2xl mb-2 w-full text-center md:text-right">
                <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
                  Faltan{" "}
                  <span className="text-[#bed000] font-black text-sm">
                    {(80 - totalReal).toFixed(2)}€
                  </span>{" "}
                  para usar saldo
                </p>
              </div>
              <div className="w-full md:w-48 bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#b1cb0c] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((totalReal / 80) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <Banknote
          size={150}
          className="absolute -right-10 -bottom-16 text-white opacity-10 rotate-12 pointer-events-none"
        />
      </div>
    </div>

    {/* GRID DE PRODUCTOS (Ahora con scroll interno) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar pb-6">
      {productos
        .filter((p) => p.hayExistencias)
        .map((prod) => {
          // 👇 CÁLCULO DE CANTIDADES EN LA CESTA 👇
          const enCarrito = carrito ? carrito.filter((c) => c.productoId === prod.id) : [];
          const udsReal = enCarrito.filter((c) => !c.pagadoConSaldo).reduce((sum, c) => sum + c.cantidad, 0);
          const udsSaldo = enCarrito.filter((c) => c.pagadoConSaldo).reduce((sum, c) => sum + c.cantidad, 0);
          const udsRegalo = enCarrito.reduce((sum, c) => sum + c.bonificados, 0);
          const totalUds = udsReal + udsSaldo + udsRegalo;

          return (
            <div
              key={prod.id}
              className={`bg-white border-2 rounded-[2.5rem] p-6 hover:shadow-lg transition-all flex flex-col justify-between ${totalUds > 0 ? "border-[#b1cb0c]/50" : "border-gray-50 hover:border-[#b1cb0c]/30"}`}
            >
              <div>
                <div className="flex justify-between mb-4">
                  <span className="bg-[#b1cb0c]/20 text-[#367933] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {prod.acronimo}
                  </span>
                  <span className="text-[10px] font-black uppercase text-[#367933]">
                    En Stock
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#062e3a] leading-tight">
                  {prod.nombreProducto}
                </h3>
                <p className="text-3xl font-black text-[#062e3a] mt-4">
                  {getPrecioAplicado(prod).toFixed(2)}€
                </p>
              </div>

              <div className="mt-8">
                {/* 👇 INDICADOR DE CESTA INDIVIDUAL (Aparece si hay algo seleccionado) 👇 */}
                {totalUds > 0 && (
                  <div className="bg-[#f4f7f4] p-3 rounded-2xl border border-gray-200 mb-4 animate-fade-in">
                    <p className="text-[14px] font-black text-[#062e3a] uppercase tracking-widest mb-2 flex justify-between">
                      Seleccionado <span>{totalUds} uds</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                      {udsReal > 0 && (
                        <span className="bg-white border border-gray-200 text-[#342c1e] px-2 py-1 rounded-lg">
                          {udsReal}x Regular
                        </span>
                      )}
                      {udsSaldo > 0 && (
                        <span className="bg-[#b1cb0c]/20 border border-[#b1cb0c]/30 text-[#367933] px-2 py-1 rounded-lg flex items-center gap-1">
                          <Wallet size={10} /> {udsSaldo}x Saldo
                        </span>
                      )}
                      {udsRegalo > 0 && (
                        <span className="bg-[#367933]/10 border border-[#367933]/20 text-[#367933] px-2 py-1 rounded-lg flex items-center gap-1">
                          <Gift size={10} /> +{udsRegalo} Regalo
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => agregarAlCarrito(prod, false)}
                    disabled={!farmaciaSeleccionada}
                    className="w-full bg-[#062e3a] text-white py-4 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
                  >
                    <Plus size={18} /> Añadir a Cesta Real
                  </button>
                  {umbralAlcanzado && (
                    <button
                      onClick={() => agregarAlCarrito(prod, true)}
                      disabled={saldoRestante < getPrecioAplicado(prod)}
                      className="w-full bg-[#b1cb0c]/10 text-[#367933] border border-[#b1cb0c]/50 py-4 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wallet size={18} /> Comprar con Saldo
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  </div>
);

export default CatalogoProductos;