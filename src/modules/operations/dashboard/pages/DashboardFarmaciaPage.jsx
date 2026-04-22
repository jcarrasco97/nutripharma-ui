import React from "react";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { useDashboardFarmacia } from "../hooks/useDashboardFarmacia";
import FarmaciaCabeceraSaldo from "../components/farmacia/FarmaciaCabeceraSaldo";
import FarmaciaHistorialPedidos from "../components/farmacia/FarmaciaHistorialPedidos";

const DashboardFarmaciaPage = ({ cambiarVista }) => {
  const hook = useDashboardFarmacia();

  if (hook.cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  if (hook.error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center flex flex-col items-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-red-800 mb-2">
          Error de conexión
        </h3>
        <p className="text-red-600 mb-6 max-w-md">
          No hemos podido recuperar los datos. Verifica tu conexión.
        </p>
        <button
          onClick={hook.cargarDatos}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2"
        >
          <RefreshCcw size={18} /> Reintentar
        </button>
      </div>
    );
  }

  if (!hook.perfil) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <FarmaciaCabeceraSaldo perfil={hook.perfil} cambiarVista={cambiarVista} />
      <FarmaciaHistorialPedidos
        mesFiltro={hook.mesFiltro}
        setMesFiltro={hook.setMesFiltro}
        ordenFiltro={hook.ordenFiltro}
        setOrdenFiltro={hook.setOrdenFiltro}
        mesesDisponibles={hook.mesesDisponibles}
        pedidosFiltradosYOrdenados={hook.pedidosFiltradosYOrdenados}
      />
    </div>
  );
};

export default DashboardFarmaciaPage;
