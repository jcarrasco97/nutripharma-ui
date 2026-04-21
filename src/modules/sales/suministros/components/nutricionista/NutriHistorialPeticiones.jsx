import React from "react";
import { ClipboardList, Filter, ArrowUpDown, Clock } from "lucide-react";

const NutriHistorialPeticiones = ({
  peticionesFiltradas,
  mesFiltro,
  setMesFiltro,
  estadoFiltro,
  setEstadoFiltro,
  ordenFiltro,
  setOrdenFiltro,
  mesesDisponibles,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 h-fit">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-[#062e3a]/10 p-3 rounded-2xl text-[#062e3a]">
          <ClipboardList size={24} />
        </div>
        <h2 className="text-2xl font-black text-[#062e3a]">Mis Peticiones</h2>
      </div>

      {/* Barra de Filtros Interna */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[120px]">
          <Filter
            size={14}
            className="absolute left-3.5 top-3.5 text-gray-400"
          />
          <select
            value={mesFiltro}
            onChange={(e) => setMesFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs font-bold text-[#062e3a] border-2 border-transparent rounded-xl bg-[#f4f7f4] focus:bg-white focus:border-[#b1cb0c] transition-colors outline-none appearance-none"
          >
            {mesesDisponibles.map((mes) => (
              <option key={mes} value={mes}>
                {mes === "Todos" ? "Todos los meses" : mes}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 min-w-[120px]">
          <Filter
            size={14}
            className="absolute left-3.5 top-3.5 text-gray-400"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs font-bold text-[#062e3a] border-2 border-transparent rounded-xl bg-[#f4f7f4] focus:bg-white focus:border-[#b1cb0c] transition-colors outline-none appearance-none"
          >
            <option value="Todos">Todos los estados</option>
            <option value="SOLICITADO">Solicitados</option>
            <option value="APROBADO">Aprobados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
        </div>

        <div className="relative flex-1 min-w-[120px]">
          <ArrowUpDown
            size={14}
            className="absolute left-3.5 top-3.5 text-gray-400"
          />
          <select
            value={ordenFiltro}
            onChange={(e) => setOrdenFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs font-bold text-[#062e3a] border-2 border-transparent rounded-xl bg-[#f4f7f4] focus:bg-white focus:border-[#b1cb0c] transition-colors outline-none appearance-none"
          >
            <option value="recientes">Más Recientes</option>
            <option value="antiguos">Más Antiguos</option>
          </select>
        </div>
      </div>

      {/* Listado scrolleable */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {peticionesFiltradas.length === 0 ? (
          <p className="text-sm font-bold text-[#342c1e]/50 text-center py-12 bg-[#f4f7f4] rounded-2xl border-2 border-dashed border-gray-200">
            No se encontraron peticiones.
          </p>
        ) : (
          peticionesFiltradas.map((pet) => (
            <div
              key={pet.id}
              className="border-2 border-gray-50 rounded-[1.5rem] p-5 flex flex-col gap-3 hover:border-[#b1cb0c]/30 hover:shadow-md transition-all bg-white"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-black flex items-center gap-1.5 text-[#062e3a]">
                  <Clock size={14} className="text-[#367933]" />{" "}
                  {pet.fechaPeticion}
                </span>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    pet.estado === "SOLICITADO"
                      ? "bg-[#b1cb0c]/20 text-[#367933]"
                      : pet.estado === "APROBADO"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {pet.estado}
                </span>
              </div>
              <div className="text-sm text-[#062e3a] mt-2 bg-[#f4f7f4] p-4 rounded-xl border border-gray-100">
                <ul className="list-disc pl-5 text-xs font-bold text-[#062e3a] space-y-1.5">
                  {pet.materiales.map((m, idx) => (
                    <li key={idx} className="marker:text-[#367933]">
                      {m.nombre}{" "}
                      <span className="text-[#342c1e]/60 font-medium">
                        ({m.cantidadEstandar} uds)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NutriHistorialPeticiones;
