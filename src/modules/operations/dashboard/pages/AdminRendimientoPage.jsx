import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDashboardAdmin } from "../hooks/useDashboardAdmin";
import AdminModalEvento from "../components/admin/AdminModalEvento";
import AdminAuditoriaPanel from "../components/admin/AdminAuditoriaPanel";
import AdminGraficaFacturacion from "../components/admin/AdminGraficaFacturacion";

const AdminRendimientoPage = ({ setVistaActual }) => {
  const hook = useDashboardAdmin();
  const [pestana, setPestana] = useState("auditoria");

  if (hook.cargando && hook.facturacion.length === 0) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-10 -mt-2 md:-mt-4">
      <AdminModalEvento
        eventoSeleccionado={hook.eventoSeleccionado}
        setEventoSeleccionado={hook.setEventoSeleccionado}
      />

      <div className="flex gap-2">
        {[
          { id: "auditoria", label: "Auditoría" },
          { id: "facturacion", label: "Facturación" },
        ].map((tab) => {
          const isActive = pestana === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPestana(tab.id)}
              className={`pb-2 text-[14px] font-medium transition-colors whitespace-nowrap border-b-2 px-1 outline-none ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {pestana === "auditoria" && <AdminAuditoriaPanel />}
      
      {pestana === "facturacion" && (
        <AdminGraficaFacturacion
          anio={hook.anio}
          setAnio={hook.setAnio}
          facturacion={hook.facturacion}
          listadoFarmacias={hook.listadoFarmacias}
          listadoNutricionistas={hook.listadoNutricionistas}
          filtroFarmacia={hook.filtroFarmacia}
          setFiltroFarmacia={hook.setFiltroFarmacia}
          filtroNutri={hook.filtroNutri}
          setFiltroNutri={hook.setFiltroNutri}
        />
      )}
    </div>
  );
};

export default AdminRendimientoPage;
