import React from "react";
import {
  Calendar,
  Filter,
  ArrowUpDown,
  Package,
  CheckCircle2,
} from "lucide-react";

const FarmaciaHistorialPedidos = ({
  mesFiltro,
  setMesFiltro,
  ordenFiltro,
  setOrdenFiltro,
  mesesDisponibles,
  pedidosFiltradosYOrdenados,
}) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 lg:p-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h3 className="text-xl font-bold text-[#062e3a] flex items-center gap-2">
          <Calendar className="text-[#367933]" size={24} /> Mi Historial de
          Pedidos
        </h3>
        <p className="text-sm text-[#342c1e] mt-1">
          Consulta tus últimos movimientos y liquidaciones.
        </p>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-40">
          <Filter size={16} className="absolute left-3 top-3 text-gray-400" />
          <select
            value={mesFiltro}
            onChange={(e) => setMesFiltro(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl text-[#062e3a] font-medium appearance-none bg-gray-50 focus:ring-2 focus:ring-[#b1cb0c] focus:outline-none"
          >
            {mesesDisponibles.map((mes) => (
              <option key={mes} value={mes}>
                {mes === "Todos" ? "Todos los meses" : mes}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 md:w-40">
          <ArrowUpDown
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />
          <select
            value={ordenFiltro}
            onChange={(e) => setOrdenFiltro(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl text-[#062e3a] font-medium appearance-none bg-gray-50 focus:ring-2 focus:ring-[#b1cb0c] focus:outline-none"
          >
            <option value="recientes">Más Recientes</option>
            <option value="antiguos">Más Antiguos</option>
            <option value="precio_desc">Mayor Importe</option>
            <option value="precio_asc">Menor Importe</option>
          </select>
        </div>
      </div>
    </div>

    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {pedidosFiltradosYOrdenados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            No se encontraron pedidos con estos filtros.
          </p>
        </div>
      ) : (
        pedidosFiltradosYOrdenados.map((ped) => {
          const saldoUsado =
            ped.lineas
              ?.filter((l) => l.pagadoConSaldo)
              .reduce(
                (acc, l) =>
                  acc +
                  (l.subtotal ||
                    (l.precioUnitario || l.precioAplicado || 0) * l.cantidad),
                0,
              ) || 0;
          return (
            <div
              key={ped.id}
              className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#f4f7f4] transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-black text-[#062e3a] text-lg">
                    Pedido #{ped.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${ped.estado === "LIQUIDADO" ? "bg-[#b1cb0c]/20 text-[#367933]" : "bg-amber-100 text-amber-700"}`}
                  >
                    {ped.estado === "LIQUIDADO" && <CheckCircle2 size={12} />}{" "}
                    {ped.estado?.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-[#342c1e]">
                  {ped.fechaPedido} • {ped.lineas?.length || 0} líneas de
                  producto
                </p>
              </div>
              <div className="text-left md:text-right w-full md:w-auto bg-white md:bg-transparent p-3 md:p-0 rounded-xl border md:border-none border-gray-100">
                <p className="font-black text-2xl text-[#062e3a]">
                  {(ped.totalPedido || 0).toFixed(2)}€
                </p>
                {saldoUsado > 0 && (
                  <p className="text-xs text-[#367933] font-bold mt-1 bg-[#b1cb0c]/20 inline-block px-2 py-1 rounded-md">
                    Saldo usado: -{saldoUsado.toFixed(2)}€
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default FarmaciaHistorialPedidos;
