import React from "react";
import { Search, Filter } from "lucide-react";

const FiltrosDocumentos = ({
  filtroTexto,
  setFiltroTexto,
  filtroMes,
  setFiltroMes,
  mesesDisponibles,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre de archivo..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#b1cb0c] outline-none transition-colors text-[#062e3a]"
        />
      </div>

      <div className="relative w-full md:w-64">
        <Filter size={16} className="absolute left-3 top-3.5 text-gray-400" />
        <select
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#b1cb0c] outline-none transition-colors appearance-none text-[#062e3a]"
        >
          {mesesDisponibles.map((mes) => (
            <option key={mes} value={mes}>
              {mes === "Todos" ? "Todas las fechas" : mes}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltrosDocumentos;
