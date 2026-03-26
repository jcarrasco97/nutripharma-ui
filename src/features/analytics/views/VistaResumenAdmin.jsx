import React from "react";
import { Loader2 } from "lucide-react";
import { useResumenAdmin } from "../hooks/useResumenAdmin";
import AdminModalEvento from "../components/AdminModalEvento";
import AdminGraficaFacturacion from "../components/AdminGraficaFacturacion";
import AdminCalendarioOperativo from "../components/AdminCalendarioOperativo";

const VistaResumenAdmin = () => {
  const hook = useResumenAdmin();

  if (hook.cargando && hook.facturacion.length === 0) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <AdminModalEvento
        eventoSeleccionado={hook.eventoSeleccionado}
        setEventoSeleccionado={hook.setEventoSeleccionado}
      />

      <AdminGraficaFacturacion
        anio={hook.anio}
        setAnio={hook.setAnio}
        facturacion={hook.facturacion}
      />

      <AdminCalendarioOperativo
        anio={hook.anio}
        mes={hook.mes}
        cambiarMes={hook.cambiarMes}
        diasMes={hook.diasMes}
        offset={hook.offset}
        getEventosDelDia={hook.getEventosDelDia}
        fechaActual={hook.fechaActual}
        setEventoSeleccionado={hook.setEventoSeleccionado}
      />
    </div>
  );
};

export default VistaResumenAdmin;
