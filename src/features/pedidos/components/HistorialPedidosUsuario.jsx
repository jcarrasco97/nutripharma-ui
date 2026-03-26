import React from "react";
import { History, Filter, ArrowUpDown, ShieldCheck } from "lucide-react";

const HistorialPedidosUsuario = ({
  esAdmin,
  pedidosFiltrados,
  mesFiltro,
  setMesFiltro,
  ordenFiltro,
  setOrdenFiltro,
  mesesDisponibles,
  setPedidoSeleccionado,
}) => {
  if (esAdmin) {
    return (
      <div className="bg-[#062e3a]/5 p-8 rounded-[3rem] border border-[#062e3a]/10 text-center">
        <ShieldCheck size={48} className="mx-auto text-[#b1cb0c] mb-4" />
        <h3 className="text-xl font-black text-[#062e3a] mb-2">
          Modo Admin (Proxy)
        </h3>
        <p className="text-[#342c1e] text-sm font-medium">
          Estás creando un pedido para una farmacia. Verás el resultado en{" "}
          <b>Validaciones</b>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#b1cb0c]/20 p-2 rounded-xl text-[#367933]">
            <History size={20} />
          </div>
          <h3 className="text-lg font-black text-[#062e3a]">Mis pedidos</h3>
        </div>
        <span className="bg-[#062e3a]/10 text-[#062e3a] text-[10px] font-black px-3 py-1 rounded-full">
          {pedidosFiltrados.length} REG.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          className="w-full p-3 bg-[#f4f7f4] rounded-2xl text-[10px] font-black text-[#062e3a] outline-none"
        >
          {mesesDisponibles.map((m) => (
            <option key={m} value={m}>
              {m === "Todos" ? "TODOS LOS MESES" : m}
            </option>
          ))}
        </select>
        <select
          value={ordenFiltro}
          onChange={(e) => setOrdenFiltro(e.target.value)}
          className="w-full p-3 bg-[#f4f7f4] rounded-2xl text-[10px] font-black text-[#062e3a] outline-none"
        >
          <option value="recientes">MÁS RECIENTES</option>
          <option value="precio_desc">MAYOR IMPORTE</option>
        </select>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {pedidosFiltrados.length === 0 ? (
          <p className="text-center py-12 text-[#342c1e]/50 text-sm font-bold bg-[#f4f7f4] rounded-[2rem]">
            Sin resultados
          </p>
        ) : (
          pedidosFiltrados.map((ped) => (
            <div
              key={ped.id}
              className="group bg-[#f4f7f4] rounded-[1.5rem] p-5 border-2 border-transparent hover:bg-white hover:border-[#b1cb0c] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-black text-[#062e3a] text-sm">
                    Pedido #{ped.id}
                  </p>
                  <p className="text-[10px] font-bold text-[#342c1e]/60">
                    {ped.fechaPedido}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#062e3a]">
                    {(ped.totalPedido || 0).toFixed(2)}€
                  </p>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${ped.estado === "LIQUIDADO" ? "bg-[#b1cb0c]/20 text-[#367933]" : "bg-[#062e3a]/10 text-[#062e3a]"}`}
                  >
                    {ped.estado}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPedidoSeleccionado(ped)}
                className="w-full py-2 bg-white border border-gray-200 text-[#342c1e] rounded-xl text-[10px] font-black uppercase hover:bg-[#062e3a] hover:text-white transition-all"
              >
                Ver Detalle
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorialPedidosUsuario;
