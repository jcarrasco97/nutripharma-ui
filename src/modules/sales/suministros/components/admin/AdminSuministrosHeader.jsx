import React from "react";
import { Package, Search, Filter } from "lucide-react";

const AdminSuministrosHeader = ({
  busqueda,
  setBusqueda,
  estadoFiltro,
  setEstadoFiltro,
}) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-[#367933] p-4 rounded-3xl text-white shadow-lg shadow-[#367933]/20">
          <Package size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#062e3a]">
            Validar Suministros
          </h2>
          <p className="text-[#342c1e] font-medium">
            Gestiona las peticiones de material de la red.
          </p>
        </div>
      </div>

      <div className="flex w-full md:w-auto gap-4">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar nutricionista..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-2xl text-sm text-[#062e3a] outline-none focus:border-[#b1cb0c] focus:bg-white transition-colors"
          />
        </div>

        {/* Filtro de Estado */}
        <div className="relative flex-1">
          <Filter size={16} className="absolute left-4 top-4 text-gray-400" />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-2xl text-sm text-[#062e3a] outline-none focus:border-[#b1cb0c] focus:bg-white transition-colors appearance-none font-bold"
          >
            <option value="Todos">Todos los estados</option>
            <option value="SOLICITADO">Pendientes</option>
            <option value="APROBADO">Aprobados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminSuministrosHeader;
