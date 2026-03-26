import React from "react";
import {
  ShoppingBag,
  ChevronRight,
  Plus,
  Wallet,
  AlertCircle,
} from "lucide-react";

const CatalogoProductos = ({
  productos,
  farmaciaActual,
  esAdmin,
  esFarmacia,
  farmacias,
  farmaciaSeleccionada,
  setFarmaciaSeleccionada,
  agregarAlCarrito,
  umbralAlcanzado,
  saldoRestante,
  getPrecioAplicado,
}) => (
  <div className="xl:col-span-7 space-y-6">
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center gap-6">
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
        {!esFarmacia && (
          <select
            value={farmaciaSeleccionada}
            onChange={(e) => setFarmaciaSeleccionada(e.target.value)}
            className="p-4 bg-[#f4f7f4] border-2 border-transparent rounded-2xl text-sm font-bold text-[#062e3a] outline-none focus:border-[#b1cb0c]"
          >
            {farmacias.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {productos
        .filter((p) => p.hayExistencias)
        .map((prod) => (
          <div
            key={prod.id}
            className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-6 hover:shadow-lg hover:border-[#b1cb0c]/30 transition-all flex flex-col justify-between"
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
            <div className="mt-8 space-y-3">
              <button
                onClick={() => agregarAlCarrito(prod, false)}
                disabled={!farmaciaSeleccionada}
                className="w-full bg-[#062e3a] text-white py-4 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-3"
              >
                <Plus size={18} /> Añadir a Cesta Real
              </button>
              {umbralAlcanzado && (
                <button
                  onClick={() => agregarAlCarrito(prod, true)}
                  disabled={saldoRestante < getPrecioAplicado(prod)}
                  className="w-full bg-[#b1cb0c]/10 text-[#367933] border border-[#b1cb0c]/50 py-4 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-3"
                >
                  <Wallet size={18} /> Comprar con Saldo
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  </div>
);

export default CatalogoProductos;
