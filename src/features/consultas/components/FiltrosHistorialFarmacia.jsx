import React from "react";
import { Search, Calendar, ArrowUpDown } from "lucide-react";

const FiltrosHistorialFarmacia = ({
  busqueda, setBusqueda,
  fechaFiltro, setFechaFiltro,
  orden, setOrden
}) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap gap-4">
      <div className="relative flex-1 min-w-[250px]">
        <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre del nutricionista..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#b1cb0c] text-[#062e3a] outline-none transition-all"
        />
      </div>

      <div className="relative min-w-[180px]">
        <Calendar size={18} className="absolute left-4 top-3.5 text-gray-400" />
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#b1cb0c] text-[#062e3a] outline-none transition-all font-bold"
        />
      </div>

      <div className="relative min-w-[180px]">
        <ArrowUpDown size={18} className="absolute left-4 top-3.5 text-gray-400" />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#b1cb0c] text-[#062e3a] outline-none transition-all appearance-none font-bold"
        >
          <option value="desc">Más recientes</option>
          <option value="asc">Más antiguos</option>
        </select>
      </div>
    </div>
  );
};

export default FiltrosHistorialFarmacia;