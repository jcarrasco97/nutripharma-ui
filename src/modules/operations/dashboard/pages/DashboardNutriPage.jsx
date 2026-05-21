import React, { useState } from "react";
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { useDashboardNutri } from "../hooks/useDashboardNutri";
import PanelCabeceraNutri from "../components/nutricionista/PanelCabeceraNutri";
import PanelObjetivosComisiones from "../components/nutricionista/PanelObjetivosComisiones";
import PanelDesplazamiento from "../components/nutricionista/PanelDesplazamiento";

const TABS = [
  { id: "objetivos", label: "Objetivos" },
  { id: "desplazamiento", label: "Desplazamiento" },
];

const DashboardNutriPage = () => {
  const hook = useDashboardNutri();
  const [pestana, setPestana] = useState("objetivos");

  if (hook.cargando)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );

  if (hook.errorBackend)
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-neutral/[0.02] rounded-md border border-neutral/10 p-8 text-center">
        <AlertCircle size={36} className="text-neutral/30 mb-3" />
        <p className="text-sm font-medium text-secondary mb-1">Error de acceso</p>
        <p className="text-xs text-neutral/50">{hook.errorBackend}</p>
      </div>
    );

  if (!hook.perfil)
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-neutral/[0.02] rounded-md border border-neutral/10 p-8 text-center">
        <TrendingUp size={36} className="text-neutral/30 mb-3" />
        <p className="text-sm font-medium text-secondary">Panel de objetivos</p>
        <p className="text-xs text-neutral/50 mt-1">
          Solo disponible para perfiles de nutricionista.
        </p>
      </div>
    );

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      <PanelCabeceraNutri
        perfil={hook.perfil}
        horasContrato={hook.horasContrato}
        datosResumen={hook.datosResumen}
        mesesDisponibles={hook.mesesDisponibles}
        mesFiltro={hook.mesFiltro}
        setMesFiltro={hook.setMesFiltro}
      />

      {/* TABS */}
      <div className="flex gap-0 border-b border-neutral/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPestana(tab.id)}
            className={`pb-2 mr-5 text-[14px] font-medium transition-colors border-b-2 px-1 outline-none ${
              pestana === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {pestana === "objetivos" && hook.datosResumen && (
        <PanelObjetivosComisiones
          facturacionTotal={hook.datosResumen.facturacionTotal}
          facturacionProductos={hook.datosResumen.facturacionProductos}
          porcentajeLogrado={hook.porcentajeLogrado}
          nivelAlcanzado={hook.nivelAlcanzado}
          proximoObjetivo={hook.proximoObjetivo}
          nombreProximoObj={hook.nombreProximoObj}
          comisionFinal={hook.comisionFinal}
          METAS={hook.METAS}
        />
      )}

      {pestana === "desplazamiento" && (
        <PanelDesplazamiento datosResumen={hook.datosResumen} />
      )}
    </div>
  );
};

export default DashboardNutriPage;
