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

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* CABECERA (Rediseñada) */}
      <PanelCabeceraNutri
        perfil={hook.perfil}
        horasContrato={hook.horasContrato}
        datosResumen={hook.datosResumen}
        // 👇 Nuevas props para el selector de meses 👇
        mesesDisponibles={hook.mesesDisponibles}
        mesFiltro={hook.mesFiltro}
        setMesFiltro={hook.setMesFiltro}
      />

      {/* PANEL DE INCENTIVOS */}
      {hook.datosResumen && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 bg-[#f4f7f4] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933] shadow-inner">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#062e3a] leading-tight">
                  Tus Objetivos y Comisiones
                </h3>
                <p className="text-[11px] font-bold text-[#342c1e]/50 uppercase tracking-widest mt-1">
                  Proyección del mes actual
                </p>
              </div>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm w-full md:w-auto text-right">
              <p className="text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest mb-1">
                Comisión Estimada
              </p>
              <p className="text-4xl font-black text-[#367933]">
                {hook.comisionFinal?.toFixed(2) || "0.00"}€
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
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
      )}
    </div>
  );
};

export default VistaResumen;
