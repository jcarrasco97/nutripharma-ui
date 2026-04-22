import React from "react";
import { History, Loader2 } from "lucide-react";

import { useHistorialFarmacia } from "../hooks/useHistorialFarmacia";
import FiltrosHistorialFarmacia from "../components/FiltrosHistorialFarmacia";
import ListadoConsultasFarmacia from "../components/ListadoConsultasFarmacia";

const HistorialFarmaciaPage = () => {
  const hook = useHistorialFarmacia();

  if (hook.cargando) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* CABECERA Y RESUMEN RÁPIDO */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#367933] p-4 rounded-3xl text-white shadow-lg shadow-[#367933]/20">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#062e3a]">
              Historial de Consultas
            </h2>
            <p className="text-[#342c1e] font-medium">
              Registro de nutricionistas y jornadas en tu farmacia.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#f4f7f4] px-6 py-3 rounded-2xl border border-gray-100 text-center shadow-sm">
            <span className="block text-[10px] font-black text-[#342c1e]/60 uppercase tracking-widest">
              Total Jornadas
            </span>
            <span className="text-xl font-black text-[#062e3a]">
              {hook.consultas.length}
            </span>
          </div>
        </div>
      </div>

      <FiltrosHistorialFarmacia {...hook} />
      <ListadoConsultasFarmacia consultasFiltradas={hook.consultasFiltradas} />
    </div>
  );
};

export default HistorialFarmaciaPage;
