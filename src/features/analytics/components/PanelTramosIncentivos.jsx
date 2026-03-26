import React from "react";
import { Award } from "lucide-react";

const PanelTramosIncentivos = ({ nivelAlcanzado, METAS }) => (
  <div>
    <h4 className="text-sm font-bold text-[#342c1e] uppercase tracking-wider mb-6">
      Tramos de Incentivos
    </h4>
    <div className="space-y-4">
      <div
        className={`p-4 rounded-2xl border-2 transition-all ${nivelAlcanzado === "OB1" ? "border-[#b1cb0c] bg-[#b1cb0c]/10" : nivelAlcanzado === "OB2" || nivelAlcanzado === "OB3" ? "border-[#367933]/30 bg-[#367933]/5 opacity-60" : "border-gray-100 bg-white opacity-50"}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-lg text-[#062e3a]">Objetivo 1</span>
          <span className="font-black text-lg text-[#367933]">
            +{METAS.OB1.incentivo.toFixed(2)}€
          </span>
        </div>
        <p className="text-xs font-bold text-[#342c1e]">
          Global: {METAS.OB1.facturacion.toFixed(0)}€ • Productos:{" "}
          {METAS.OB1.productos.toFixed(0)}€
        </p>
      </div>

      <div
        className={`p-4 rounded-2xl border-2 transition-all ${nivelAlcanzado === "OB2" ? "border-[#b1cb0c] bg-[#b1cb0c]/10" : nivelAlcanzado === "OB3" ? "border-[#367933]/30 bg-[#367933]/5 opacity-60" : "border-gray-100 bg-white opacity-50"}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-lg text-[#062e3a]">Objetivo 2</span>
          <span className="font-black text-lg text-[#367933]">
            +{METAS.OB2.incentivo.toFixed(2)}€
          </span>
        </div>
        <p className="text-xs font-bold text-[#342c1e]">
          Global: {METAS.OB2.facturacion.toFixed(0)}€ • Productos:{" "}
          {METAS.OB2.productos.toFixed(0)}€
        </p>
        <p className="text-xs font-bold text-[#367933] mt-1">
          + {METAS.OB2.exceso * 100}% sobre exceso
        </p>
      </div>

      <div
        className={`p-4 rounded-2xl border-2 transition-all ${nivelAlcanzado === "OB3" ? "border-[#367933] bg-[#367933]/10 shadow-md" : "border-gray-100 bg-white opacity-50"}`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-lg flex items-center gap-2 text-[#062e3a]">
            Objetivo 3 <Award size={18} className="text-[#367933]" />
          </span>
          <span className="font-black text-lg text-[#367933]">
            +{METAS.OB3.incentivo.toFixed(2)}€
          </span>
        </div>
        <p className="text-xs font-bold text-[#342c1e]">
          Global: {METAS.OB3.facturacion.toFixed(0)}€ • Productos:{" "}
          {METAS.OB3.productos.toFixed(0)}€
        </p>
        <p className="text-xs font-bold text-[#367933] mt-1">
          + {METAS.OB3.exceso * 100}% sobre exceso
        </p>
      </div>
    </div>
  </div>
);

export default PanelTramosIncentivos;
