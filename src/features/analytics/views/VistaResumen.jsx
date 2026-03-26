import React from "react";
import { Loader2, AlertCircle, TrendingUp, Award } from "lucide-react";
import { useResumenNutri } from "../hooks/useResumenNutri";
import PanelCabeceraNutri from "../components/PanelCabeceraNutri";
import PanelEstadoActual from "../components/PanelEstadoActual";
import PanelTramosIncentivos from "../components/PanelTramosIncentivos";

const VistaResumen = () => {
  const hook = useResumenNutri();

  if (hook.cargando)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  if (hook.errorBackend)
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-2xl border border-red-100 p-8 text-center animate-fade-in">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-red-800 mb-2">Error de Acceso</h3>
        <p className="text-red-600">{hook.errorBackend}</p>
      </div>
    );
  if (!hook.perfil)
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-3xl border border-gray-100 p-8 text-center animate-fade-in">
        <TrendingUp size={48} className="text-[#b1cb0c] mb-4" />
        <h3 className="text-xl font-bold text-[#062e3a] mb-2">
          Panel de Objetivos
        </h3>
        <p className="text-[#342c1e]">
          Este resumen de métricas y comisiones está disponible únicamente para
          perfiles de Nutricionista.
        </p>
      </div>
    );
  if (!hook.datosResumen) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* CABECERA */}
      <div className="flex flex-col lg:flex-row gap-6">
        <PanelCabeceraNutri
          perfil={hook.perfil}
          datosResumen={hook.datosResumen}
          horasContrato={hook.horasContrato}
        />
      </div>

      {/* PANEL DE INCENTIVOS */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-[#f4f7f4] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#b1cb0c]/20 p-2 rounded-xl text-[#367933]">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#062e3a]">
              Tus Objetivos y Comisiones
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#342c1e] font-bold">
              Comisión Estimada
            </p>
            <p className="text-3xl font-black text-[#367933]">
              {hook.comisionFinal.toFixed(2)}€
            </p>
          </div>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <PanelEstadoActual
            facturacionTotal={hook.datosResumen.facturacionTotal}
            facturacionProductos={hook.datosResumen.facturacionProductos}
            porcentajeLogrado={hook.porcentajeLogrado}
            nivelAlcanzado={hook.nivelAlcanzado}
            proximoObjetivo={hook.proximoObjetivo}
            nombreProximoObj={hook.nombreProximoObj}
            METAS={hook.METAS}
          />
          <PanelTramosIncentivos
            nivelAlcanzado={hook.nivelAlcanzado}
            METAS={hook.METAS}
          />
        </div>
      </div>
    </div>
  );
};

export default VistaResumen;
