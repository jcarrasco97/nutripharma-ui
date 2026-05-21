import React from "react";
import { Car } from "lucide-react";

const PanelDesplazamiento = ({ datosResumen }) => {
  if (!datosResumen) return null;

  return (
    <div className="bg-surface rounded-md border border-neutral/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Car size={16} className="text-neutral/40" />
        <div>
          <p className="text-sm font-medium text-secondary">
            Logística y desplazamiento
          </p>
          <p className="text-xs text-neutral/40">
            Kilómetros acumulados en el mes
          </p>
        </div>
      </div>
      <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-5 py-4 inline-block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral/40 mb-1">
          Distancia total recorrida
        </p>
        <p className="text-4xl font-semibold text-secondary tabular-nums">
          {datosResumen.totalKilometros}
          <span className="text-lg font-medium text-neutral/50 ml-1">km</span>
        </p>
      </div>
    </div>
  );
};

export default PanelDesplazamiento;
