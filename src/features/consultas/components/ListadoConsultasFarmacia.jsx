import React from "react";
import { Filter, User, Calendar, Clock, TrendingUp } from "lucide-react";

const ListadoConsultasFarmacia = ({ consultasFiltradas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {consultasFiltradas.length === 0 ? (
        <div className="col-span-full bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
          <Filter size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-[#342c1e]/60 font-bold">
            No hay registros que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        consultasFiltradas.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#b1cb0c]/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933] group-hover:bg-[#367933] group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <span
                className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${c.estado === "CONFIRMADA" ? "bg-[#b1cb0c]/20 text-[#367933]" : "bg-amber-100 text-amber-700"}`}
              >
                {c.estado}
              </span>
            </div>

            <h3 className="text-lg font-black text-[#062e3a] mb-1">
              {c.nutricionistaNombre}
            </h3>
            <div className="flex items-center gap-2 text-[#342c1e]/60 mb-6">
              <Calendar size={14} />
              <span className="text-xs font-bold uppercase">{c.fecha}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#342c1e]/50 uppercase tracking-tighter">
                  Horario
                </span>
                <div className="flex items-center gap-1 text-[#062e3a] font-bold text-sm mt-1">
                  <Clock size={14} className="text-[#367933]" />
                  {c.horaInicio?.substring(0, 5)} - {c.horaFin?.substring(0, 5)}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#342c1e]/50 uppercase tracking-tighter">
                  Turno
                </span>
                <span className="text-[#062e3a] font-bold text-sm uppercase mt-1">
                  {c.tipoTurno}
                </span>
              </div>
            </div>

            {/* Recuadro de Comisión Generada */}
            <div className="mt-6 bg-[#f4f7f4] p-4 rounded-2xl flex justify-between items-center border border-transparent group-hover:border-[#b1cb0c]/30 transition-colors">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#367933]" />
                <span className="text-xs font-bold text-[#062e3a]">
                  Comisión Generada
                </span>
              </div>
              <span className="text-lg font-black text-[#367933]">
                {((c.nuevas * 25 + c.revisiones * 20) * 0.3).toFixed(2)}€
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListadoConsultasFarmacia;
