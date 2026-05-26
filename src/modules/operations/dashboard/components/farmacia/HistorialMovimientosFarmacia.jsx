import React from "react";
import { History } from "lucide-react";
import HistorialMovimientosSaldo from "@/modules/organization/components/HistorialMovimientosSaldo";

const HistorialMovimientosFarmacia = ({ farmaciaId }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-5">
      <div className="bg-[#b1cb0c]/20 p-2.5 rounded-xl">
        <History size={18} className="text-[#367933]" />
      </div>
      <div>
        <h3 className="text-base font-black text-[#062e3a]">Historial de saldo</h3>
        <p className="text-xs text-[#342c1e]/50 font-medium">
          Entradas, gastos y ajustes de tu saldo virtual
        </p>
      </div>
    </div>
    <HistorialMovimientosSaldo farmaciaId={farmaciaId} esFarmacia />
  </div>
);

export default HistorialMovimientosFarmacia;
